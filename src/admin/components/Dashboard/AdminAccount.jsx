"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from "firebase/firestore"
import { firestore } from "@/Database/Firebase"
import { useAdminAuth } from "../../../context/UseAdminAuth"
import { toast } from "react-toastify"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mail, Shield, Calendar, Edit3, Save, X, Plus, Settings, Activity, Clock, UserCheck } from 'lucide-react'

function AdminAccount() {
  const { admin: currentAdmin, loading: authLoading } = useAdminAuth()
  const [adminData, setAdminData] = useState(null)
  const [allAdmins, setAllAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showAllAdmins, setShowAllAdmins] = useState(false)
  const [newAdminDialog, setNewAdminDialog] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    department: "",
    bio: "",
  })
  const [newAdminForm, setNewAdminForm] = useState({
    email: "",
    name: "",
    role: "admin",
    department: "",
  })

  // Fetch current admin data
  const fetchAdminData = async () => {
    if (!currentAdmin?.email) return

    try {
      setLoading(true)
      const adminRef = collection(firestore, "admin")
      const q = query(adminRef, where("email", "==", currentAdmin.email))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0]
        const data = { id: adminDoc.id, ...adminDoc.data() }
        setAdminData(data)
        setEditForm({
          name: data.name || "",
          phone: data.phone || "",
          department: data.department || "",
          bio: data.bio || "",
        })
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast.error("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  // Fetch all admins (for super admin)
  const fetchAllAdmins = async () => {
    try {
      const adminRef = collection(firestore, "admin")
      const querySnapshot = await getDocs(adminRef)
      const admins = []

      querySnapshot.forEach((doc) => {
        admins.push({ id: doc.id, ...doc.data() })
      })

      setAllAdmins(admins)
    } catch (error) {
      console.error("Error fetching all admins:", error)
      toast.error("Failed to load admin list")
    }
  }

  // Update admin profile
  const handleUpdateProfile = async () => {
    if (!adminData?.id) return

    try {
      const adminDocRef = doc(firestore, "admin", adminData.id)
      await updateDoc(adminDocRef, {
        name: editForm.name,
        phone: editForm.phone,
        department: editForm.department,
        bio: editForm.bio,
        updatedAt: new Date(),
      })

      setAdminData((prev) => ({
        ...prev,
        name: editForm.name,
        phone: editForm.phone,
        department: editForm.department,
        bio: editForm.bio,
      }))

      setEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    }
  }

  // Add new admin
  const handleAddAdmin = async () => {
    try {
      // Check if admin already exists
      const adminRef = collection(firestore, "admin")
      const q = query(adminRef, where("email", "==", newAdminForm.email.toLowerCase()))
      const existingAdmin = await getDocs(q)

      if (!existingAdmin.empty) {
        toast.error("Admin with this email already exists!")
        return
      }

      await addDoc(adminRef, {
        email: newAdminForm.email.toLowerCase(),
        name: newAdminForm.name,
        role: newAdminForm.role,
        department: newAdminForm.department,
        status: "active",
        permissions: ["basic_access"],
        createdAt: new Date(),
        createdBy: currentAdmin?.email,
      })

      toast.success("New admin added successfully!")
      setNewAdminDialog(false)
      setNewAdminForm({ email: "", name: "", role: "admin", department: "" })
      fetchAllAdmins()
    } catch (error) {
      console.error("Error adding admin:", error)
      toast.error("Failed to add new admin")
    }
  }

  useEffect(() => {
    if (currentAdmin?.email) {
      fetchAdminData()
      fetchAllAdmins()
    }
  }, [currentAdmin])

  const formatDate = (date) => {
    if (!date) return "N/A"
    if (date.toDate) return date.toDate().toLocaleDateString()
    if (date instanceof Date) return date.toLocaleDateString()
    return new Date(date).toLocaleDateString()
  }

  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase()
    if (email) return email.charAt(0).toUpperCase()
    return "A"
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Account</h1>
          <p className="mt-2 text-gray-600">Manage your admin profile and system settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-2xl">Profile Information</CardTitle>
                  <CardDescription>Your admin account details and settings</CardDescription>
                </div>
                <Button
                  variant={editing ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (editing) {
                      setEditForm({
                        name: adminData?.name || "",
                        phone: adminData?.phone || "",
                        department: adminData?.department || "",
                        bio: adminData?.bio || "",
                      })
                    }
                    setEditing(!editing)
                  }}
                >
                  {editing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                  {editing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {getInitials(adminData?.name, adminData?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{adminData?.name || "Admin User"}</h3>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {adminData?.email}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={adminData?.status === "active" ? "default" : "secondary"}>
                        <Shield className="h-3 w-3 mr-1" />
                        {adminData?.role || "Admin"}
                      </Badge>
                      <Badge variant="outline">
                        <Activity className="h-3 w-3 mr-1" />
                        {adminData?.status || "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {editing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{adminData?.name || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {editing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{adminData?.phone || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    {editing ? (
                      <Input
                        id="department"
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        placeholder="Enter your department"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{adminData?.department || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Account Created</Label>
                    <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(adminData?.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {editing ? (
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded min-h-[80px]">
                      {adminData?.bio || "No bio added yet."}
                    </p>
                  )}
                </div>

                {editing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <Badge variant="outline">{adminData?.role || "Admin"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm text-gray-900">{formatDate(adminData?.lastLogin)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Admin Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Admin Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowAllAdmins(!showAllAdmins)}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  {showAllAdmins ? "Hide" : "View"} All Admins ({allAdmins.length})
                </Button>

                <Dialog open={newAdminDialog} onOpenChange={setNewAdminDialog}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                      <DialogDescription>Create a new admin account for the system.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">Email Address</Label>
                        <Input
                          id="newEmail"
                          type="email"
                          value={newAdminForm.email}
                          onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                          placeholder="admin@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newName">Full Name</Label>
                        <Input
                          id="newName"
                          value={newAdminForm.name}
                          onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newDepartment">Department</Label>
                        <Input
                          id="newDepartment"
                          value={newAdminForm.department}
                          onChange={(e) => setNewAdminForm({ ...newAdminForm, department: e.target.value })}
                          placeholder="IT, HR, Management, etc."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewAdminDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAdmin}>Add Admin</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Admins List */}
        {showAllAdmins && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>All Administrators</CardTitle>
              <CardDescription>Manage all admin accounts in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAdmins.map((admin) => (
                  <Card key={admin.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getInitials(admin.name, admin.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{admin.name || "Unnamed Admin"}</p>
                          <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {admin.role || "Admin"}
                            </Badge>
                            {admin.department && (
                              <Badge variant="secondary" className="text-xs">
                                {admin.department}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Created: {formatDate(admin.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AdminAccount
