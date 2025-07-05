import { firestore } from "../Database/Firebase"
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"

class WebRTCService {
  constructor() {
    this.peer = null
    this.localStream = null
    this.remoteStream = null
    this.currentCallId = null
    this.userId = null
    this.isInitiator = false
    this.peerConnection = null
  }

  // Initialize user for video calling
  async initializeUser(userId, userName) {
    this.userId = userId

    // Add user to active users collection
    await setDoc(doc(firestore, "activeUsers", userId), {
      userId,
      userName,
      status: "available",
      timestamp: serverTimestamp(),
    })

    // Listen for incoming call requests
    this.listenForCallRequests()
  }

  // Get user's media stream
  async getUserMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      return this.localStream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      throw error
    }
  }

  // Find and connect to a random available user
  async findRandomUser() {
    const activeUsersRef = collection(firestore, "activeUsers")
    const q = query(activeUsersRef, where("status", "==", "available"), where("userId", "!=", this.userId))

    const snapshot = await getDocs(q)
    const availableUsers = []

    snapshot.forEach((doc) => {
      availableUsers.push({ id: doc.id, ...doc.data() })
    })

    if (availableUsers.length === 0) {
      throw new Error("No users available for call")
    }

    // Select random user
    const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]
    return randomUser
  }

  // Initiate a call to another user
  async initiateCall(targetUserId) {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.currentCallId = callId
    this.isInitiator = true

    // Create call request
    await setDoc(doc(firestore, "callRequests", callId), {
      callId,
      initiatorId: this.userId,
      targetId: targetUserId,
      status: "pending",
      timestamp: serverTimestamp(),
    })

    // Update both users' status
    await updateDoc(doc(firestore, "activeUsers", this.userId), {
      status: "calling",
    })
    await updateDoc(doc(firestore, "activeUsers", targetUserId), {
      status: "receiving_call",
    })

    return callId
  }

  // Accept an incoming call
  async acceptCall(callId) {
    this.currentCallId = callId
    this.isInitiator = false

    // Update call request status
    await updateDoc(doc(firestore, "callRequests", callId), {
      status: "accepted",
    })

    // Start WebRTC connection
    await this.startWebRTCConnection()
  }

  // Reject an incoming call
  async rejectCall(callId) {
    await updateDoc(doc(firestore, "callRequests", callId), {
      status: "rejected",
    })

    // Reset user status
    await updateDoc(doc(firestore, "activeUsers", this.userId), {
      status: "available",
    })
  }

  // Start WebRTC peer connection using native WebRTC API
  async startWebRTCConnection() {
    if (!this.localStream) {
      await this.getUserMedia()
    }

    // Create RTCPeerConnection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    })

    // Add local stream to peer connection
    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream)
    })

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
      if (this.onRemoteStream) {
        this.onRemoteStream(event.streams[0])
      }
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.sendIceCandidate(event.candidate)
      }
    }

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", this.peerConnection.connectionState)
      if (this.peerConnection.connectionState === "connected") {
        if (this.onConnected) {
          this.onConnected()
        }
      } else if (this.peerConnection.connectionState === "disconnected") {
        this.endCall()
      }
    }

    // Listen for signal data from the other peer
    this.listenForSignalData()

    // Create offer if initiator
    if (this.isInitiator) {
      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)
      await this.sendOffer(offer)
    }
  }

  // Send offer through Firestore
  async sendOffer(offer) {
    const signalDoc = doc(firestore, "callSessions", this.currentCallId)
    await setDoc(
      signalDoc,
      {
        offer: offer,
        timestamp: serverTimestamp(),
      },
      { merge: true },
    )
  }

  // Send answer through Firestore
  async sendAnswer(answer) {
    const signalDoc = doc(firestore, "callSessions", this.currentCallId)
    await setDoc(
      signalDoc,
      {
        answer: answer,
        timestamp: serverTimestamp(),
      },
      { merge: true },
    )
  }

  // Send ICE candidate through Firestore
  async sendIceCandidate(candidate) {
    const signalDoc = doc(firestore, "callSessions", this.currentCallId)
    await setDoc(
      signalDoc,
      {
        [`iceCandidate_${this.isInitiator ? "initiator" : "target"}_${Date.now()}`]: candidate,
        timestamp: serverTimestamp(),
      },
      { merge: true },
    )
  }

  // Listen for WebRTC signal data from the other peer
  listenForSignalData() {
    const signalDoc = doc(firestore, "callSessions", this.currentCallId)

    this.signalListener = onSnapshot(signalDoc, async (doc) => {
      const data = doc.data()
      if (!data) return

      try {
        // Handle offer (for target user)
        if (!this.isInitiator && data.offer && !this.peerConnection.remoteDescription) {
          await this.peerConnection.setRemoteDescription(data.offer)
          const answer = await this.peerConnection.createAnswer()
          await this.peerConnection.setLocalDescription(answer)
          await this.sendAnswer(answer)
        }

        // Handle answer (for initiator)
        if (this.isInitiator && data.answer && !this.peerConnection.remoteDescription) {
          await this.peerConnection.setRemoteDescription(data.answer)
        }

        // Handle ICE candidates
        Object.keys(data).forEach(async (key) => {
          if (key.startsWith("iceCandidate_")) {
            const isFromInitiator = key.includes("initiator")
            const shouldProcess = this.isInitiator ? !isFromInitiator : isFromInitiator

            if (shouldProcess && data[key]) {
              try {
                await this.peerConnection.addIceCandidate(new RTCIceCandidate(data[key]))
              } catch (error) {
                console.error("Error adding ICE candidate:", error)
              }
            }
          }
        })
      } catch (error) {
        console.error("Error handling signal data:", error)
        if (this.onError) {
          this.onError(error)
        }
      }
    })
  }

  // Listen for incoming call requests
  listenForCallRequests() {
    const callRequestsRef = collection(firestore, "callRequests")
    const q = query(callRequestsRef, where("targetId", "==", this.userId))

    this.callRequestListener = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const callData = change.doc.data()
          if (callData.status === "pending" && this.onIncomingCall) {
            this.onIncomingCall(callData)
          }
        }
      })
    })
  }

  // Toggle audio
  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return !audioTrack.enabled // Return muted state
      }
    }
    return false
  }

  // Toggle video
  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return !videoTrack.enabled // Return video off state
      }
    }
    return false
  }

  // End the current call
  async endCall() {
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    // Clean up Firestore documents
    if (this.currentCallId) {
      try {
        await deleteDoc(doc(firestore, "callRequests", this.currentCallId))
        await deleteDoc(doc(firestore, "callSessions", this.currentCallId))
      } catch (error) {
        console.error("Error cleaning up call documents:", error)
      }
    }

    // Reset user status
    if (this.userId) {
      try {
        await updateDoc(doc(firestore, "activeUsers", this.userId), {
          status: "available",
        })
      } catch (error) {
        console.error("Error updating user status:", error)
      }
    }

    // Clean up listeners
    if (this.signalListener) {
      this.signalListener()
    }

    // Reset state
    this.currentCallId = null
    this.isInitiator = false
    this.remoteStream = null

    if (this.onCallEnded) {
      this.onCallEnded()
    }
  }

  // Remove user from active users when they leave
  async removeUser() {
    if (this.userId) {
      try {
        await deleteDoc(doc(firestore, "activeUsers", this.userId))
      } catch (error) {
        console.error("Error removing user:", error)
      }
    }

    if (this.callRequestListener) {
      this.callRequestListener()
    }

    await this.endCall()
  }

  // Event handlers (to be set by the component)
  onIncomingCall = null
  onRemoteStream = null
  onCallEnded = null
  onError = null
  onConnected = null
}

export default new WebRTCService()
