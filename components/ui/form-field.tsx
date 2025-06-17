import type React from "react"
import { forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string[]
  helperText?: string
  textarea?: boolean
  rows?: number
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, name, error, helperText, textarea = false, rows = 3, className, ...props }, ref) => {
    const hasError = error && error.length > 0

    return (
      <div className="space-y-2">
        <Label htmlFor={name} className={cn("text-sm font-medium", hasError && "text-red-600")}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {textarea ? (
          <Textarea
            id={name}
            name={name}
            rows={rows}
            className={cn("w-full", hasError && "border-red-500 focus:border-red-500 focus:ring-red-500", className)}
            {...(props as any)}
            ref={ref as any}
          />
        ) : (
          <Input
            id={name}
            name={name}
            className={cn("w-full", hasError && "border-red-500 focus:border-red-500 focus:ring-red-500", className)}
            {...props}
            ref={ref as any}
          />
        )}

        {hasError && (
          <div className="text-sm text-red-600 space-y-1">
            {error.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}

        {helperText && !hasError && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  },
)

FormField.displayName = "FormField"
