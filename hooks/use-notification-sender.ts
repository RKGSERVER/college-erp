"use client"

import { useCallback } from "react"

interface NotificationPayload {
  type: "critical" | "warning" | "info" | "success"
  category: "security" | "profile" | "system" | "audit" | "payment"
  title: string
  message: string
  userId: string
  userName: string
  targetUserId?: string
  targetUserName?: string
  action: string
  severity: "low" | "medium" | "high" | "critical"
  channels?: ("in_app" | "email" | "sms" | "push")[]
  metadata?: Record<string, any>
  actionRequired?: boolean
  relatedAuditId?: string
}

export function useNotificationSender() {
  const sendNotification = useCallback(async (payload: NotificationPayload) => {
    try {
      const notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false,
        acknowledged: false,
        channels: payload.channels || ["in_app"],
        actionRequired: payload.actionRequired || false,
        ...payload,
      }

      // Send to notification service
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      })

      if (!response.ok) {
        throw new Error("Failed to send notification")
      }

      console.log("Notification sent:", notification)
      return notification
    } catch (error) {
      console.error("Error sending notification:", error)
      throw error
    }
  }, [])

  const sendSecurityAlert = useCallback(
    (
      title: string,
      message: string,
      userId: string,
      userName: string,
      action: string,
      metadata?: Record<string, any>,
    ) => {
      return sendNotification({
        type: "critical",
        category: "security",
        title,
        message,
        userId,
        userName,
        action,
        severity: "critical",
        channels: ["in_app", "email", "sms"],
        actionRequired: true,
        metadata,
      })
    },
    [sendNotification],
  )

  const sendProfileChangeAlert = useCallback(
    (
      title: string,
      message: string,
      userId: string,
      userName: string,
      targetUserId: string,
      targetUserName: string,
      action: string,
      severity: "low" | "medium" | "high" | "critical" = "medium",
      metadata?: Record<string, any>,
    ) => {
      return sendNotification({
        type: severity === "critical" ? "critical" : "warning",
        category: "profile",
        title,
        message,
        userId,
        userName,
        targetUserId,
        targetUserName,
        action,
        severity,
        channels: severity === "critical" ? ["in_app", "email"] : ["in_app"],
        metadata,
      })
    },
    [sendNotification],
  )

  const sendSystemAlert = useCallback(
    (
      title: string,
      message: string,
      action: string,
      severity: "low" | "medium" | "high" | "critical" = "medium",
      metadata?: Record<string, any>,
    ) => {
      return sendNotification({
        type: severity === "critical" ? "critical" : "info",
        category: "system",
        title,
        message,
        userId: "system",
        userName: "System",
        action,
        severity,
        channels: ["in_app", "email"],
        metadata,
      })
    },
    [sendNotification],
  )

  const sendBulkOperationAlert = useCallback(
    (
      title: string,
      message: string,
      userId: string,
      userName: string,
      action: string,
      affectedCount: number,
      metadata?: Record<string, any>,
    ) => {
      const severity = affectedCount > 100 ? "high" : affectedCount > 50 ? "medium" : "low"

      return sendNotification({
        type: "warning",
        category: "audit",
        title,
        message,
        userId,
        userName,
        action,
        severity,
        channels: ["in_app", "email"],
        metadata: {
          ...metadata,
          affectedCount,
          bulkOperation: true,
        },
      })
    },
    [sendNotification],
  )

  return {
    sendNotification,
    sendSecurityAlert,
    sendProfileChangeAlert,
    sendSystemAlert,
    sendBulkOperationAlert,
  }
}
