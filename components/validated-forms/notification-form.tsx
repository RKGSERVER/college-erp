"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"
import { notificationSchema } from "@/lib/validation"
import { Bell, Loader2, Users } from "lucide-react"
import type { z } from "zod"

interface NotificationFormProps {
  users: { id: string; name: string; role: string; email: string }[]
  onSubmit: (data: z.infer<typeof notificationSchema>) => Promise<void>
  onCancel: () => void
}

export function NotificationForm({ users, onSubmit, onCancel }: NotificationFormProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [filterRole, setFilterRole] = useState<string>("all")

  const { values, errors, isValid, isSubmitting, handleSubmit, getFieldProps, setValue } = useFormValidation({
    schema: notificationSchema,
    initialValues: {
      type: "info",
      category: "announcement",
      priority: "medium",
      channels: ["in_app"],
      targetUsers: [],
    },
    validateOnChange: true,
    onSubmit: async (data) => {
      await onSubmit({
        ...data,
        targetUsers: selectedUsers,
      })
    },
  })

  const filteredUsers = users.filter((user) => filterRole === "all" || user.role === filterRole)

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const selectAllFiltered = () => {
    const filteredUserIds = filteredUsers.map((user) => user.id)
    setSelectedUsers((prev) => {
      const newSelection = [...new Set([...prev, ...filteredUserIds])]
      return newSelection
    })
  }

  const clearSelection = () => {
    setSelectedUsers([])
  }

  const selectByRole = (role: string) => {
    const roleUserIds = users.filter((user) => user.role === role).map((user) => user.id)
    setSelectedUsers((prev) => {
      const newSelection = [...new Set([...prev, ...roleUserIds])]
      return newSelection
    })
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Send Notification</span>
        </CardTitle>
        <CardDescription>Create and send notifications to selected users across multiple channels</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Content</h3>
            <FormField
              label="Title"
              name="title"
              required
              placeholder="Important Announcement"
              {...getFieldProps("title")}
            />
            <FormField
              label="Message"
              name="message"
              type="textarea"
              required
              placeholder="Enter your notification message here..."
              rows={4}
              {...getFieldProps("message")}
            />
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Type"
                name="type"
                type="select"
                required
                options={[
                  { value: "info", label: "Information" },
                  { value: "success", label: "Success" },
                  { value: "warning", label: "Warning" },
                  { value: "error", label: "Error" },
                ]}
                {...getFieldProps("type")}
              />
              <FormField
                label="Category"
                name="category"
                type="select"
                required
                options={[
                  { value: "system", label: "System" },
                  { value: "academic", label: "Academic" },
                  { value: "financial", label: "Financial" },
                  { value: "attendance", label: "Attendance" },
                  { value: "announcement", label: "Announcement" },
                ]}
                {...getFieldProps("category")}
              />
              <FormField
                label="Priority"
                name="priority"
                type="select"
                required
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "critical", label: "Critical" },
                ]}
                {...getFieldProps("priority")}
              />
            </div>
          </div>

          {/* Delivery Channels */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Channels</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "in_app", label: "In-App" },
                { value: "email", label: "Email" },
                { value: "sms", label: "SMS" },
                { value: "push", label: "Push Notification" },
              ].map((channel) => (
                <FormField
                  key={channel.value}
                  label={channel.label}
                  name={`channel-${channel.value}`}
                  type="checkbox"
                  value={values.channels?.includes(channel.value)}
                  onChange={(checked) => {
                    const currentChannels = values.channels || []
                    const newChannels = checked
                      ? [...currentChannels, channel.value]
                      : currentChannels.filter((c) => c !== channel.value)
                    setValue("channels", newChannels)
                  }}
                />
              ))}
            </div>
          </div>

          {/* Expiration Date */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Settings</h3>
            <FormField
              label="Expiration Date (Optional)"
              name="expiresAt"
              type="date"
              description="Notification will be automatically removed after this date"
              {...getFieldProps("expiresAt")}
            />
          </div>

          {/* User Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Select Recipients ({selectedUsers.length} selected)</span>
              </h3>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
                  Clear All
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={selectAllFiltered}>
                  Select All Filtered
                </Button>
              </div>
            </div>

            {/* Quick Selection by Role */}
            <div className="flex flex-wrap gap-2">
              {["student", "faculty", "admin", "employee", "principal"].map((role) => (
                <Button key={role} type="button" variant="outline" size="sm" onClick={() => selectByRole(role)}>
                  All {role.charAt(0).toUpperCase() + role.slice(1)}s
                </Button>
              ))}
            </div>

            {/* Role Filter */}
            <FormField
              label="Filter by Role"
              name="roleFilter"
              type="select"
              value={filterRole}
              onChange={setFilterRole}
              options={[
                { value: "all", label: "All Roles" },
                { value: "student", label: "Students" },
                { value: "faculty", label: "Faculty" },
                { value: "admin", label: "Administrators" },
                { value: "employee", label: "Employees" },
                { value: "principal", label: "Principal" },
              ]}
            />

            {/* User List */}
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    selectedUsers.includes(user.id) ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => toggleUser(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{user.role}</span>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting || selectedUsers.length === 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notification
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
