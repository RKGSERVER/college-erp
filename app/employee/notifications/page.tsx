import { NotificationSystem } from "@/components/notification-system"

export default function EmployeeNotificationsPage() {
  return (
    <div className="container mx-auto p-6">
      <NotificationSystem userRole="employee" userId="EMP001" />
    </div>
  )
}
