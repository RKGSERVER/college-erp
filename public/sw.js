// Service Worker for Push Notifications
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(self.clients.claim())
})

self.addEventListener("push", (event) => {
  if (event.data) {
    const notification = event.data.json()

    const options = {
      body: notification.message,
      icon: "/notification-icon.png",
      badge: "/notification-badge.png",
      tag: notification.id,
      data: notification,
      actions: [
        {
          action: "view",
          title: "View Details",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
      requireInteraction: notification.severity === "critical",
    }

    event.waitUntil(self.registration.showNotification(notification.title, options))
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(self.clients.openWindow(`/notifications/${event.notification.data.id}`))
  }
})

self.addEventListener("notificationclose", (event) => {
  // Track notification dismissal
  console.log("Notification dismissed:", event.notification.data.id)
})
