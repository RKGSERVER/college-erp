"use client"

import { ProfileManagement } from "./profile-management"
import { useNotificationSender } from "@/hooks/use-notification-sender"
import { useAuditLogger } from "@/hooks/use-audit-logger"

interface EnhancedProfileManagementProps {
  userRole: string
  userId?: string
  isAdminView?: boolean
}

export function EnhancedProfileManagement({ userRole, userId, isAdminView = false }: EnhancedProfileManagementProps) {
  const { sendProfileChangeAlert, sendSecurityAlert } = useNotificationSender()
  const { logProfileUpdate, logPermissionUpdate, logStatusUpdate } = useAuditLogger()

  // Enhanced profile update handler with notifications
  const handleProfileUpdate = async (
    field: string,
    oldValue: string,
    newValue: string,
    targetUserId: string,
    targetUserName: string,
    currentUserId: string,
    currentUserName: string,
    currentUserRole: string,
  ) => {
    try {
      // Log the change in audit trail
      logProfileUpdate(
        currentUserId,
        currentUserName,
        currentUserRole,
        targetUserId,
        targetUserName,
        field,
        oldValue,
        newValue,
      )

      // Determine notification severity based on field and user role
      let severity: "low" | "medium" | "high" | "critical" = "low"
      let shouldNotify = false

      // Critical fields that require immediate notification
      const criticalFields = ["email", "role", "status", "permissions"]
      const sensitiveFields = ["phone", "address", "emergency_contact"]

      if (criticalFields.includes(field)) {
        severity = "critical"
        shouldNotify = true
      } else if (sensitiveFields.includes(field)) {
        severity = "medium"
        shouldNotify = currentUserId !== targetUserId // Only notify if admin is changing someone else's profile
      }

      // Send notification if required
      if (shouldNotify) {
        await sendProfileChangeAlert(
          `Profile Updated: ${field}`,
          `${field} changed from "${oldValue}" to "${newValue}" for ${targetUserName}`,
          currentUserId,
          currentUserName,
          targetUserId,
          targetUserName,
          "profile_update",
          severity,
          {
            field,
            oldValue,
            newValue,
            adminUpdate: currentUserId !== targetUserId,
            timestamp: new Date().toISOString(),
          },
        )
      }

      // Special handling for security-related changes
      if (field === "role" || field === "permissions") {
        await sendSecurityAlert(
          "Security Update",
          `User ${targetUserName} ${field} updated by ${currentUserName}`,
          currentUserId,
          currentUserName,
          "security_update",
          {
            field,
            targetUser: targetUserName,
            securityLevel: "high",
            requiresReview: true,
          },
        )
      }
    } catch (error) {
      console.error("Error handling profile update:", error)
    }
  }

  return (
    <ProfileManagement
      userRole={userRole}
      userId={userId}
      isAdminView={isAdminView}
      onProfileUpdate={handleProfileUpdate}
    />
  )
}
