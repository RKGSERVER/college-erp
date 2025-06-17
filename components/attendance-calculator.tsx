"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface AttendanceCalculatorProps {
  userRole: "student" | "faculty" | "admin" | "employee" | "principal"
  initialValues?: {
    totalClasses?: number
    attendedClasses?: number
    requiredPercentage?: number
  }
}

export function AttendanceCalculator({ userRole, initialValues }: AttendanceCalculatorProps) {
  const [totalClasses, setTotalClasses] = useState(initialValues?.totalClasses || 40)
  const [attendedClasses, setAttendedClasses] = useState(initialValues?.attendedClasses || 30)
  const [requiredPercentage, setRequiredPercentage] = useState(initialValues?.requiredPercentage || 75)
  const [calculationType, setCalculationType] = useState<"current" | "required" | "future">("current")
  const [futureTotalClasses, setFutureTotalClasses] = useState(60)

  // Calculate current attendance percentage
  const currentPercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0

  // Calculate classes needed to reach required percentage
  const calculateClassesNeeded = () => {
    if (currentPercentage >= requiredPercentage) return 0

    // Formula: (requiredPercentage * totalClasses - 100 * attendedClasses) / (100 - requiredPercentage)
    const classesNeeded = Math.ceil(
      (requiredPercentage * totalClasses - 100 * attendedClasses) / (100 - requiredPercentage),
    )
    return Math.max(0, classesNeeded)
  }

  // Calculate future attendance percentage
  const calculateFuturePercentage = () => {
    if (futureTotalClasses < totalClasses) return currentPercentage

    // Assuming all future classes are attended
    const futureAttendedClasses = attendedClasses + (futureTotalClasses - totalClasses)
    return (futureAttendedClasses / futureTotalClasses) * 100
  }

  // Calculate maximum absences allowed
  const calculateMaxAbsences = () => {
    // Formula: totalClasses - (requiredPercentage * totalClasses / 100)
    return Math.floor(totalClasses - (requiredPercentage * totalClasses) / 100)
  }

  // Get attendance status
  const getAttendanceStatus = (percentage: number) => {
    if (percentage < requiredPercentage) return "critical"
    if (percentage < requiredPercentage + 5) return "warning"
    return "good"
  }

  const currentStatus = getAttendanceStatus(currentPercentage)
  const futureStatus = getAttendanceStatus(calculateFuturePercentage())
  const classesNeeded = calculateClassesNeeded()
  const maxAbsences = calculateMaxAbsences()
  const remainingAbsences = maxAbsences - (totalClasses - attendedClasses)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Attendance Calculator</CardTitle>
            <CardDescription>Calculate and plan your attendance requirements</CardDescription>
          </div>
          <Calculator className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Calculation Type</Label>
          <Select
            value={calculationType}
            onValueChange={(value: "current" | "required" | "future") => setCalculationType(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Attendance</SelectItem>
              <SelectItem value="required">Required Classes</SelectItem>
              <SelectItem value="future">Future Projection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total-classes">Total Classes (Conducted)</Label>
            <Input
              id="total-classes"
              type="number"
              min="1"
              value={totalClasses}
              onChange={(e) => setTotalClasses(Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attended-classes">Classes Attended</Label>
            <Input
              id="attended-classes"
              type="number"
              min="0"
              max={totalClasses}
              value={attendedClasses}
              onChange={(e) => setAttendedClasses(Number.parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="required-percentage">Required Attendance (%)</Label>
          <Input
            id="required-percentage"
            type="number"
            min="0"
            max="100"
            value={requiredPercentage}
            onChange={(e) => setRequiredPercentage(Number.parseInt(e.target.value) || 0)}
          />
        </div>

        {calculationType === "future" && (
          <div className="space-y-2">
            <Label htmlFor="future-total-classes">Expected Total Classes (End of Semester)</Label>
            <Input
              id="future-total-classes"
              type="number"
              min={totalClasses}
              value={futureTotalClasses}
              onChange={(e) => setFutureTotalClasses(Number.parseInt(e.target.value) || totalClasses)}
            />
          </div>
        )}

        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Current Attendance</h3>
            <div className="flex items-center space-x-2">
              <span className="font-bold">{currentPercentage.toFixed(1)}%</span>
              {currentStatus === "critical" && <Badge variant="destructive">Below Requirement</Badge>}
              {currentStatus === "warning" && <Badge variant="warning">Near Threshold</Badge>}
              {currentStatus === "good" && <Badge variant="default">Good Standing</Badge>}
            </div>
          </div>

          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                currentStatus === "critical"
                  ? "bg-red-500"
                  : currentStatus === "warning"
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${Math.min(100, currentPercentage)}%` }}
            ></div>
          </div>

          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span className="relative">
              <span
                className="absolute bottom-0 transform -translate-x-1/2 border-l border-gray-400 h-2"
                style={{ left: `${requiredPercentage}%` }}
              ></span>
              <span
                className="absolute bottom-3 transform -translate-x-1/2 text-gray-600 font-medium"
                style={{ left: `${requiredPercentage}%` }}
              >
                {requiredPercentage}%
              </span>
            </span>
            <span>100%</span>
          </div>
        </div>

        {calculationType === "current" && (
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium">Attendance Summary</h3>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Classes Attended</p>
                  <p className="font-medium">
                    {attendedClasses} of {totalClasses}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Classes Missed</p>
                  <p className="font-medium">{totalClasses - attendedClasses}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Maximum Absences Allowed</p>
                  <p className="font-medium">{maxAbsences}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Remaining Absences</p>
                  <p className={`font-medium ${remainingAbsences < 0 ? "text-red-600" : ""}`}>{remainingAbsences}</p>
                </div>
              </div>
            </div>

            {currentStatus === "critical" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h3 className="font-medium text-red-800">Attendance Warning</h3>
                </div>
                <p className="mt-1 text-sm text-red-700">
                  Your attendance is below the required {requiredPercentage}%. You may face academic consequences.
                </p>
              </div>
            )}

            {currentStatus === "warning" && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800">Attendance Notice</h3>
                </div>
                <p className="mt-1 text-sm text-yellow-700">
                  Your attendance is near the minimum threshold. Try to attend more classes.
                </p>
              </div>
            )}

            {currentStatus === "good" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <h3 className="font-medium text-green-800">Good Standing</h3>
                </div>
                <p className="mt-1 text-sm text-green-700">
                  Your attendance is above the required percentage. Keep it up!
                </p>
              </div>
            )}
          </div>
        )}

        {calculationType === "required" && (
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium">Required Classes</h3>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                {currentPercentage >= requiredPercentage ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-green-800">
                        You've already met the required attendance of {requiredPercentage}%.
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-green-700">
                      You can miss up to {remainingAbsences} more classes while maintaining the required attendance.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                      To reach {requiredPercentage}% attendance, you need to attend the next{" "}
                      <span className="font-bold">{classesNeeded}</span> classes consecutively.
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      This assumes no additional classes are conducted beyond your current total of {totalClasses}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {calculationType === "future" && (
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium">Future Projection</h3>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                <div className="p-3 bg-gray-50 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                      If you attend all remaining {futureTotalClasses - totalClasses} classes:
                    </p>
                    <Badge
                      variant={
                        futureStatus === "critical" ? "destructive" : futureStatus === "warning" ? "warning" : "default"
                      }
                    >
                      {calculateFuturePercentage().toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 border rounded-lg">
                  <p className="text-gray-700">
                    Maximum absences allowed in remaining classes:{" "}
                    <span className="font-bold">
                      {Math.max(0, Math.floor((futureTotalClasses * requiredPercentage) / 100 - attendedClasses))}
                    </span>{" "}
                    out of {futureTotalClasses - totalClasses}
                  </p>
                </div>

                {futureStatus === "critical" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-red-800">
                        Even with perfect attendance for remaining classes, you cannot reach the required{" "}
                        {requiredPercentage}%.
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-red-700">
                      Consider speaking with your instructor about attendance recovery options.
                    </p>
                  </div>
                )}

                {futureStatus === "warning" && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <p className="text-yellow-800">
                        You can reach the minimum requirement, but you'll need to be very consistent.
                      </p>
                    </div>
                  </div>
                )}

                {futureStatus === "good" && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-green-800">You're on track to exceed the required attendance percentage.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
