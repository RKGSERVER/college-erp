"use client"

import { ChangeRequestManager } from "@/components/admin/change-request-manager"

export default function ChangeRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <ChangeRequestManager />
      </div>
    </div>
  )
}
