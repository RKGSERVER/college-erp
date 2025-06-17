"use client"

import { AuditTrail } from "@/components/audit-trail"

export default function FacultyAuditTrailPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <AuditTrail userRole="faculty" userId="FAC001" showAllUsers={false} />
      </div>
    </div>
  )
}
