import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Please enter a valid email address")
export const phoneSchema = z.string().regex(/^[+]?[\d\s\-$$$$]{10,15}$/, "Please enter a valid phone number")
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain uppercase, lowercase, number and special character",
  )

// User validation schemas
export const userRegistrationSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(["student", "faculty", "admin", "employee", "principal"], {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
    phone: phoneSchema,
    departmentId: z.string().uuid("Please select a valid department"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  middleName: z
    .string()
    .max(50, "Middle name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Middle name can only contain letters and spaces")
    .optional(),
  email: emailSchema,
  phone: phoneSchema,
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    return age >= 16 && age <= 100
  }, "Age must be between 16 and 100 years"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      errorMap: () => ({ message: "Please select a valid blood group" }),
    })
    .optional(),
  nationality: z
    .string()
    .min(2, "Nationality must be at least 2 characters")
    .max(50, "Nationality must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Nationality can only contain letters and spaces"),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "State can only contain letters and spaces"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Country can only contain letters and spaces"),
  postalCode: z.string().regex(/^[0-9]{5,10}$/, "Postal code must be 5-10 digits"),
  emergencyContact: phoneSchema,
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
})

// Student validation schemas
export const studentSchema = z.object({
  rollNumber: z
    .string()
    .min(5, "Roll number must be at least 5 characters")
    .max(20, "Roll number must not exceed 20 characters")
    .regex(/^[A-Z0-9]+$/, "Roll number can only contain uppercase letters and numbers"),
  admissionNumber: z
    .string()
    .min(5, "Admission number must be at least 5 characters")
    .max(20, "Admission number must not exceed 20 characters"),
  admissionDate: z.string().refine((date) => new Date(date) <= new Date(), "Admission date cannot be in the future"),
  semester: z.number().min(1, "Semester must be at least 1").max(8, "Semester cannot exceed 8"),
  year: z.number().min(1, "Year must be at least 1").max(4, "Year cannot exceed 4"),
  cgpa: z.number().min(0, "CGPA cannot be negative").max(10, "CGPA cannot exceed 10").optional(),
  creditsCompleted: z
    .number()
    .min(0, "Credits completed cannot be negative")
    .max(200, "Credits completed cannot exceed 200")
    .optional(),
  status: z.enum(["active", "inactive", "graduated", "suspended"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
})

export const studentProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  phone: z.string().regex(/^[+]?[\d\s\-()]{10,15}$/, "Please enter a valid phone number"),
})

// Faculty validation schemas
export const facultySchema = z.object({
  employeeId: z
    .string()
    .min(5, "Employee ID must be at least 5 characters")
    .max(20, "Employee ID must not exceed 20 characters")
    .regex(/^[A-Z0-9]+$/, "Employee ID can only contain uppercase letters and numbers"),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must not exceed 100 characters"),
  qualification: z
    .string()
    .min(2, "Qualification must be at least 2 characters")
    .max(200, "Qualification must not exceed 200 characters"),
  experience: z.number().min(0, "Experience cannot be negative").max(50, "Experience cannot exceed 50 years"),
  specialization: z
    .string()
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization must not exceed 100 characters"),
  joiningDate: z.string().refine((date) => new Date(date) <= new Date(), "Joining date cannot be in the future"),
  salary: z.number().min(0, "Salary cannot be negative").max(10000000, "Salary cannot exceed 1 crore"),
})

// Course validation schemas
export const courseSchema = z.object({
  courseCode: z
    .string()
    .min(3, "Course code must be at least 3 characters")
    .max(10, "Course code must not exceed 10 characters")
    .regex(/^[A-Z0-9]+$/, "Course code can only contain uppercase letters and numbers"),
  courseName: z
    .string()
    .min(5, "Course name must be at least 5 characters")
    .max(100, "Course name must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  credits: z.number().min(1, "Credits must be at least 1").max(6, "Credits cannot exceed 6"),
  semester: z.number().min(1, "Semester must be at least 1").max(8, "Semester cannot exceed 8"),
  year: z.number().min(1, "Year must be at least 1").max(4, "Year cannot exceed 4"),
  departmentId: z.string().uuid("Please select a valid department"),
  prerequisites: z.array(z.string()).optional(),
  maxStudents: z.number().min(1, "Maximum students must be at least 1").max(200, "Maximum students cannot exceed 200"),
})

// Attendance validation schemas
export const attendanceSchema = z.object({
  userId: z.string().uuid("Please select a valid user"),
  courseId: z.string().uuid("Please select a valid course"),
  date: z.string().refine((date) => {
    const attendanceDate = new Date(date)
    const today = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(today.getFullYear() - 1)
    return attendanceDate >= oneYearAgo && attendanceDate <= today
  }, "Attendance date must be within the last year and not in the future"),
  status: z.enum(["present", "absent", "late", "excused"], {
    errorMap: () => ({ message: "Please select a valid attendance status" }),
  }),
  notes: z.string().max(200, "Notes must not exceed 200 characters").optional(),
})

export const attendanceRuleSchema = z
  .object({
    name: z
      .string()
      .min(5, "Rule name must be at least 5 characters")
      .max(100, "Rule name must not exceed 100 characters"),
    minAttendancePercentage: z
      .number()
      .min(0, "Minimum attendance percentage cannot be negative")
      .max(100, "Minimum attendance percentage cannot exceed 100"),
    warningThreshold: z
      .number()
      .min(0, "Warning threshold cannot be negative")
      .max(100, "Warning threshold cannot exceed 100"),
    criticalThreshold: z
      .number()
      .min(0, "Critical threshold cannot be negative")
      .max(100, "Critical threshold cannot exceed 100"),
    consequenceType: z.enum(["exam_block", "grade_reduction", "warning", "probation"], {
      errorMap: () => ({ message: "Please select a valid consequence type" }),
    }),
    appliesTo: z.enum(["all", "department", "course"], {
      errorMap: () => ({ message: "Please select a valid application scope" }),
    }),
    targetId: z.string().optional(),
    graceAllowance: z
      .number()
      .min(0, "Grace allowance cannot be negative")
      .max(30, "Grace allowance cannot exceed 30 days"),
    lateFeePenalty: z
      .number()
      .min(0, "Late fee penalty cannot be negative")
      .max(10000, "Late fee penalty cannot exceed 10,000"),
  })
  .refine(
    (data) => {
      return data.warningThreshold >= data.criticalThreshold
    },
    {
      message: "Warning threshold must be greater than or equal to critical threshold",
      path: ["warningThreshold"],
    },
  )

// Payment validation schemas
export const paymentStructureSchema = z.object({
  name: z
    .string()
    .min(5, "Structure name must be at least 5 characters")
    .max(100, "Structure name must not exceed 100 characters"),
  amount: z.number().min(1, "Amount must be at least 1").max(1000000, "Amount cannot exceed 10 lakhs"),
  dueDate: z.string().refine((date) => {
    const dueDate = new Date(date)
    const today = new Date()
    return dueDate >= today
  }, "Due date must be in the future"),
  category: z.enum(["tuition", "hostel", "library", "lab", "exam", "other"], {
    errorMap: () => ({ message: "Please select a valid fee category" }),
  }),
  semester: z.string().regex(/^[1-8]$/, "Semester must be between 1 and 8"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must not exceed 200 characters"),
  lateFeePenalty: z
    .number()
    .min(0, "Late fee penalty cannot be negative")
    .max(10000, "Late fee penalty cannot exceed 10,000"),
  gracePeriodDays: z.number().min(0, "Grace period cannot be negative").max(30, "Grace period cannot exceed 30 days"),
})

export const paymentSchema = z.object({
  amount: z.number().min(1, "Payment amount must be at least 1").max(1000000, "Payment amount cannot exceed 10 lakhs"),
  paymentMethod: z.enum(["online_banking", "credit_card", "debit_card", "cash", "cheque", "demand_draft"], {
    errorMap: () => ({ message: "Please select a valid payment method" }),
  }),
  remarks: z.string().max(200, "Remarks must not exceed 200 characters").optional(),
})

// Scholarship validation schemas
export const scholarshipSchema = z.object({
  name: z
    .string()
    .min(5, "Scholarship name must be at least 5 characters")
    .max(100, "Scholarship name must not exceed 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must not exceed 500 characters"),
  amount: z
    .number()
    .min(1000, "Scholarship amount must be at least 1,000")
    .max(500000, "Scholarship amount cannot exceed 5 lakhs")
    .optional(),
  percentage: z
    .number()
    .min(1, "Scholarship percentage must be at least 1%")
    .max(100, "Scholarship percentage cannot exceed 100%")
    .optional(),
  scholarshipType: z.enum(["merit", "need_based", "sports", "cultural", "minority", "other"], {
    errorMap: () => ({ message: "Please select a valid scholarship type" }),
  }),
  eligibilityCriteria: z
    .string()
    .min(20, "Eligibility criteria must be at least 20 characters")
    .max(1000, "Eligibility criteria must not exceed 1000 characters"),
  applicationDeadline: z.string().refine((date) => {
    const deadline = new Date(date)
    const today = new Date()
    return deadline > today
  }, "Application deadline must be in the future"),
  maxApplicants: z
    .number()
    .min(1, "Maximum applicants must be at least 1")
    .max(1000, "Maximum applicants cannot exceed 1000"),
  minCgpa: z.number().min(0, "Minimum CGPA cannot be negative").max(10, "Minimum CGPA cannot exceed 10").optional(),
  maxFamilyIncome: z
    .number()
    .min(0, "Maximum family income cannot be negative")
    .max(10000000, "Maximum family income cannot exceed 1 crore")
    .optional(),
})

// Notification validation schemas
export const notificationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must not exceed 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
  type: z.enum(["info", "success", "warning", "error"], {
    errorMap: () => ({ message: "Please select a valid notification type" }),
  }),
  category: z.enum(["system", "academic", "financial", "attendance", "announcement"], {
    errorMap: () => ({ message: "Please select a valid notification category" }),
  }),
  priority: z.enum(["low", "medium", "high", "critical"], {
    errorMap: () => ({ message: "Please select a valid priority level" }),
  }),
  channels: z.array(z.enum(["in_app", "email", "sms", "push"])).min(1, "At least one channel must be selected"),
  expiresAt: z.string().optional(),
  targetUsers: z.array(z.string().uuid()).min(1, "At least one target user must be selected"),
})

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(50, "Username must not exceed 50 characters"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["student", "faculty", "admin", "employee", "principal"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  rememberMe: z.boolean().optional(),
})

// Dashboard configuration validation
export const dashboardConfigSchema = z.object({
  theme: z.enum(["default", "dark", "light", "colorful"], {
    errorMap: () => ({ message: "Please select a valid theme" }),
  }),
  layout: z.enum(["grid", "list", "compact", "expanded"], {
    errorMap: () => ({ message: "Please select a valid layout" }),
  }),
  widgets: z.array(
    z.object({
      id: z.string(),
      enabled: z.boolean(),
      position: z.number().min(1),
    }),
  ),
})

export const changeRequestSchema = z.object({
  type: z.enum(["date_of_birth", "address"], {
    errorMap: () => ({ message: "Please select a valid request type" }),
  }),
  currentValue: z.string().min(1, "Current value is required"),
  requestedValue: z.string().min(1, "Requested value is required"),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason must not exceed 500 characters"),
  verificationDocument: z.instanceof(File).optional(),
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine((file) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
      return allowedTypes.includes(file.type)
    }, "File type not supported. Please upload JPEG, PNG, GIF, or PDF files"),
  category: z.enum(["profile_photo", "aadhar_card", "verification_document"], {
    errorMap: () => ({ message: "Please select a valid file category" }),
  }),
})

// Validation helper functions
export function validateField<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: boolean; data?: T; errors?: string[] } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => err.message),
      }
    }
    return {
      success: false,
      errors: ["Validation failed"],
    }
  }
}

export function validatePartial<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: boolean; data?: Partial<T>; errors?: Record<string, string[]> } {
  try {
    const result = schema.partial().parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const field = err.path.join(".")
        if (!fieldErrors[field]) {
          fieldErrors[field] = []
        }
        fieldErrors[field].push(err.message)
      })
      return {
        success: false,
        errors: fieldErrors,
      }
    }
    return {
      success: false,
      errors: { general: ["Validation failed"] },
    }
  }
}

// Custom validation rules
export const customValidations = {
  isUniqueUsername: async (username: string): Promise<boolean> => {
    // This would check against the database
    // For now, return true as placeholder
    return true
  },

  isUniqueEmail: async (email: string): Promise<boolean> => {
    // This would check against the database
    // For now, return true as placeholder
    return true
  },

  isValidRollNumber: async (rollNumber: string, departmentId: string): Promise<boolean> => {
    // This would check against the database for department-specific roll number format
    return true
  },

  isValidCourseCode: async (courseCode: string, departmentId: string): Promise<boolean> => {
    // This would check against the database for department-specific course code format
    return true
  },

  hasPermission: (userRole: string, action: string, resource: string): boolean => {
    // Define role-based permissions
    const permissions = {
      admin: ["*"],
      principal: ["view_all", "approve_requests", "manage_policies"],
      faculty: ["manage_courses", "grade_students", "view_reports"],
      employee: ["manage_records", "process_documents"],
      student: ["view_courses", "submit_assignments", "make_payments"],
    }

    const userPermissions = permissions[userRole as keyof typeof permissions] || []
    return userPermissions.includes("*") || userPermissions.includes(`${action}_${resource}`)
  },
}

export type ValidationResult<T> = {
  success: boolean
  data?: T
  errors?: string[] | Record<string, string[]>
}
