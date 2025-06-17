"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Download,
  Send,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { SkeletonLoader } from "./loading/skeleton-loader"

interface PaymentStructureProps {
  userRole: "student" | "faculty" | "admin" | "employee" | "principal" | "finance"
}

interface PaymentStructure {
  id: string
  name: string
  amount: number
  dueDate: string
  category: "tuition" | "hostel" | "library" | "lab" | "exam" | "other"
  semester: string
  department?: string
  isRecurring: boolean
  status: "active" | "inactive"
  description: string
  lateFeePenalty: number
  gracePeriodDays: number
}

interface StudentPayment {
  id: string
  studentId: string
  studentName: string
  structureId: string
  amount: number
  paidAmount: number
  dueDate: string
  paidDate?: string
  status: "pending" | "partial" | "paid" | "overdue"
  paymentMethod?: string
  transactionId?: string
  lateFee: number
}

interface PayrollEmployee {
  id: string
  name: string
  employeeId: string
  department: string
  designation: string
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  paymentDate: string
  status: "pending" | "processed" | "paid"
  bankAccount: string
  joiningDate: string
}

export function PaymentSystem({ userRole }: PaymentStructureProps) {
  const [paymentStructures, setPaymentStructures] = useState<PaymentStructure[]>([
    {
      id: "ps-1",
      name: "Semester 6 Tuition Fee",
      amount: 45000,
      dueDate: "2024-02-15",
      category: "tuition",
      semester: "6",
      isRecurring: true,
      status: "active",
      description: "Tuition fee for 6th semester",
      lateFeePenalty: 500,
      gracePeriodDays: 7,
    },
    {
      id: "ps-2",
      name: "Hostel Fee - Spring 2024",
      amount: 25000,
      dueDate: "2024-02-10",
      category: "hostel",
      semester: "6",
      isRecurring: true,
      status: "active",
      description: "Hostel accommodation fee",
      lateFeePenalty: 200,
      gracePeriodDays: 5,
    },
    {
      id: "ps-3",
      name: "Laboratory Fee",
      amount: 8000,
      dueDate: "2024-02-20",
      category: "lab",
      semester: "6",
      department: "Computer Science",
      isRecurring: false,
      status: "active",
      description: "Computer lab usage fee",
      lateFeePenalty: 100,
      gracePeriodDays: 3,
    },
  ])

  const [studentPayments, setStudentPayments] = useState<StudentPayment[]>([
    {
      id: "sp-1",
      studentId: "STU001",
      studentName: "John Smith",
      structureId: "ps-1",
      amount: 45000,
      paidAmount: 45000,
      dueDate: "2024-02-15",
      paidDate: "2024-02-10",
      status: "paid",
      paymentMethod: "Online Banking",
      transactionId: "TXN123456789",
      lateFee: 0,
    },
    {
      id: "sp-2",
      studentId: "STU002",
      studentName: "Emily Davis",
      structureId: "ps-1",
      amount: 45000,
      paidAmount: 20000,
      dueDate: "2024-02-15",
      status: "partial",
      lateFee: 0,
    },
    {
      id: "sp-3",
      studentId: "STU003",
      studentName: "Michael Brown",
      structureId: "ps-2",
      amount: 25000,
      paidAmount: 0,
      dueDate: "2024-02-10",
      status: "overdue",
      lateFee: 200,
    },
  ])

  const [payrollEmployees, setPayrollEmployees] = useState<PayrollEmployee[]>([
    {
      id: "emp-1",
      name: "Dr. Sarah Johnson",
      employeeId: "FAC001",
      department: "Computer Science",
      designation: "Professor",
      basicSalary: 85000,
      allowances: 15000,
      deductions: 8500,
      netSalary: 91500,
      paymentDate: "2024-01-31",
      status: "paid",
      bankAccount: "****1234",
      joiningDate: "2018-07-15",
    },
    {
      id: "emp-2",
      name: "Mike Wilson",
      employeeId: "EMP001",
      department: "Administration",
      designation: "Administrative Officer",
      basicSalary: 45000,
      allowances: 8000,
      deductions: 4500,
      netSalary: 48500,
      paymentDate: "2024-01-31",
      status: "pending",
      bankAccount: "****5678",
      joiningDate: "2020-03-10",
    },
    {
      id: "emp-3",
      name: "Dr. Robert Smith",
      employeeId: "FAC002",
      department: "Electronics",
      designation: "Associate Professor",
      basicSalary: 75000,
      allowances: 12000,
      deductions: 7500,
      netSalary: 79500,
      paymentDate: "2024-01-31",
      status: "processed",
      bankAccount: "****9012",
      joiningDate: "2019-08-20",
    },
  ])

  const [selectedPayment, setSelectedPayment] = useState<StudentPayment | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollEmployee | null>(null)
  const [isEditingStructure, setIsEditingStructure] = useState(false)
  const [editingStructure, setEditingStructure] = useState<PaymentStructure | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Add useEffect to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Calculate time remaining for payments
  const getTimeRemaining = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { days: Math.abs(diffDays), status: "overdue" }
    if (diffDays === 0) return { days: 0, status: "due_today" }
    if (diffDays <= 3) return { days: diffDays, status: "urgent" }
    return { days: diffDays, status: "normal" }
  }

  const handlePaymentProcess = (paymentId: string, amount: number, method: string) => {
    setStudentPayments((prev) =>
      prev.map((payment) => {
        if (payment.id === paymentId) {
          const newPaidAmount = payment.paidAmount + amount
          const newStatus = newPaidAmount >= payment.amount ? "paid" : "partial"
          return {
            ...payment,
            paidAmount: newPaidAmount,
            status: newStatus,
            paymentMethod: method,
            paidDate: newStatus === "paid" ? new Date().toISOString().split("T")[0] : payment.paidDate,
            transactionId: `TXN${Date.now()}`,
          }
        }
        return payment
      }),
    )
  }

  const handlePayrollProcess = (employeeId: string) => {
    setPayrollEmployees((prev) =>
      prev.map((employee) => {
        if (employee.id === employeeId) {
          return {
            ...employee,
            status: employee.status === "pending" ? "processed" : "paid",
            paymentDate: new Date().toISOString().split("T")[0],
          }
        }
        return employee
      }),
    )
  }

  const renderStudentView = () => {
    const currentStudentPayments = studentPayments.filter((p) => p.studentId === "STU001")

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Payment Dashboard</CardTitle>
            <CardDescription>Track your fee payments and due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Paid</p>
                      <p className="font-semibold">
                        ₹{currentStudentPayments.reduce((sum, p) => sum + p.paidAmount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="font-semibold">
                        ₹
                        {currentStudentPayments
                          .filter((p) => p.status !== "paid")
                          .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Late Fees</p>
                      <p className="font-semibold">
                        ₹{currentStudentPayments.reduce((sum, p) => sum + p.lateFee, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {paymentStructures
                .filter((ps) => ps.status === "active")
                .map((structure) => {
                  const payment = currentStudentPayments.find((p) => p.structureId === structure.id)
                  const timeRemaining = getTimeRemaining(structure.dueDate)

                  return (
                    <Card key={structure.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium">{structure.name}</h3>
                            <p className="text-sm text-gray-600">{structure.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm">Amount: ₹{structure.amount.toLocaleString()}</span>
                              <span className="text-sm">Due: {new Date(structure.dueDate).toLocaleDateString()}</span>
                              <Badge variant={structure.category === "tuition" ? "default" : "secondary"}>
                                {structure.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            {payment ? (
                              <div>
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
                                <p className="text-sm mt-1">
                                  Paid: ₹{payment.paidAmount.toLocaleString()} / ₹{payment.amount.toLocaleString()}
                                </p>
                                {payment.status !== "paid" && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" className="mt-2">
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Pay Now
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Make Payment</DialogTitle>
                                        <DialogDescription>{structure.name}</DialogDescription>
                                      </DialogHeader>
                                      <PaymentDialog
                                        payment={payment}
                                        structure={structure}
                                        onPayment={handlePaymentProcess}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline">Not Applicable</Badge>
                            )}
                          </div>
                        </div>

                        {timeRemaining.status === "overdue" && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            Payment is {timeRemaining.days} days overdue. Late fee: ₹{structure.lateFeePenalty}
                          </div>
                        )}

                        {timeRemaining.status === "urgent" && (
                          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Payment due in {timeRemaining.days} day(s)
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentStudentPayments
                .filter((p) => p.status === "paid")
                .map((payment) => {
                  const structure = paymentStructures.find((ps) => ps.id === payment.structureId)
                  return (
                    <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{structure?.name}</h4>
                        <p className="text-sm text-gray-600">
                          Paid on {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{payment.paidAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{payment.paymentMethod}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderFinanceView = () => {
    return (
      <Tabs defaultValue="student-payments">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="student-payments">Student Payments</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Management</TabsTrigger>
          <TabsTrigger value="structures">Payment Structures</TabsTrigger>
        </TabsList>

        <TabsContent value="student-payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Student Payment Management</CardTitle>
                  <CardDescription>Monitor and process student fee payments</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminders
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Total Collected</h3>
                      <p className="text-2xl font-bold mt-1">
                        ₹{studentPayments.reduce((sum, p) => sum + p.paidAmount, 0).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                      <p className="text-2xl font-bold mt-1 text-orange-600">
                        ₹
                        {studentPayments
                          .filter((p) => p.status !== "paid")
                          .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
                      <p className="text-2xl font-bold mt-1 text-red-600">
                        {studentPayments.filter((p) => p.status === "overdue").length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Late Fees</h3>
                      <p className="text-2xl font-bold mt-1">
                        ₹{studentPayments.reduce((sum, p) => sum + p.lateFee, 0).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {studentPayments.map((payment) => {
                  const structure = paymentStructures.find((ps) => ps.id === payment.structureId)
                  const timeRemaining = getTimeRemaining(payment.dueDate)

                  return (
                    <Card key={payment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{payment.studentName}</h4>
                              <Badge variant="outline">{payment.studentId}</Badge>
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
                            <p className="text-sm text-gray-600">{structure?.name}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm">Amount: ₹{payment.amount.toLocaleString()}</span>
                              <span className="text-sm">Paid: ₹{payment.paidAmount.toLocaleString()}</span>
                              <span className="text-sm">Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                              {payment.lateFee > 0 && (
                                <span className="text-sm text-red-600">Late Fee: ₹{payment.lateFee}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {payment.status !== "paid" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm">
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    Process
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Process Payment</DialogTitle>
                                    <DialogDescription>
                                      {payment.studentName} - {structure?.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <PaymentDialog
                                    payment={payment}
                                    structure={structure!}
                                    onPayment={handlePaymentProcess}
                                    isFinanceView={true}
                                  />
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payroll Management</CardTitle>
                  <CardDescription>Manage employee salaries and payments</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Payroll
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Process Payroll
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Total Payroll</h3>
                      <p className="text-2xl font-bold mt-1">
                        ₹{payrollEmployees.reduce((sum, e) => sum + e.netSalary, 0).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Pending Payments</h3>
                      <p className="text-2xl font-bold mt-1 text-orange-600">
                        {payrollEmployees.filter((e) => e.status === "pending").length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Employees</h3>
                      <p className="text-2xl font-bold mt-1">{payrollEmployees.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {payrollEmployees.map((employee) => (
                  <Card key={employee.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{employee.name}</h4>
                            <Badge variant="outline">{employee.employeeId}</Badge>
                            <Badge
                              variant={
                                employee.status === "paid"
                                  ? "default"
                                  : employee.status === "processed"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {employee.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {employee.designation} - {employee.department}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm">Basic: ₹{employee.basicSalary.toLocaleString()}</span>
                            <span className="text-sm">Allowances: ₹{employee.allowances.toLocaleString()}</span>
                            <span className="text-sm">Deductions: ₹{employee.deductions.toLocaleString()}</span>
                            <span className="text-sm font-medium">Net: ₹{employee.netSalary.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedEmployee(employee)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {employee.status === "pending" && (
                            <Button size="sm" onClick={() => handlePayrollProcess(employee.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Process
                            </Button>
                          )}
                          {employee.status === "processed" && (
                            <Button size="sm" onClick={() => handlePayrollProcess(employee.id)}>
                              <Send className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structures" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment Structure Management</CardTitle>
                  <CardDescription>Configure fee structures and payment deadlines</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingStructure({
                      id: `ps-${paymentStructures.length + 1}`,
                      name: "",
                      amount: 0,
                      dueDate: "",
                      category: "tuition",
                      semester: "",
                      isRecurring: false,
                      status: "active",
                      description: "",
                      lateFeePenalty: 0,
                      gracePeriodDays: 0,
                    })
                    setIsEditingStructure(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Structure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentStructures.map((structure) => (
                  <Card key={structure.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{structure.name}</h4>
                            <Badge variant={structure.status === "active" ? "default" : "secondary"}>
                              {structure.status}
                            </Badge>
                            <Badge variant="outline">{structure.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{structure.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm">Amount: ₹{structure.amount.toLocaleString()}</span>
                            <span className="text-sm">Due: {new Date(structure.dueDate).toLocaleDateString()}</span>
                            <span className="text-sm">Late Fee: ₹{structure.lateFeePenalty}</span>
                            <span className="text-sm">Grace: {structure.gracePeriodDays} days</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStructure(structure)
                              setIsEditingStructure(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    )
  }

  const renderAdminPrincipalView = () => {
    return (
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="student-payments">Student Payments</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                  <p className="text-2xl font-bold mt-1">
                    ₹{(studentPayments.reduce((sum, p) => sum + p.paidAmount, 0) / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-600">Payroll Expense</h3>
                  <p className="text-2xl font-bold mt-1">
                    ₹{(payrollEmployees.reduce((sum, e) => sum + e.netSalary, 0) / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Monthly</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-600">Collection Rate</h3>
                  <p className="text-2xl font-bold mt-1">87.3%</p>
                  <p className="text-xs text-green-600 mt-1">+2.1% improvement</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-600">Overdue Payments</h3>
                  <p className="text-2xl font-bold mt-1 text-red-600">
                    {studentPayments.filter((p) => p.status === "overdue").length}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Requires attention</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest student fee payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentPayments
                    .filter((p) => p.status === "paid")
                    .slice(0, 5)
                    .map((payment) => {
                      const structure = paymentStructures.find((ps) => ps.id === payment.structureId)
                      return (
                        <div key={payment.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{payment.studentName}</p>
                            <p className="text-sm text-gray-600">{structure?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{payment.paidAmount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{payment.paidDate}</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Payroll</CardTitle>
                <CardDescription>Monthly salary distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    payrollEmployees.reduce(
                      (acc, emp) => {
                        acc[emp.department] = (acc[emp.department] || 0) + emp.netSalary
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  ).map(([dept, total]) => (
                    <div key={dept} className="flex justify-between items-center p-2 border rounded">
                      <p className="font-medium">{dept}</p>
                      <p className="font-medium">₹{total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="student-payments">{renderFinanceView().props.children[1].props.children[0]}</TabsContent>

        <TabsContent value="payroll">{renderFinanceView().props.children[1].props.children[1]}</TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Analytics</CardTitle>
              <CardDescription>Payment trends and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Payment Collection Trends</h3>
                  <div className="h-40 flex items-end space-x-2">
                    {[85, 78, 92, 87, 94, 89].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-blue-500 rounded-t" style={{ height: `${value}px` }}></div>
                        <span className="text-xs mt-1">{["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][index]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Payment Categories</h3>
                  <div className="space-y-2">
                    {[
                      { category: "Tuition Fees", amount: 1250000, percentage: 65 },
                      { category: "Hostel Fees", amount: 450000, percentage: 23 },
                      { category: "Laboratory Fees", amount: 180000, percentage: 9 },
                      { category: "Other Fees", amount: 60000, percentage: 3 },
                    ].map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span>
                            ₹{item.amount.toLocaleString()} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <SkeletonLoader type="payment" count={3} />
      ) : (
        <>
          {userRole === "student" && renderStudentView()}
          {userRole === "finance" && renderFinanceView()}
          {(userRole === "admin" || userRole === "principal") && renderAdminPrincipalView()}

          {/* Payment Structure Edit Dialog */}
          {isEditingStructure && editingStructure && (
            <Dialog open={isEditingStructure} onOpenChange={setIsEditingStructure}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingStructure.id.includes("ps-") && editingStructure.name ? "Edit" : "Create"} Payment Structure
                  </DialogTitle>
                  <DialogDescription>Configure fee structure and payment terms</DialogDescription>
                </DialogHeader>
                <PaymentStructureForm
                  structure={editingStructure}
                  onSave={(structure) => {
                    if (paymentStructures.find((ps) => ps.id === structure.id)) {
                      setPaymentStructures((prev) => prev.map((ps) => (ps.id === structure.id ? structure : ps)))
                    } else {
                      setPaymentStructures((prev) => [...prev, structure])
                    }
                    setIsEditingStructure(false)
                    setEditingStructure(null)
                  }}
                  onCancel={() => {
                    setIsEditingStructure(false)
                    setEditingStructure(null)
                  }}
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Payment Details Dialog */}
          {selectedPayment && (
            <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payment Details</DialogTitle>
                  <DialogDescription>{selectedPayment.studentName}</DialogDescription>
                </DialogHeader>
                <PaymentDetailsView payment={selectedPayment} />
              </DialogContent>
            </Dialog>
          )}

          {/* Employee Details Dialog */}
          {selectedEmployee && (
            <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Employee Payroll Details</DialogTitle>
                  <DialogDescription>{selectedEmployee.name}</DialogDescription>
                </DialogHeader>
                <EmployeeDetailsView employee={selectedEmployee} />
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  )
}

// Payment Dialog Component
function PaymentDialog({
  payment,
  structure,
  onPayment,
  isFinanceView = false,
}: {
  payment: StudentPayment
  structure: PaymentStructure
  onPayment: (paymentId: string, amount: number, method: string) => void
  isFinanceView?: boolean
}) {
  const [amount, setAmount] = useState(payment.amount - payment.paidAmount)
  const [paymentMethod, setPaymentMethod] = useState("online_banking")
  const [remarks, setRemarks] = useState("")

  const handleSubmit = () => {
    onPayment(payment.id, amount, paymentMethod)
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium">{structure.name}</h3>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>Total Amount: ₹{payment.amount.toLocaleString()}</div>
          <div>Paid Amount: ₹{payment.paidAmount.toLocaleString()}</div>
          <div>Remaining: ₹{(payment.amount - payment.paidAmount).toLocaleString()}</div>
          <div>Due Date: {new Date(payment.dueDate).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-amount">Payment Amount</Label>
        <Input
          id="payment-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          max={payment.amount - payment.paidAmount}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online_banking">Online Banking</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="debit_card">Debit Card</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
            <SelectItem value="demand_draft">Demand Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isFinanceView && (
        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add any remarks or notes"
          />
        </div>
      )}

      <Button onClick={handleSubmit} className="w-full">
        <CreditCard className="h-4 w-4 mr-2" />
        Process Payment
      </Button>
    </div>
  )
}

// Payment Structure Form Component
function PaymentStructureForm({
  structure,
  onSave,
  onCancel,
}: {
  structure: PaymentStructure
  onSave: (structure: PaymentStructure) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(structure)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="structure-name">Structure Name</Label>
          <Input
            id="structure-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="structure-amount">Amount</Label>
          <Input
            id="structure-amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="structure-category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: any) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tuition">Tuition</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
              <SelectItem value="library">Library</SelectItem>
              <SelectItem value="lab">Laboratory</SelectItem>
              <SelectItem value="exam">Examination</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="structure-due-date">Due Date</Label>
          <Input
            id="structure-due-date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="late-fee">Late Fee Penalty</Label>
          <Input
            id="late-fee"
            type="number"
            value={formData.lateFeePenalty}
            onChange={(e) => setFormData({ ...formData, lateFeePenalty: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grace-period">Grace Period (Days)</Label>
          <Input
            id="grace-period"
            type="number"
            value={formData.gracePeriodDays}
            onChange={(e) => setFormData({ ...formData, gracePeriodDays: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="structure-description">Description</Label>
        <Textarea
          id="structure-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isRecurring}
          onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
        />
        <Label>Recurring Payment</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>Save Structure</Button>
      </div>
    </div>
  )
}

// Payment Details View Component
function PaymentDetailsView({ payment }: { payment: StudentPayment }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label>Student ID</Label>
          <p className="font-medium">{payment.studentId}</p>
        </div>
        <div>
          <Label>Student Name</Label>
          <p className="font-medium">{payment.studentName}</p>
        </div>
        <div>
          <Label>Total Amount</Label>
          <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
        </div>
        <div>
          <Label>Paid Amount</Label>
          <p className="font-medium">₹{payment.paidAmount.toLocaleString()}</p>
        </div>
        <div>
          <Label>Due Date</Label>
          <p className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <Label>Status</Label>
          <Badge
            variant={payment.status === "paid" ? "default" : payment.status === "overdue" ? "destructive" : "secondary"}
          >
            {payment.status}
          </Badge>
        </div>
        {payment.paidDate && (
          <>
            <div>
              <Label>Payment Date</Label>
              <p className="font-medium">{new Date(payment.paidDate).toLocaleDateString()}</p>
            </div>
            <div>
              <Label>Payment Method</Label>
              <p className="font-medium">{payment.paymentMethod}</p>
            </div>
          </>
        )}
        {payment.transactionId && (
          <div className="col-span-2">
            <Label>Transaction ID</Label>
            <p className="font-medium">{payment.transactionId}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Employee Details View Component
function EmployeeDetailsView({ employee }: { employee: PayrollEmployee }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label>Employee ID</Label>
          <p className="font-medium">{employee.employeeId}</p>
        </div>
        <div>
          <Label>Name</Label>
          <p className="font-medium">{employee.name}</p>
        </div>
        <div>
          <Label>Department</Label>
          <p className="font-medium">{employee.department}</p>
        </div>
        <div>
          <Label>Designation</Label>
          <p className="font-medium">{employee.designation}</p>
        </div>
        <div>
          <Label>Basic Salary</Label>
          <p className="font-medium">₹{employee.basicSalary.toLocaleString()}</p>
        </div>
        <div>
          <Label>Allowances</Label>
          <p className="font-medium">₹{employee.allowances.toLocaleString()}</p>
        </div>
        <div>
          <Label>Deductions</Label>
          <p className="font-medium">₹{employee.deductions.toLocaleString()}</p>
        </div>
        <div>
          <Label>Net Salary</Label>
          <p className="font-medium">₹{employee.netSalary.toLocaleString()}</p>
        </div>
        <div>
          <Label>Bank Account</Label>
          <p className="font-medium">{employee.bankAccount}</p>
        </div>
        <div>
          <Label>Status</Label>
          <Badge
            variant={
              employee.status === "paid" ? "default" : employee.status === "processed" ? "secondary" : "destructive"
            }
          >
            {employee.status}
          </Badge>
        </div>
      </div>
    </div>
  )
}
