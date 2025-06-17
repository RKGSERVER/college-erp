"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentGateway, PaymentGatewayManager } from "./payment-gateway"
import { CreditCard, CheckCircle } from "lucide-react"

interface EnhancedPaymentSystemProps {
  userRole: "student" | "faculty" | "admin" | "employee" | "principal" | "finance"
}

export function EnhancedPaymentSystem({ userRole }: EnhancedPaymentSystemProps) {
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [showPaymentGateway, setShowPaymentGateway] = useState(false)

  // Sample payment data
  const studentPayments = [
    {
      id: "sp-1",
      studentId: "STU001",
      studentName: "John Smith",
      studentEmail: "john.smith@college.edu",
      studentPhone: "+91-9876543210",
      structureId: "ps-1",
      amount: 45000,
      paidAmount: 0,
      dueDate: "2024-02-15",
      status: "pending",
      description: "Semester 6 Tuition Fee",
      lateFee: 0,
    },
    {
      id: "sp-2",
      studentId: "STU001",
      studentName: "John Smith",
      studentEmail: "john.smith@college.edu",
      studentPhone: "+91-9876543210",
      structureId: "ps-2",
      amount: 25000,
      paidAmount: 25000,
      dueDate: "2024-02-10",
      paidDate: "2024-02-08",
      status: "paid",
      description: "Hostel Fee - Spring 2024",
      paymentMethod: "Razorpay - UPI",
      transactionId: "pay_NdyTzNkqRAkQVH",
      lateFee: 0,
    },
  ]

  const handlePaymentSuccess = (paymentData: any) => {
    console.log("Payment successful:", paymentData)
    setShowPaymentGateway(false)
    setSelectedPayment(null)
    // Update payment status in your state management
    // Show success notification
  }

  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error)
    setShowPaymentGateway(false)
    // Show error notification
  }

  const renderStudentPaymentView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fee Payments</CardTitle>
          <CardDescription>Secure online payment with multiple gateway options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentPayments.map((payment) => (
              <Card key={payment.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{payment.description}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm">Amount: ₹{payment.amount.toLocaleString()}</span>
                        <span className="text-sm">Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                        <Badge
                          variant={
                            payment.status === "paid"
                              ? "default"
                              : payment.status === "overdue"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                      {payment.status === "paid" && payment.transactionId && (
                        <p className="text-sm text-gray-600 mt-1">Transaction ID: {payment.transactionId}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {payment.status === "pending" && (
                        <Button
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowPaymentGateway(true)
                          }}
                          className="flex items-center space-x-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Pay Now</span>
                        </Button>
                      )}
                      {payment.status === "paid" && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Dialog */}
      <Dialog open={showPaymentGateway} onOpenChange={setShowPaymentGateway}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Secure Payment</DialogTitle>
            <DialogDescription>Complete your payment using our secure payment gateways</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <PaymentGateway
              amount={selectedPayment.amount}
              currency="INR"
              orderId={selectedPayment.id}
              studentId={selectedPayment.studentId}
              studentName={selectedPayment.studentName}
              studentEmail={selectedPayment.studentEmail}
              studentPhone={selectedPayment.studentPhone}
              description={selectedPayment.description}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              onClose={() => setShowPaymentGateway(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderFinanceAdminView = () => (
    <div className="space-y-6">
      <PaymentGatewayManager />

      {/* Payment Processing Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Processing</CardTitle>
          <CardDescription>Process and monitor student payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{payment.studentName}</h4>
                  <p className="text-sm text-gray-600">{payment.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm">₹{payment.amount.toLocaleString()}</span>
                    <Badge
                      variant={
                        payment.status === "paid"
                          ? "default"
                          : payment.status === "overdue"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {payment.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPayment(payment)
                        setShowPaymentGateway(true)
                      }}
                    >
                      Process Payment
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Dialog for Finance */}
      <Dialog open={showPaymentGateway} onOpenChange={setShowPaymentGateway}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Process payment for {selectedPayment?.studentName}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <PaymentGateway
              amount={selectedPayment.amount}
              currency="INR"
              orderId={selectedPayment.id}
              studentId={selectedPayment.studentId}
              studentName={selectedPayment.studentName}
              studentEmail={selectedPayment.studentEmail}
              studentPhone={selectedPayment.studentPhone}
              description={selectedPayment.description}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              onClose={() => setShowPaymentGateway(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <div className="space-y-6">
      {userRole === "student" && renderStudentPaymentView()}
      {(userRole === "finance" || userRole === "admin" || userRole === "principal") && renderFinanceAdminView()}
    </div>
  )
}
