import { NotificationSystem } from "@/components/notification-system"

export default function FacultyNotificationsPage() {
  return (
    <div className="container mx-auto p-6">
      <NotificationSystem userRole="faculty" userId="FAC001" />
    </div>
  )
}
