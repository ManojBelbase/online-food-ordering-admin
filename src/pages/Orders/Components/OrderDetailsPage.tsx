import { useParams, useNavigate } from "react-router-dom";
import { orderApi, type IOrder, type IOrderItem } from "../../../server-action/api/orders";
import { useTheme } from "../../../contexts/ThemeContext";
import { DateFormatter } from "../../../components/GlobalComponents/DateFormatter";
import StatusBadge from "../../../components/GlobalComponents/StatusBadge";
import { IconArrowLeft, IconShoppingCart, IconUser, IconMapPin, IconCreditCard } from "@tabler/icons-react";
import type { CSSProperties, JSX } from "react";

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { theme, themeName } = useTheme();
  const navigate = useNavigate();

  const { data } = orderApi.useGetById(id || "") as { data?: IOrder };
  const order = (data as any)?.data;

  const baseCard: CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 9,
    marginBottom: 10,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`
  };

  const InfoSection = ({ title, icon, rows }: { title: string; icon: JSX.Element; rows: { label: string; value: any }[] }) => (
    <div style={baseCard}>
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6, color: theme.colors.textPrimary, display: "flex", alignItems: "center", gap: 4 }}>
        {icon} {title}
      </h2>
      {rows.map(({ label, value }, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${theme.colors.borderLight}` }}>
          <span style={{ fontWeight: 400, color: theme.colors.textSecondary }}>{label}</span>
          <span style={{ fontWeight: 400, color: theme.colors.textPrimary }}>{value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: 2, backgroundColor: theme.colors.background, minHeight: "90vh", color: theme.colors.textPrimary }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10, padding: "10px 0", borderBottom: `1px solid ${theme.colors.border}` }}>
        <button style={{ background: "none", border: "none", color: theme.colors.primary, cursor: "pointer", display: "flex", alignItems: "center", fontSize: 16, marginRight: 16 }} onClick={() => navigate("/orders")}>
          <IconArrowLeft size={20} style={{ marginRight: 8 }} /> Back
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 400, margin: 0 }}>Order Details</h1>
      </div>

      {/* Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 6 }}>
        <InfoSection
          title="Customer Information"
          icon={<IconUser size={18} />}
          rows={[
            { label: "Name", value: order?.userId?.name || "N/A" },
            { label: "Email", value: order?.userId?.email || "N/A" },
            { label: "Order Status", value: <StatusBadge status={order?.orderStatus} type="order" /> },
            { label: "Order Date", value: <DateFormatter date={order?.createdAt} format="datetime" /> }
          ]}
        />
        <InfoSection
          title="Delivery Information"
          icon={<IconMapPin size={18} />}
          rows={[
            { label: "Address", value: order?.deliveryAddress || "N/A" },
            { label: "Contact Phone", value: order?.contactPhone || "N/A" }
          ]}
        />
        <InfoSection
          title="Payment Information"
          icon={<IconCreditCard size={18} />}
          rows={[
            { label: "Payment Method", value: order?.paymentMethod || "N/A" },
            { label: "Payment Status", value: <StatusBadge status={order?.paymentStatus} type="payment" /> },
            { label: "Transaction ID", value: order?.paymentTransactionId || "N/A" }
          ]}
        />
      </div>

      {/* Items */}
      <div style={baseCard}>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <IconShoppingCart size={20} /> Order Items
        </h2>
        <div style={{ marginTop: 10 }}>
          {order?.items?.length ? (
            order.items.map((item: IOrderItem, i: string) => (
              <div key={i} style={{
                display: "flex",
                padding: 10,
                marginBottom: 16,
                backgroundColor: themeName === "dark" ? theme.colors.backgroundSecondary : theme.colors.surfaceHover,
                borderRadius: 8,
                border: `1px solid ${theme.colors.border}`
              }}>
                {item.image && (
                  <img src={item.image || "/fallback-image.png"} alt={item.name} style={{ width: 80, height: 80, borderRadius: 6, objectFit: "cover", marginRight: 16 }}
                    onError={e => (e.currentTarget.src = "/fallback-image.png")} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px 0" }}>{item.name}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span>Quantity: {item.quantity}</span>
                    <span>Rs.{item.priceAtTime} each</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span>Total: Rs.{item.quantity * item.priceAtTime}</span>
                    <span>{item.isVeg ? "Vegetarian" : "Non-Vegetarian"}</span>
                  </div>
                  {item.notes && <div style={{ fontSize: 14, fontStyle: "italic", marginTop: 8 }}>Notes: {item.notes}</div>}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: theme.colors.textSecondary }}>No items in this order.</div>
          )}
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 0", borderTop: `2px solid ${theme.colors.border}` }}>
          <span style={{ fontSize: 18, fontWeight: 600, marginRight: 16 }}>Total Amount:</span>
          Rs. {order?.totalAmount}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
