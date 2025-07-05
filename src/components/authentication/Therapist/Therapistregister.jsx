import React, { useState, useRef } from "react";
import Authenticateheader from "../Authenticateheader";
import "../../css/therapistregister.css";
import Footer from "../../Footer";
import file from "../../../assets/images/svgs/file1.svg";

import { auth, firestore } from "../../../Database/Firebase";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { DNA } from "react-loader-spinner";
import { BadgeCheck, User2Icon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Therapistregister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setdob] = useState("");
  const [gender, setGender] = useState("");
  const [licenseno, setLicenseno] = useState("");
  const [licenseissueauth, setLicenseissueauth] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Upload Profile Photo");

  const navigate = useNavigate();
  const location = useLocation();

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setButtonText("Done");
    }
  };

  const handleTherapistRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const therapistCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const therapist = therapistCredential.user; // Get the registered user

      if (therapist) {
        await setDoc(doc(firestore, "Therapists", therapist.uid), {
          email: therapist.email,
          name: name, // ✅ Use the name from state
          phone: phone, // ✅ Store phone number as well
          dob: dob,
          gender: gender,
          licenseno: licenseno,
          licenseissueauth: licenseissueauth,
          description: description,
        });
      }
      console.log("Therapist registered:", therapist);
      navigate("/MindMendor/therapist/")
      toast.success("Registered Suceessfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.log("Error:", error.message);
      toast.error(error.message, {
        position: "top-center",
      });
    } finally {
      setLoading(false); // Hide loading after request completes
    }
  };

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
          Therapist <span className="text-[#1479EA]">Registration</span>
        </p>
        <div className="container text-justify lg:px-40 py-8 w-[100%] md:w-[60%] flex flex-col gap-15 justify-center items-center">
          <form
            className="box form__group field py-10 px-10 w-full flex flex-col gap-14"
            onSubmit={handleTherapistRegister}
            method="POST"
          >
            {/* <div className="relative">
              <button class="container-btn-file mx-auto hover:border-0 sm:bg-transparent">
                {buttonText == "Done" ? (
                  <BadgeCheck className="text-[#1479ea]" />
                ) : (
                  <p className="flex">
                    <User2Icon className="mr-2" />{" "}
                    <span>Upload Profile Photo</span>
                  </p>
                )}
                <input
                  className="profilephoto"
                  name="profilephoto"
                  type="file"
                  onChange={handleFileChange}
                />
              </button>
            </div> */}
            <div className="relative">
              <input
                id="therapistname"
                name="therapistname"
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
                id="licenseno"
                name="licenseno"
                type="varchar"
                placeholder="License Number"
                required
                value={licenseno}
                onChange={(e) => setLicenseno(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <input
                id="licenseissueauth"
                name="licenseissueauth"
                type="text"
                placeholder="License Issuing Authority"
                required
                value={licenseissueauth}
                onChange={(e) => setLicenseissueauth(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <textarea name="description" id="description" placeholder="Description" className="p-2 border-gray-500" required value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            {/* <button className="container-btn-file">
              <img src={file} className="w-5" alt="" />
              Upload Certificate
              <input className="file" name="text" type="file" />
            </button>

            <button className="container-btn-file">
              <img src={file} className="w-5" alt="" />
              Upload Identity Proof
              <input className="file" name="text" type="file" />
            </button> */}

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
  );
}

export default Therapistregister;




// "use client"

// import { useState } from "react"
// import { auth, firestore, storage } from "../../../Database/Firebase"
// import { setDoc, doc, collection, getDocs, query, limit } from "firebase/firestore"
// import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth"
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
// import { toast } from "react-toastify"
// import { DNA } from "react-loader-spinner"
// import { BadgeCheck, User2Icon } from "lucide-react"
// import { useNavigate, useLocation } from "react-router-dom"
// import Authenticateheader from "../Authenticateheader"
// import "../../css/therapistregister.css"
// import Footer from "../../Footer"

// function Therapistregister() {
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [phone, setPhone] = useState("")
//   const [dob, setdob] = useState("")
//   const [gender, setGender] = useState("")
//   const [licenseno, setLicenseno] = useState("")
//   const [licenseissueauth, setLicenseissueauth] = useState("")
//   const [password, setPassword] = useState("")
//   const [profilePhoto, setProfilePhoto] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [buttonText, setButtonText] = useState("Upload Profile Photo")

//   const navigate = useNavigate()
//   const location = useLocation()

//   const handleFileChange = (event) => {
//     const file = event.target.files[0]
//     if (file) {
//       // Validate file type
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
//       if (!allowedTypes.includes(file.type)) {
//         toast.error("Please upload a valid image file (JPEG, PNG, GIF)", {
//           position: "top-center",
//         })
//         return
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size should be less than 5MB", {
//           position: "top-center",
//         })
//         return
//       }

//       setProfilePhoto(file)
//       setButtonText("Done")
//     }
//   }

//   // Check if collection exists
//   const checkCollectionExists = async (collectionName) => {
//     try {
//       const collectionRef = collection(firestore, collectionName)
//       const q = query(collectionRef, limit(1))
//       const querySnapshot = await getDocs(q)
//       return true
//     } catch (error) {
//       console.error("Error checking collection:", error)
//       return false
//     }
//   }

//   // Check if email is already in use
//   const checkEmailExists = async (email) => {
//     try {
//       const methods = await fetchSignInMethodsForEmail(auth, email)
//       return methods.length > 0
//     } catch (error) {
//       console.error("Error checking email:", error)
//       return false
//     }
//   }

//   // Upload profile photo to Firebase Storage
//   const uploadProfilePhoto = async (userId, file) => {
//     try {
//       console.log("Starting photo upload for user:", userId)

//       // Create a unique filename
//       const timestamp = Date.now()
//       const fileExtension = file.name.split(".").pop()
//       const fileName = `profile_${timestamp}.${fileExtension}`

//       // Create storage reference
//       const storageRef = ref(storage, `therapists/profile-photos/${userId}/${fileName}`)

//       console.log("Storage reference created:", storageRef.fullPath)

//       // Upload file
//       const snapshot = await uploadBytes(storageRef, file)
//       console.log("File uploaded successfully:", snapshot)

//       // Get download URL
//       const downloadURL = await getDownloadURL(snapshot.ref)
//       console.log("Download URL obtained:", downloadURL)

//       return downloadURL
//     } catch (error) {
//       console.error("Error uploading profile photo:", error)
//       console.error("Error code:", error.code)
//       console.error("Error message:", error.message)
//       throw error
//     }
//   }

//   const handleTherapistRegister = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       // First check if email is already in use
//       const emailExists = await checkEmailExists(email)
//       if (emailExists) {
//         toast.error("This email is already registered. Please use a different email.", {
//           position: "top-center",
//         })
//         setLoading(false)
//         return
//       }

//       // Check if Therapists collection exists
//       const collectionExists = await checkCollectionExists("Therapists")
//       if (!collectionExists) {
//         console.log("Therapists collection doesn't exist yet. It will be created automatically.")
//       }

//       // Create user account with Firebase Auth
//       console.log("Creating user account...")
//       const therapistCredential = await createUserWithEmailAndPassword(auth, email, password)
//       const therapist = therapistCredential.user
//       console.log("User created successfully:", therapist.uid)

//       if (therapist) {
//         let profilePhotoURL = null

//         // Upload profile photo if selected
//         if (profilePhoto) {
//           try {
//             console.log("Attempting to upload profile photo...")
//             profilePhotoURL = await uploadProfilePhoto(therapist.uid, profilePhoto)
//             console.log("Profile photo uploaded successfully:", profilePhotoURL)
//             toast.success("Profile photo uploaded successfully!", {
//               position: "top-center",
//               autoClose: 2000,
//             })
//           } catch (photoError) {
//             console.error("Profile photo upload failed:", photoError)

//             // More specific error handling
//             let photoErrorMessage = "Profile photo upload failed"
//             if (photoError.code === "storage/unauthorized") {
//               photoErrorMessage = "Storage access denied. Please check Firebase Storage rules."
//             } else if (photoError.code === "storage/canceled") {
//               photoErrorMessage = "Photo upload was canceled."
//             } else if (photoError.code === "storage/unknown") {
//               photoErrorMessage = "Unknown storage error occurred."
//             }

//             toast.warning(`Account created but ${photoErrorMessage}. You can upload it later from your profile.`, {
//               position: "top-center",
//               autoClose: 5000,
//             })
//           }
//         }

//         // Store therapist data in Firestore
//         const therapistData = {
//           id: therapist.uid, // Unique ID
//           email: therapist.email,
//           name: name,
//           phone: phone,
//           dob: dob,
//           gender: gender,
//           licenseno: licenseno,
//           licenseissueauth: licenseissueauth,
//           profilePhotoURL: profilePhotoURL, // This will be null if upload failed
//           createdAt: new Date().toISOString(), // Timestamp
//           isVerified: false, // Default verification status
//           status: "pending", // Default status for admin approval
//         }

//         console.log("Storing therapist data in Firestore...")
//         await setDoc(doc(firestore, "Therapists", therapist.uid), therapistData)
//         console.log("Therapist data stored successfully")

//         toast.success("Registration completed successfully!", {
//           position: "top-center",
//         })

//         // Navigate to therapist dashboard or login page
//         navigate("/MindMendor/therapist/")
//       }
//     } catch (error) {
//       console.error("Registration error:", error)

//       // Handle specific Firebase Auth errors
//       let errorMessage = error.message
//       if (error.code === "auth/email-already-in-use") {
//         errorMessage = "This email is already registered. Please use a different email."
//       } else if (error.code === "auth/weak-password") {
//         errorMessage = "Password should be at least 6 characters long."
//       } else if (error.code === "auth/invalid-email") {
//         errorMessage = "Please enter a valid email address."
//       } else if (error.code === "auth/network-request-failed") {
//         errorMessage = "Network error. Please check your internet connection."
//       } else {
//         errorMessage = "Registration failed. Please try again later."
//       }

//       toast.error(errorMessage, {
//         position: "top-center",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="">
//       <Authenticateheader />
//       {loading && (
//         <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 py-2 px-6 rounded-lg flex flex-col items-center z-50">
//           <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" />
//           <p className="text-white mt-2">Processing...</p>
//         </div>
//       )}
//       <div className="bg-[#212121] text-white px-2 md:px-40 py-14 flex flex-col justify-center items-center">
//         <p className="font-semibold text-3xl text-center mb-1">
//           Therapist <span className="text-[#1479EA]">Registration</span>
//         </p>
//         <div className="container text-justify lg:px-40 py-8 w-[100%] md:w-[60%] flex flex-col gap-15 justify-center items-center">
//           <form
//             className="box form__group field py-10 px-10 w-full flex flex-col gap-14"
//             onSubmit={handleTherapistRegister}
//             method="POST"
//           >
//             <div className="relative">
//               <button type="button" className="container-btn-file mx-auto hover:border-0 sm:bg-transparent">
//                 {buttonText === "Done" ? (
//                   <BadgeCheck className="text-[#1479ea]" />
//                 ) : (
//                   <p className="flex">
//                     <User2Icon className="mr-2" /> <span>Upload Profile Photo</span>
//                   </p>
//                 )}
//                 <input
//                   className="profilephoto"
//                   name="profilephoto"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                 />
//               </button>
//             </div>

//             <div className="relative">
//               <input
//                 id="therapistname"
//                 name="therapistname"
//                 type="text"
//                 placeholder="Your Name"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
//               />
//             </div>

//             <div className="relative">
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="Email id"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
//               />
//             </div>

//             <div className="relative">
//               <input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 placeholder="Mobile No."
//                 required
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
//               />
//             </div>

//             <div className="relative">
//               <input
//                 id="dob"
//                 name="dob"
//                 type="date"
//                 placeholder="DD/MM/YYYY"
//                 required
//                 value={dob}
//                 onChange={(e) => setdob(e.target.value)}
//                 className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
//               />
//             </div>

//             <div className="relative">
//               <select
//                 id="gender"
//                 name="gender"
//                 required
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//                 className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-transparent"
//               >
//                 <option className="bg-[#353434] cursor-pointer" value="">
//                   Select Gender
//                 </option>
//                 <option className="bg-[#353434] cursor-pointer" value="Male">
//                   Male
//                 </option>
//                 <option className="bg-[#353434] cursor-pointer" value="Female">
//                   Female
//                 </option>
//                 <option className="bg-[#353434] cursor-pointer" value="Other">
//                   Other
//                 </option>
//                 <option className="bg-[#353434] cursor-pointer" value="Prefer not to say">
//                   Prefer not to say
//                 </option>
//               </select>
//             </div>

//             <div className="relative">
//               <input
//                 id="licenseno"
//                 name="licenseno"
//                 type="text"
//                 placeholder="License Number"
//                 required
//                 value={licenseno}
//                 onChange={(e) => setLicenseno(e.target.value)}
//                 className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
//               />
//             </div>

//             <div className="relative">
//               <input
//                 id="licenseissueauth"
//                 name="licenseissueauth"
//                 type="text"
//                 placeholder="License Issuing Authority"
//                 required
//                 value={licenseissueauth}
//                 onChange={(e) => setLicenseissueauth(e.target.value)}
//                 className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
//               />
//             </div>

//             <div className="relative">
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="Password (min 6 characters)"
//                 required
//                 minLength={6}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
//               />
//             </div>

//             <button className="submit-btn" type="submit" disabled={loading}>
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   )
// }

// export default Therapistregister
