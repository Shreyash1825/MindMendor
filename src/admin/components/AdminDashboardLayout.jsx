import React from 'react'
import Sidebar from './Sidebar/Sidebar'
import Navbar from './Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import { firestore, auth } from '@/Database/Firebase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

function AdminDashboardLayout() {
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

export default AdminDashboardLayout
