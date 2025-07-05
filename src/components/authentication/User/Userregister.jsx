"use client"

import { useState } from "react"
import Authenticateheader from "../Authenticateheader"
import "../../css/userregister.css"
import Footer from "../../Footer"
import { auth, firestore } from "../../../Database/Firebase"
import { addDoc, collection, setDoc, doc, getDoc, query, where, getDocs } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"
import { DNA } from "react-loader-spinner"
import { useLocation, useNavigate } from "react-router-dom"

function UserRegister() {
  const ref = collection(firestore, "message")
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dob, setdob] = useState("")
  const [gender, setGender] = useState("")

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Function to check if email exists in Users collection
  const checkEmailExists = async (email) => {
    try {
      // Method 1: Try to use email as document ID (most efficient)
      const emailDocRef = doc(firestore, "EmailIndex", email.toLowerCase())
      const emailDoc = await getDoc(emailDocRef)

      if (emailDoc.exists()) {
        return true
      }

      // Method 2: If EmailIndex doesn't exist, try querying Users collection
      const usersRef = collection(firestore, "Users")
      const q = query(usersRef, where("email", "==", email.toLowerCase()))
      const querySnapshot = await getDocs(q)

      return !querySnapshot.empty
    } catch (error) {
      console.log("Error checking email:", error.message)

      // If we get permission error, we'll let Firebase Auth handle duplicate emails
      if (error.code === "permission-denied") {
        console.log("Using Firebase Auth for duplicate check due to permissions")
        return false // Let Firebase Auth handle the duplicate check
      }

      throw error
    }
  }

  // Function to create EmailIndex collection if it doesn't exist
  const createEmailIndex = async (email, uid) => {
    try {
      const emailDocRef = doc(firestore, "EmailIndex", email.toLowerCase())
      await setDoc(emailDocRef, {
        uid: uid,
        email: email.toLowerCase(),
        createdAt: new Date(),
      })
    } catch (error) {
      console.log("Could not create email index:", error.message)
      // This is optional, so we don't throw the error
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if email exists in our database
      const emailExists = await checkEmailExists(email)

      if (emailExists) {
        toast.error("User with this email already exists!", {
          position: "top-center",
        })
        setLoading(false)
        return
      }

      // If email doesn't exist, proceed with registration
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (user) {
        // Add user to Users collection
        await setDoc(doc(firestore, "Users", user.uid), {
          email: user.email.toLowerCase(),
          name: name,
          phone: phone,
          dob: dob,
          gender: gender,
          password: password,
          createdAt: new Date(),
        })

        // Try to create email index for faster future lookups
        await createEmailIndex(user.email, user.uid)
      }

      console.log("User registered:", user)
      toast.success("Registered Successfully!", {
        position: "top-center",
      })

      // Clear form after successful registration
      setName("")
      setEmail("")
      setPhone("")
      setdob("")
      setGender("")
      setPassword("")

      navigate("/MindMendor/userlogin")
    } catch (error) {
      console.log("Error:", error.message)

      // Handle specific Firebase Auth errors
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered!", {
          position: "top-center",
        })
      } else if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters!", {
          position: "top-center",
        })
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address!", {
          position: "top-center",
        })
      } else {
        toast.error(error.message, {
          position: "top-center",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = { message: name }
    try {
      await addDoc(ref, data)
      console.log("Message saved:", data)
    } catch (e) {
      console.log("Firestore Error:", e.message)
    }
  }

  return (
    <div className="">
      <Authenticateheader />
      {loading && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 py-2 px-6 rounded-lg flex flex-col items-center z-50">
          <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" />
          <p className="text-white mt-2">Processing...</p>
        </div>
      )}
      <div className="bg-[#212121] text-white px-2 md:px-40 py-14 flex flex-col justify-center items-center">
        <p className="font-semibold text-3xl text-center mb-1">
          User <span className="text-[#1479EA]">Registration</span>
        </p>
        <div className="container text-justify lg:px-40 py-8 w-[100%] md:w-[60%] flex flex-col gap-15 justify-center items-center">
          <form
            className="box form__group field py-10 px-10 w-full flex flex-col gap-14"
            method="POST"
            onSubmit={handleRegister}
          >
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Mobile No."
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <input
                id="dob"
                name="dob"
                type="date"
                placeholder="DD/MM/YYYY"
                required
                value={dob}
                onChange={(e) => setdob(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <input
                id="gender"
                name="gender"
                type="text"
                placeholder="Gender"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default UserRegister
