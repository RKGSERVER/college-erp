"use client"

import { AuditTrail } from "@/components/audit-trail"

export default function AdminAuditTrailPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <AuditTrail userRole="admin" showAllUsers={true} />
      </div>
    </div>
  )
}
