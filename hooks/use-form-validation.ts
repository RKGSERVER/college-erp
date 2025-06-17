"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { z } from "zod"

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>
  initialValues: Partial<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  onSubmit?: (data: T) => void | Promise<void>
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues,
  validateOnChange = false,
  validateOnBlur = false,
  onSubmit,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<Partial<T>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValid, setIsValid] = useState(false)

  // Validate form
  const validateForm = useCallback(
    (data: Partial<T>) => {
      try {
        schema.parse(data)
        setErrors({})
        setIsValid(true)
        return true
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
          setErrors(fieldErrors)
          setIsValid(false)
          return false
        }
        setIsValid(false)
        return false
      }
    },
    [schema],
  )

  // Validate field
  const validateField = useCallback(
    (name: string, value: any) => {
      try {
        const fieldSchema = schema.shape?.[name]
        if (fieldSchema) {
          fieldSchema.parse(value)
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[name]
            return newErrors
          })
          return true
        }
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [name]: error.errors.map((err) => err.message),
          }))
          return false
        }
        return false
      }
    },
    [schema],
  )

  // Set field value
  const setValue = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))

      if (validateOnChange) {
        validateField(name, value)
      }
    },
    [validateOnChange, validateField],
  )

  // Handle field change
  const handleChange = useCallback(
    (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setValue(name, value)
    },
    [setValue],
  )

  // Handle field blur
  const handleBlur = useCallback(
    (name: string) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }))

      if (validateOnBlur) {
        validateField(name, values[name])
      }
    },
    [validateOnBlur, validateField, values],
  )

  // Get field props
  const getFieldProps = useCallback(
    (name: string) => ({
      value: values[name] || "",
      onChange: handleChange(name),
      onBlur: handleBlur(name),
      error: touched[name] ? errors[name] : undefined,
    }),
    [values, handleChange, handleBlur, touched, errors],
  )

  // Handle form submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setIsSubmitting(true)

      // Mark all fields as touched
      const allFields = Object.keys(schema.shape || {})
      const touchedFields = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      setTouched(touchedFields)

      const isFormValid = validateForm(values)

      if (isFormValid && onSubmit) {
        try {
          await onSubmit(values as T)
        } catch (error) {
          console.error("Form submission error:", error)
        }
      }

      setIsSubmitting(false)
    },
    [values, validateForm, onSubmit, schema],
  )

  // Update validation when values change
  useEffect(() => {
    if (Object.keys(values).length > 0) {
      validateForm(values)
    }
  }, [values, validateForm])

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    handleChange,
    handleBlur,
    getFieldProps,
    handleSubmit,
    validateForm,
    validateField,
  }
}
