import OrderNotificationListener from "../Notification/Components/OrderNotificationListener";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin header/nav */}
      <OrderNotificationListener />  {/* 👈 inject listener */}
      <main className="flex-1">{children}</main>
      {/* Admin footer */}
    </div>
  );
}
