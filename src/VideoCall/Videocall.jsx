"use client";

import { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  User,
  UserPlus,
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import webRTCService from "../Services/WebRtcService";
import { auth } from "../Database/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AnonymousVideoCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState("Ready to connect");
  const [incomingCall, setIncomingCall] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callTimerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Initialize authentication listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        initializeVideoCall(user);
      } else {
        setStatus("Please log in to use video calling");
      }
    });

    return () => {
      unsubscribe();
      webRTCService.removeUser();
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, []);

  const initializeVideoCall = async (user) => {
    try {
      // Initialize WebRTC service
      await webRTCService.initializeUser(
        user.uid,
        user.displayName || "Anonymous"
      );

      // Set up event handlers
      webRTCService.onIncomingCall = handleIncomingCall;
      webRTCService.onRemoteStream = handleRemoteStream;
      webRTCService.onCallEnded = handleCallEnded;
      webRTCService.onError = handleError;
      webRTCService.onConnected = handleConnected;

      // Get user media
      const stream = await webRTCService.getUserMedia();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setStatus("Ready to find someone to talk to");
    } catch (error) {
      console.error("Error initializing video call:", error);
      setStatus("Failed to access camera. Please check permissions.");
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const handleIncomingCall = (callData) => {
    setIncomingCall(callData);
    setStatus("Incoming call...");
    toast.info("Someone wants to talk to you!");
  };

  const handleRemoteStream = (stream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  };

  const handleConnected = () => {
    setIsCallActive(true);
    setIsSearching(false);
    setStatus("Connected");
    startCallTimer();
    toast.success("Call connected!");
  };

  const handleCallEnded = () => {
    setIsCallActive(false);
    setIsSearching(false);
    setIncomingCall(null);
    setStatus("Call ended. Ready to find someone new.");
    stopCallTimer();

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleError = (error) => {
    console.error("WebRTC Error:", error);
    toast.error("Connection error occurred");
    setIsCallActive(false);
    setIsSearching(false);
    setStatus("Connection error. Please try again.");
    stopCallTimer();
  };

  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallDuration(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const findRandomUser = async () => {
    if (!currentUser) {
      toast.error("Please log in first");
      return;
    }

    setIsSearching(true);
    setStatus("Looking for someone to talk to...");

    try {
      const randomUser = await webRTCService.findRandomUser();
      const callId = await webRTCService.initiateCall(randomUser.userId);

      setStatus("Calling someone...");

      // Wait for call acceptance or timeout
      setTimeout(() => {
        if (!isCallActive && isSearching) {
          setIsSearching(false);
          setStatus("No one answered. Try again?");
          webRTCService.endCall();
        }
      }, 30000); // 30 second timeout
    } catch (error) {
      console.error("Error finding user:", error);
      setIsSearching(false);
      if (error.message === "No users available for call") {
        setStatus("No one is available right now. Try again later.");
        toast.info("No one is available right now. Try again later.");
      } else {
        setStatus("Failed to find someone. Please try again.");
        toast.error("Failed to find someone. Please try again.");
      }
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      setStatus("Connecting...");
      await webRTCService.acceptCall(incomingCall.callId);
      await webRTCService.startWebRTCConnection();
      setIncomingCall(null);
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Failed to accept call");
      setIncomingCall(null);
      setStatus("Failed to connect. Please try again.");
    }
  };

  const rejectCall = async () => {
    if (!incomingCall) return;

    try {
      await webRTCService.rejectCall(incomingCall.callId);
      setIncomingCall(null);
      setStatus("Ready to find someone to talk to");
    } catch (error) {
      console.error("Error rejecting call:", error);
    }
  };

  const endCall = async () => {
    try {
      await webRTCService.endCall();
      setIsCallActive(false);
      setIsSearching(false);
      setStatus("Ready to find someone new to talk to");
      stopCallTimer();
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const cancelSearch = () => {
    setIsSearching(false);
    setStatus("Ready to find someone to talk to");
    webRTCService.endCall();
  };

  const toggleMute = () => {
    const muted = webRTCService.toggleAudio();
    setIsMuted(muted);
  };

  const toggleVideo = () => {
    const videoOff = webRTCService.toggleVideo();
    setIsVideoOff(videoOff);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full flex justify-start">
        <Button
          onClick={() => navigate("/MindMendor/ui")}
          className="bg-[#1479EA] hover:bg-blue-600 text-white"
        >
         <ArrowLeft /> Go Back
        </Button>
      </div>

      <Card className="w-full max-w-4xl mx-auto bg-slate-800/50 border-slate-700 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Anonymous Video Call</h2>
          <div className="flex items-center gap-4">
            {isCallActive && (
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {formatTime(callDuration)}
              </span>
            )}
            <span className="text-sm">{status}</span>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-slate-900">
          {/* Remote Video */}
          {isCallActive ? (
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              {isSearching ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-white text-lg">Looking for someone...</p>
                </div>
              ) : incomingCall ? (
                <div className="text-center">
                  <div className="animate-pulse">
                    <Phone className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  </div>
                  <p className="text-white text-lg">Incoming call...</p>
                </div>
              ) : (
                <div className="text-center">
                  <User className="w-24 h-24 text-gray-400 mb-4" />
                  <p className="text-gray-400">Ready to connect</p>
                </div>
              )}
            </div>
          )}

          {/* Local Video */}
          <video
            ref={localVideoRef}
            className="absolute bottom-4 right-4 w-1/4 aspect-video bg-slate-800 rounded-lg shadow-lg z-10 border-2 border-slate-600"
            autoPlay
            playsInline
            muted
          />
        </div>

        {/* Controls */}
        <CardContent className="flex items-center justify-center gap-4 p-6 bg-slate-800/30">
          {!isCallActive && !isSearching && !incomingCall && (
            <Button
              onClick={findRandomUser}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
              disabled={!currentUser}
            >
              <UserPlus size={20} />
              Find Someone to Talk
            </Button>
          )}

          {isSearching && (
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span className="text-white">Searching for someone...</span>
              <Button
                onClick={cancelSearch}
                variant="outline"
                className="flex items-center gap-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <X size={16} />
                Cancel
              </Button>
            </div>
          )}

          {incomingCall && (
            <div className="flex items-center gap-4">
              <span className="text-white text-lg">Someone wants to talk!</span>
              <Button
                onClick={acceptCall}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
              >
                <Phone size={16} />
                Accept
              </Button>
              <Button
                onClick={rejectCall}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
              >
                <X size={16} />
                Decline
              </Button>
            </div>
          )}

          {isCallActive && (
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleMute}
                variant={isMuted ? "destructive" : "outline"}
                className="rounded-full w-12 h-12"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </Button>

              <Button
                onClick={toggleVideo}
                variant={isVideoOff ? "destructive" : "outline"}
                className="rounded-full w-12 h-12"
                title={isVideoOff ? "Turn on video" : "Turn off video"}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </Button>

              <Button
                onClick={endCall}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
              >
                <PhoneOff size={20} />
                End Call
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="mt-6 text-center text-slate-300 max-w-2xl bg-slate-800/30 rounded-lg p-6">
        <h3 className="font-semibold mb-3 text-white">How it works:</h3>
        <div className="space-y-2 text-sm">
          <p>• Click "Find Someone to Talk" to connect with a random person</p>
          <p>• All calls are anonymous and no personal information is shared</p>
          <p>• Be respectful and supportive to create a positive experience</p>
          <p>• You can end the call at any time if you feel uncomfortable</p>
        </div>
      </div>
    </div>
  );
};

export default AnonymousVideoCall;
