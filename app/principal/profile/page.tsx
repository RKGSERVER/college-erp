"use client"

import { ProfileManagement } from "@/components/profile-management"

export default function PrincipalProfile() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and dashboard settings</p>
        </div>
        <ProfileManagement userRole="principal" />
      </div>
    </div>
  )
}
