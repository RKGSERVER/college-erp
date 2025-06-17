import { type NextRequest, NextResponse } from "next/server"
import {
  validateField,
  userRegistrationSchema,
  studentSchema,
  facultySchema,
  courseSchema,
  attendanceSchema,
  paymentSchema,
  scholarshipSchema,
  notificationSchema,
  customValidations,
} from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const { schema, data, field } = await request.json()

    // Get the appropriate schema
    const schemas = {
      userRegistration: userRegistrationSchema,
      student: studentSchema,
      faculty: facultySchema,
      course: courseSchema,
      attendance: attendanceSchema,
      payment: paymentSchema,
      scholarship: scholarshipSchema,
      notification: notificationSchema,
    }

    const validationSchema = schemas[schema as keyof typeof schemas]
    if (!validationSchema) {
      return NextResponse.json({ error: "Invalid schema specified" }, { status: 400 })
    }

    // Validate single field or entire object
    let result
    if (field) {
      // Single field validation
      const fieldSchema = validationSchema.shape[field]
      if (!fieldSchema) {
        return NextResponse.json({ error: "Invalid field specified" }, { status: 400 })
      }
      result = validateField(fieldSchema, data)
    } else {
      // Full object validation
      result = validateField(validationSchema, data)
    }

    // Additional custom validations
    if (result.success && schema === "userRegistration") {
      const { username, email } = data

      // Check unique username
      if (username) {
        const isUniqueUsername = await customValidations.isUniqueUsername(username)
        if (!isUniqueUsername) {
          return NextResponse.json({
            success: false,
            errors: ["Username is already taken"],
          })
        }
      }

      // Check unique email
      if (email) {
        const isUniqueEmail = await customValidations.isUniqueEmail(email)
        if (!isUniqueEmail) {
          return NextResponse.json({
            success: false,
            errors: ["Email is already registered"],
          })
        }
      }
    }

    if (result.success && schema === "student") {
      const { rollNumber, departmentId } = data

      if (rollNumber && departmentId) {
        const isValidRollNumber = await customValidations.isValidRollNumber(rollNumber, departmentId)
        if (!isValidRollNumber) {
          return NextResponse.json({
            success: false,
            errors: ["Roll number format is invalid for this department"],
          })
        }
      }
    }

    if (result.success && schema === "course") {
      const { courseCode, departmentId } = data

      if (courseCode && departmentId) {
        const isValidCourseCode = await customValidations.isValidCourseCode(courseCode, departmentId)
        if (!isValidCourseCode) {
          return NextResponse.json({
            success: false,
            errors: ["Course code format is invalid for this department"],
          })
        }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const userRole = searchParams.get("userRole")
  const resource = searchParams.get("resource")

  if (action === "checkPermission" && userRole && resource) {
    const hasPermission = customValidations.hasPermission(userRole, action, resource)
    return NextResponse.json({ hasPermission })
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 })
}
