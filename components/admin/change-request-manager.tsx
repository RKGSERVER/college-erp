"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, X, Eye, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface ChangeRequest {
  id: string
  studentId: string
  studentName: string
  rollNumber: string
  type: "date_of_birth" | "address"
  currentValue: string
  requestedValue: string
  reason: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  verificationDocument?: string
}

export function ChangeRequestManager() {
  const [requests, setRequests] = useState<ChangeRequest[]>([
    {
      id: "REQ001",
      studentId: "STU001",
      studentName: "John Smith",
      rollNumber: "CS2022001",
      type: "date_of_birth",
      currentValue: "2002-03-15",
      requestedValue: "2002-03-20",
      reason: "Correction needed as per Aadhar card. There was an error in the original entry.",
      status: "pending",
      submittedAt: "2024-01-15T10:30:00Z",
      verificationDocument: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "REQ002",
      studentId: "STU002",
      studentName: "Jane Doe",
      rollNumber: "CS2022002",
      type: "address",
      currentValue: "123 Old Street, Old City, OC 12345",
      requestedValue: "456 New Avenue, New City, NC 67890",
      reason: "Family relocated to new city. Need to update address for correspondence.",
      status: "pending",
      submittedAt: "2024-01-14T14:20:00Z",
    },
  ])

  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve")
  const [reviewComments, setReviewComments] = useState("")

  const handleReviewRequest = async (action: "approve" | "reject") => {
    if (!selectedRequest) return

    try {
      // Update request status
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req,
        ),
      )

      // Send notification to student
      console.log(`Request ${selectedRequest.id} ${action}ed`)

      setShowReviewDialog(false)
      setSelectedRequest(null)
      setReviewComments("")
    } catch (error) {
      console.error("Error reviewing request:", error)
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

  const getTypeIcon = (type: string) => {
    return type === "date_of_birth" ? <Calendar className="h-4 w-4" /> : <MapPin className="h-4 w-4" />
  }

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const reviewedRequests = requests.filter((req) => req.status !== "pending")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Change Request Management</h2>
          <p className="text-gray-600">Review and approve student profile change requests</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {pendingRequests.length} Pending
        </Badge>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Requests ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({reviewedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                <p className="text-gray-600">All change requests have been reviewed</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <motion.div key={request.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(request.type)}
                          <div>
                            <CardTitle className="text-lg">
                              {request.type.replace("_", " ").toUpperCase()} Change Request
                            </CardTitle>
                            <CardDescription>
                              {request.studentName} ({request.rollNumber})
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(request.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowReviewDialog(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">Current Value</Label>
                          <p className="font-medium">{request.currentValue}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Requested Value</Label>
                          <p className="font-medium text-blue-600">{request.requestedValue}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-500">Reason</Label>
                        <p className="text-sm">{request.reason}</p>
                      </div>

                      {request.verificationDocument && (
                        <div>
                          <Label className="text-gray-500">Verification Document</Label>
                          <div className="mt-2">
                            <img
                              src={request.verificationDocument || "/placeholder.svg"}
                              alt="Verification"
                              className="w-48 h-32 object-cover rounded border cursor-pointer hover:opacity-80"
                              onClick={() => window.open(request.verificationDocument, "_blank")}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Submitted: {new Date(request.submittedAt).toLocaleString()}</span>
                        <span>Request ID: {request.id}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedRequests.map((request) => (
            <Card key={request.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(request.type)}
                    <div>
                      <CardTitle className="text-lg">
                        {request.type.replace("_", " ").toUpperCase()} Change Request
                      </CardTitle>
                      <CardDescription>
                        {request.studentName} ({request.rollNumber})
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-500">Current Value</Label>
                    <p>{request.currentValue}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Requested Value</Label>
                    <p>{request.requestedValue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Change Request</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Student</Label>
                  <p className="font-medium">
                    {selectedRequest.studentName} ({selectedRequest.rollNumber})
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Request Type</Label>
                  <p className="font-medium capitalize">{selectedRequest.type.replace("_", " ")}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Current Value</Label>
                  <p className="font-medium">{selectedRequest.currentValue}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Requested Value</Label>
                  <p className="font-medium text-blue-600">{selectedRequest.requestedValue}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-500">Reason for Change</Label>
                <p className="text-sm mt-1">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.verificationDocument && (
                <div>
                  <Label className="text-gray-500">Verification Document</Label>
                  <img
                    src={selectedRequest.verificationDocument || "/placeholder.svg"}
                    alt="Verification"
                    className="mt-2 w-full max-w-md h-48 object-cover rounded border"
                  />
                </div>
              )}

              <div>
                <Label>Review Comments (Optional)</Label>
                <Textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Add any comments about this review..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleReviewRequest("reject")}>
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleReviewRequest("approve")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
