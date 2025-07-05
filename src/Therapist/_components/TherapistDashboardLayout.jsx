import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import Sidebar from './Sidebar/Sidebar'
import Navbar from './Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import { firestore, auth } from '@/Database/Firebase'

function TherapistDashboardLayout() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/MindMendor/therapistlogin')
        return
      }

      const docRef = doc(firestore, 'Therapists', user.uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        navigate('/MindMendor/therapistlogin')
        return
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Verifying therapist access...
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      <Sidebar />
      <div>
        <Navbar />
        <div className='h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden px-2 md:p-6 ml-[100px] md:ml-[240px]'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default TherapistDashboardLayout
