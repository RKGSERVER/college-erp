import { NotificationSystem } from "@/components/notification-system"

export default function StudentNotificationsPage() {
  return (
    <div className="container mx-auto p-6">
      <NotificationSystem userRole="student" userId="STU001" />
    </div>
  )
}
