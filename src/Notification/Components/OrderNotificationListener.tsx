import { useEffect, useRef } from "react";
import { ref, onChildAdded } from "firebase/database";
import { notifications } from "@mantine/notifications";
import { database } from "../../config/FirebaseConfig";

export default function OrderNotificationListener() {
  const notifiedOrdersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const ordersRef = ref(database, "orders");

    const unsubscribe = onChildAdded(ordersRef, (snapshot) => {
      const orderId = snapshot.key!;
      const order = snapshot.val();

      if (!order) return;

      // ✅ Only notify once per order
      if (!notifiedOrdersRef.current.has(orderId)) {
        notifiedOrdersRef.current.add(orderId);

        // 🔔 Mantine notification
        notifications.show({
          id: orderId,
          title: `🛒 New Order #${orderId.slice(-6)}`,
          message: `Customer: ${order.userName || "Unknown"} | Status: ${order.status || order.orderStatus || "pending"}`,
          color: "green",
          autoClose: 8000,
          onClick: () => {
            window.location.href = "/admin/orders"; // ✅ route to your admin orders page
          },
        });

        // 🔊 Play sound
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
