import { NotificationSystem } from "@/components/notification-system"

export default function AdminNotificationsPage() {
  return (
    <div className="container mx-auto p-6">
      <NotificationSystem userRole="admin" userId="admin_001" />
    </div>
  )
}
