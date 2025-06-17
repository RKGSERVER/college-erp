import { NotificationSystem } from "@/components/notification-system"

export default function PrincipalNotificationsPage() {
  return (
    <div className="container mx-auto p-6">
      <NotificationSystem userRole="principal" userId="principal_001" />
    </div>
  )
}
