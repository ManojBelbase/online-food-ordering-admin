// firebase-messaging-sw.js (place in public folder)

// Log service worker initialization
console.log("Firebase Messaging SW initializing...");

// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

// Initialize Firebase with explicit error handling
try {
  firebase.initializeApp({
  apiKey: "AIzaSyDriyjZ7WkimxoqiJMt0gZ3izRBi9eNmq8",
  authDomain: "food-ordering-6a1bf.firebaseapp.com",
  databaseURL: "https://food-ordering-6a1bf-default-rtdb.firebaseio.com",
  projectId: "food-ordering-6a1bf",
  storageBucket: "food-ordering-6a1bf.firebasestorage.app",
  messagingSenderId: "682475636956",
  appId: "1:682475636956:web:eb9ce9a221edc0309d0c19",
  measurementId: "G-9RX76W58Q4",

  });
  console.log("Firebase initialized in service worker");
} catch (error) {
  console.error("Failed to initialize Firebase in service worker:", error);
}

// Register event listeners for service worker lifecycle
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim()); // Take control of clients immediately
});

// Initialize Firebase Cloud Messaging with error handling
let messaging;
try {
  messaging = firebase.messaging();
} catch (error) {
  console.error("Failed to initialize messaging in service worker:", error);
}

// Handle background messages
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
      body: payload.notification?.body || "",
      // icon: '/firebase-logo.png',
      data: payload.data,
      // badge: '/notification-badge.png',
      vibrate: [200, 100, 200],
      tag: "notification-" + Date.now(),
      requireInteraction: true,
      actions: [
        {
          action: "view",
          title: "View",
          // icon: '/view-icon.png',
        },
        {
          action: "dismiss",
          title: "Dismiss",
          // icon: '/dismiss-icon.png',
        },
      ],
    };

    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });
}

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const action = event.action;

  if (action === "dismiss") {
    // Just close the notification
    return;
  }

  // Handle view action or default click
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        // Check if there's already a window/tab open
        const hadWindowToFocus = clientsArr.some((windowClient) => {
          if (
            windowClient.url.includes(self.location.origin) &&
            "focus" in windowClient
          ) {
            windowClient.focus();

            // Send message to the focused window to handle the notification
            windowClient.postMessage({
              type: "NOTIFICATION_CLICKED",
              data: event.notification.data || {},
              notification: {
                title: event.notification.title,
                body: event.notification.body,
              },
            });

            return true;
          }
          return false;
        });

        // If no window to focus, open new window
        if (!hadWindowToFocus && clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});

// Handle push messages directly (backup for browsers where onBackgroundMessage fails)
self.addEventListener("push", (event) => {
  console.log("Push message received in service worker:", event);

  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();

    const notificationTitle = data.notification?.title || "New Notification";
    const notificationOptions = {
      body: data.notification?.body || "",
      icon: "/firebase-logo.png",
      data: data.data || {},
      badge: "/notification-badge.png",
      vibrate: [200, 100, 200],
      tag: "notification-" + Date.now(),
      requireInteraction: true,
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  } catch (error) {
    console.error("Error processing push message:", error);
  }
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
