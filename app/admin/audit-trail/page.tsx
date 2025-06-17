"use client"

import { AuditTrail } from "@/components/audit-trail"

export const metadata = {
  title: "Admin | Audit Trail",
  description: "View the full audit trail of user activities",
}

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export default function AdminAuditTrailPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <AuditTrail userRole="admin" showAllUsers={true} />
      </div>
    </div>
  )
}
