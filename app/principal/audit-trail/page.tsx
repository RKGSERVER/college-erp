"use client"

import { AuditTrail } from "@/components/audit-trail"

export default function PrincipalAuditTrailPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <AuditTrail userRole="principal" userId="PRIN001" showAllUsers={true} />
      </div>
    </div>
  )
}
