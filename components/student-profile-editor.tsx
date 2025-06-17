"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Camera,
  Upload,
  Save,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  User,
  Shield,
  X,
  Check,
} from "lucide-react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField } from "@/components/ui/form-field"
import { studentProfileSchema } from "@/lib/validation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface StudentProfileData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  profilePhoto: string
  aadharPhoto: string
  rollNumber: string
  department: string
  semester: number
  cgpa: number
  status: string
}

interface PendingRequest {
  id: string
  type: "date_of_birth" | "address"
  currentValue: string
  requestedValue: string
  aadharVerification?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reason?: string
}

export function StudentProfileEditor() {
  const [profileData, setProfileData] = useState<StudentProfileData>({
    id: "STU001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@student.college.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Student Avenue, Campus City, CC 12345",
    dateOfBirth: "2002-03-15",
    profilePhoto: "/placeholder.svg?height=150&width=150",
    aadharPhoto: "",
    rollNumber: "CS2022001",
    department: "Computer Science",
    semester: 6,
    cgpa: 8.5,
    status: "Active",
  })

  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: "REQ001",
      type: "date_of_birth",
      currentValue: "2002-03-15",
      requestedValue: "2002-03-20",
      aadharVerification: "/placeholder.svg?height=200&width=300",
      status: "pending",
      submittedAt: "2024-01-15T10:30:00Z",
      reason: "Correction needed as per Aadhar card",
    },
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [requestType, setRequestType] = useState<"date_of_birth" | "address">("date_of_birth")
  const [requestReason, setRequestReason] = useState("")
  const [requestValue, setRequestValue] = useState("")
  const [aadharFile, setAadharFile] = useState<File | null>(null)
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)

  const profilePhotoRef = useRef<HTMLInputElement>(null)
  const aadharPhotoRef = useRef<HTMLInputElement>(null)
  const requestAadharRef = useRef<HTMLInputElement>(null)

  const { values, errors, isValid, handleSubmit, getFieldProps, setValue } = useFormValidation({
    schema: studentProfileSchema,
    initialValues: {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone,
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSaveProfile,
  })

  async function handleSaveProfile(data: any) {
    try {
      console.log("Saving profile data:", data)

      // Simulate API call
      const response = await fetch("/api/student/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      const result = await response.json()

      // Update local state
      setProfileData((prev) => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      }))

      setIsEditing(false)

      // Show success notification (you can add a toast here)
      console.log("Profile saved successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      // Show error notification
    }
  }

  const handlePhotoUpload = async (file: File, type: "profile" | "aadhar") => {
    if (!file) return

    setUploadProgress(0)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === "profile") {
          setProfileData((prev) => ({ ...prev, profilePhoto: result }))
        } else {
          setProfileData((prev) => ({ ...prev, aadharPhoto: result }))
        }
      }
      reader.readAsDataURL(file)

      setUploadProgress(0)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadProgress(0)
    }
  }

  const handleSubmitRequest = async () => {
    if (!requestValue || !requestReason || (requestType === "date_of_birth" && !aadharFile)) {
      return
    }

    try {
      const newRequest: PendingRequest = {
        id: `REQ${Date.now()}`,
        type: requestType,
        currentValue: requestType === "date_of_birth" ? profileData.dateOfBirth : profileData.address,
        requestedValue: requestValue,
        aadharVerification: aadharFile ? URL.createObjectURL(aadharFile) : undefined,
        status: "pending",
        submittedAt: new Date().toISOString(),
        reason: requestReason,
      }

      setPendingRequests((prev) => [...prev, newRequest])
      setShowRequestDialog(false)
      setRequestValue("")
      setRequestReason("")
      setAadharFile(null)

      // Show success notification
    } catch (error) {
      console.error("Error submitting request:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and documents</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {profileData.rollNumber}
        </Badge>
      </motion.div>

      {/* Pending Requests Alert */}
      <AnimatePresence>
        {pendingRequests.filter((req) => req.status === "pending").length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                You have {pendingRequests.filter((req) => req.status === "pending").length} pending request(s) for admin
                approval.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>Update your basic profile information</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => {
                      if (!isEditing) {
                        // Initialize form values when starting to edit
                        setValue("firstName", profileData.firstName)
                        setValue("lastName", profileData.lastName)
                        setValue("phone", profileData.phone)
                      }
                      setIsEditing(!isEditing)
                    }}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profileData.profilePhoto || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="text-2xl">
                        {profileData.firstName[0]}
                        {profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full p-2"
                      onClick={() => profilePhotoRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={profilePhotoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setProfilePhotoFile(file)
                          handlePhotoUpload(file, "profile")
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-gray-600">{profileData.department}</p>
                    <p className="text-sm text-gray-500">
                      Semester {profileData.semester} • CGPA: {profileData.cgpa}
                    </p>
                  </div>
                </div>

                {uploadProgress > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading photo...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </motion.div>
                )}

                {/* Editable Fields */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    required
                    disabled={!isEditing}
                    {...getFieldProps("firstName")}
                  />

                  <FormField
                    label="Last Name"
                    name="lastName"
                    required
                    disabled={!isEditing}
                    {...getFieldProps("lastName")}
                  />

                  <FormField label="Email" name="email" type="email" disabled value={profileData.email} />

                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    required
                    disabled={!isEditing}
                    {...getFieldProps("phone")}
                  />

                  {/* Read-only fields with request buttons */}
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <div className="flex space-x-2">
                      <Input value={profileData.dateOfBirth} disabled className="flex-1" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRequestType("date_of_birth")
                          setShowRequestDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Request Change
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <div className="flex space-x-2">
                      <Textarea value={profileData.address} disabled className="flex-1" rows={2} />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRequestType("address")
                          setShowRequestDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Request Change
                      </Button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="md:col-span-2 flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!isValid}
                        className={cn(
                          "transition-all duration-200",
                          isValid
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed",
                        )}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Document Management</span>
                </CardTitle>
                <CardDescription>Upload and manage your important documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Aadhar Card Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Aadhar Card</h3>
                    <Button
                      variant="outline"
                      onClick={() => aadharPhotoRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Aadhar</span>
                    </Button>
                  </div>

                  {profileData.aadharPhoto ? (
                    <div className="relative">
                      <img
                        src={profileData.aadharPhoto || "/placeholder.svg"}
                        alt="Aadhar Card"
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => setProfileData((prev) => ({ ...prev, aadharPhoto: "" }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No Aadhar card uploaded</p>
                      <p className="text-sm text-gray-500">Upload your Aadhar card for verification purposes</p>
                    </div>
                  )}

                  <input
                    ref={aadharPhotoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handlePhotoUpload(file, "aadhar")
                      }
                    }}
                  />
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your documents are securely stored and only accessible to authorized personnel for verification
                    purposes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Change Requests</span>
                </CardTitle>
                <CardDescription>Track your requests for profile changes that require admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No pending requests</p>
                    <p className="text-sm text-gray-500">All your profile information is up to date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(request.status)}
                            <h4 className="font-medium capitalize">{request.type.replace("_", " ")} Change Request</h4>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-500">Current Value</Label>
                            <p className="font-medium">{request.currentValue}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Requested Value</Label>
                            <p className="font-medium">{request.requestedValue}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-gray-500">Reason</Label>
                          <p className="text-sm">{request.reason}</p>
                        </div>

                        {request.aadharVerification && (
                          <div>
                            <Label className="text-gray-500">Verification Document</Label>
                            <img
                              src={request.aadharVerification || "/placeholder.svg"}
                              alt="Verification"
                              className="mt-2 w-32 h-20 object-cover rounded border"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                          <span>Request ID: {request.id}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Request Change Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request {requestType.replace("_", " ")} Change</DialogTitle>
            <DialogDescription>
              Submit a request to update your {requestType.replace("_", " ")}. Admin approval is required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Current {requestType.replace("_", " ")}</Label>
              <Input
                value={requestType === "date_of_birth" ? profileData.dateOfBirth : profileData.address}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label>New {requestType.replace("_", " ")}</Label>
              {requestType === "address" ? (
                <Textarea
                  value={requestValue}
                  onChange={(e) => setRequestValue(e.target.value)}
                  placeholder="Enter new address"
                  rows={3}
                />
              ) : (
                <Input
                  type="date"
                  value={requestValue}
                  onChange={(e) => setRequestValue(e.target.value)}
                  placeholder="Enter new date of birth"
                />
              )}
            </div>

            <div>
              <Label>Reason for Change</Label>
              <Textarea
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                placeholder="Explain why this change is needed"
                rows={3}
              />
            </div>

            {requestType === "date_of_birth" && (
              <div>
                <Label>Aadhar Card Verification</Label>
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => requestAadharRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Aadhar Card Photo
                  </Button>
                  {aadharFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      {aadharFile.name} selected
                    </p>
                  )}
                </div>
                <input
                  ref={requestAadharRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAadharFile(e.target.files?.[0] || null)}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRequest}
                disabled={!requestValue || !requestReason || (requestType === "date_of_birth" && !aadharFile)}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
