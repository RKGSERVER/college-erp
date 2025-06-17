"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"
import { userRegistrationSchema, studentSchema } from "@/lib/validation"
import { Loader2, UserPlus } from "lucide-react"
import type { z } from "zod"

const combinedSchema = userRegistrationSchema.merge(studentSchema)

interface StudentRegistrationFormProps {
  onSubmit: (data: z.infer<typeof combinedSchema>) => Promise<void>
  departments: { id: string; name: string }[]
}

export function StudentRegistrationForm({ onSubmit, departments }: StudentRegistrationFormProps) {
  const { values, errors, isValid, isSubmitting, handleSubmit, getFieldProps } = useFormValidation({
    schema: combinedSchema,
    initialValues: {
      role: "student",
      semester: 1,
      year: 1,
      status: "active",
    },
    validateOnChange: true,
    onSubmit,
  })

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Student Registration</span>
        </CardTitle>
        <CardDescription>Register a new student with complete profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                required
                placeholder="Enter first name"
                {...getFieldProps("firstName")}
              />
              <FormField
                label="Last Name"
                name="lastName"
                required
                placeholder="Enter last name"
                {...getFieldProps("lastName")}
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="student@college.edu"
                {...getFieldProps("email")}
              />
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                required
                placeholder="+1 (555) 123-4567"
                {...getFieldProps("phone")}
              />
              <FormField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                required
                {...getFieldProps("dateOfBirth")}
              />
              <FormField
                label="Gender"
                name="gender"
                type="select"
                required
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                {...getFieldProps("gender")}
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Username"
                name="username"
                required
                placeholder="student123"
                description="Username must be unique and contain only letters, numbers, and underscores"
                {...getFieldProps("username")}
              />
              <FormField
                label="Department"
                name="departmentId"
                type="select"
                required
                options={departments.map((dept) => ({ value: dept.id, label: dept.name }))}
                {...getFieldProps("departmentId")}
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                required
                showPasswordToggle
                description="Password must contain uppercase, lowercase, number and special character"
                {...getFieldProps("password")}
              />
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                showPasswordToggle
                {...getFieldProps("confirmPassword")}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Roll Number"
                name="rollNumber"
                required
                placeholder="CS2024001"
                description="Department-specific roll number"
                {...getFieldProps("rollNumber")}
              />
              <FormField
                label="Admission Number"
                name="admissionNumber"
                required
                placeholder="ADM2024001"
                {...getFieldProps("admissionNumber")}
              />
              <FormField
                label="Admission Date"
                name="admissionDate"
                type="date"
                required
                {...getFieldProps("admissionDate")}
              />
              <FormField
                label="Current Semester"
                name="semester"
                type="number"
                min={1}
                max={8}
                required
                {...getFieldProps("semester")}
              />
              <FormField
                label="Current Year"
                name="year"
                type="number"
                min={1}
                max={4}
                required
                {...getFieldProps("year")}
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                required
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "suspended", label: "Suspended" },
                ]}
                {...getFieldProps("status")}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Address"
                name="address"
                type="textarea"
                required
                placeholder="Enter complete address"
                {...getFieldProps("address")}
              />
              <div className="space-y-4">
                <FormField label="City" name="city" required placeholder="Enter city" {...getFieldProps("city")} />
                <FormField label="State" name="state" required placeholder="Enter state" {...getFieldProps("state")} />
                <FormField
                  label="Country"
                  name="country"
                  required
                  placeholder="Enter country"
                  {...getFieldProps("country")}
                />
                <FormField
                  label="Postal Code"
                  name="postalCode"
                  required
                  placeholder="12345"
                  {...getFieldProps("postalCode")}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Blood Group"
                name="bloodGroup"
                type="select"
                options={[
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" },
                ]}
                {...getFieldProps("bloodGroup")}
              />
              <FormField
                label="Nationality"
                name="nationality"
                required
                placeholder="Enter nationality"
                {...getFieldProps("nationality")}
              />
              <FormField
                label="Emergency Contact"
                name="emergencyContact"
                type="tel"
                required
                placeholder="+1 (555) 987-6543"
                {...getFieldProps("emergencyContact")}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Student
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
