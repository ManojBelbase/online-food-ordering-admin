import { useMemo, useState } from "react";
import DataTable from "../../components/GlobalComponents/Table/DataTable";
import { orderApi, updateOrderStatus } from "../../server-action/api/orders"
import { DateFormatter, PageHeader, TableActions } from "../../components/GlobalComponents";
import {  onStatusChange, onView } from "../../components/GlobalComponents/TableActions";
import { useQueryClient } from "@tanstack/react-query";
import StatusChangeModal from "../../components/GlobalComponents/StatusChangeModal";
import { useNavigate } from "react-router-dom";
import { OrderFilter } from "./Components/orderFilter";

const OrderPageIndex = () => {
  const navigate = useNavigate()
  const {data:newOrder}= orderApi.useGetAll();
  const [statusModalState, setStatusModalState] = useState<{ opened: boolean; orderId: string; currentStatus: string } | null>(null);
  const queryClient = useQueryClient();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
    queryClient.invalidateQueries({ queryKey: ['order/restaurant'] });
  };
  
  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: "Customer Name", key: "customerName" },
        { title: "Order Status", key: "orderStatus" },
        { title: "Total Amount", key: "totalAmount" },
        { title: "Payment Status", key: "paymentStatus" },
        { title: "Payment Method", key: "paymentMethod" },
        { title: "Order Date", key: "orderDate" },
        {title:"Action", key:"action"
        }
      ],
      rows: (newOrder as any)?.data?.map((order: any, index: number) => ({
        sn: index + 1,  
        customerName: order.userId.name,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod:order?.paymentMethod,
        totalAmount: `Rs. ${order.totalAmount}`,
        orderDate: <DateFormatter date={order.createdAt} format="iso"/>,
        action:     ( <TableActions
              actions={[
                onView(()=>{navigate(`/order/order-details/${order._id}`)}),
                onStatusChange(() => setStatusModalState({
                  opened: true,
                  orderId: order._id,
                  currentStatus: order.orderStatus
                })),
              ]}
            />
          ),
      })) || [],
    };
  }, [newOrder]); 

  return (
    <div>
      <PageHeader
        title="New Orders"
        actionVariant="outline"
      />
      <DataTable columns={tableData.columns} data={tableData.rows}  filters={OrderFilter}   showPrintButton printExcludeColumns={["action"]} printShowTitle={true} printTitle="Order Report"/>

      <StatusChangeModal
        opened={statusModalState?.opened || false}
        currentStatus={statusModalState?.currentStatus || ''}
        orderId={statusModalState?.orderId || ''}
        onClose={() => setStatusModalState(null)}
        onStatusChange={handleStatusChange}
        
      />
    </div>
  )
}

export default OrderPageIndex