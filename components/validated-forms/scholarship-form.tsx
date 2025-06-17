"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"
import { scholarshipSchema } from "@/lib/validation"
import { Award, Loader2 } from "lucide-react"
import type { z } from "zod"

interface ScholarshipFormProps {
  initialData?: Partial<z.infer<typeof scholarshipSchema>>
  onSubmit: (data: z.infer<typeof scholarshipSchema>) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

export function ScholarshipForm({ initialData, onSubmit, onCancel, isEditing = false }: ScholarshipFormProps) {
  const { values, errors, isValid, isSubmitting, handleSubmit, getFieldProps } = useFormValidation({
    schema: scholarshipSchema,
    initialValues: initialData || {
      scholarshipType: "merit",
      maxApplicants: 50,
    },
    validateOnChange: true,
    onSubmit,
  })

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>{isEditing ? "Edit Scholarship" : "Create New Scholarship"}</span>
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update scholarship details" : "Create a new scholarship program"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <FormField
              label="Scholarship Name"
              name="name"
              required
              placeholder="Merit-based Academic Excellence Scholarship"
              {...getFieldProps("name")}
            />
            <FormField
              label="Description"
              name="description"
              type="textarea"
              required
              placeholder="Detailed description of the scholarship program, its objectives, and benefits..."
              rows={4}
              {...getFieldProps("description")}
            />
            <FormField
              label="Scholarship Type"
              name="scholarshipType"
              type="select"
              required
              options={[
                { value: "merit", label: "Merit-based" },
                { value: "need_based", label: "Need-based" },
                { value: "sports", label: "Sports" },
                { value: "cultural", label: "Cultural" },
                { value: "minority", label: "Minority" },
                { value: "other", label: "Other" },
              ]}
              {...getFieldProps("scholarshipType")}
            />
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Fixed Amount (₹)"
                name="amount"
                type="number"
                min={1000}
                max={500000}
                placeholder="50000"
                description="Fixed scholarship amount (leave empty if percentage-based)"
                {...getFieldProps("amount")}
              />
              <FormField
                label="Percentage (%)"
                name="percentage"
                type="number"
                min={1}
                max={100}
                placeholder="75"
                description="Percentage of fees covered (leave empty if fixed amount)"
                {...getFieldProps("percentage")}
              />
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Eligibility Criteria</h3>
            <FormField
              label="Eligibility Criteria"
              name="eligibilityCriteria"
              type="textarea"
              required
              placeholder="Minimum CGPA of 8.5, active participation in extracurricular activities, financial need assessment..."
              rows={4}
              description="Detailed eligibility requirements and criteria"
              {...getFieldProps("eligibilityCriteria")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Minimum CGPA"
                name="minCgpa"
                type="number"
                min={0}
                max={10}
                step={0.1}
                placeholder="8.0"
                description="Minimum CGPA requirement (optional)"
                {...getFieldProps("minCgpa")}
              />
              <FormField
                label="Maximum Family Income (₹)"
                name="maxFamilyIncome"
                type="number"
                min={0}
                max={10000000}
                placeholder="500000"
                description="Maximum annual family income (optional)"
                {...getFieldProps("maxFamilyIncome")}
              />
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Application Deadline"
                name="applicationDeadline"
                type="date"
                required
                description="Last date for scholarship applications"
                {...getFieldProps("applicationDeadline")}
              />
              <FormField
                label="Maximum Applicants"
                name="maxApplicants"
                type="number"
                min={1}
                max={1000}
                required
                description="Maximum number of applications accepted"
                {...getFieldProps("maxApplicants")}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Scholarship" : "Create Scholarship"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
