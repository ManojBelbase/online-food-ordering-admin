import { useMemo } from "react";
import DataTable from "../../../components/GlobalComponents/Table/DataTable";
import { orderApi } from "../../../server-action/api/orders"
import { PageHeader } from "../../../components/GlobalComponents";

const NewOrderPageIndex = () => {
  const {data:newOrder}= orderApi.useGetAll();
  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: "Order ID", key: "orderId" },
        { title: "Customer Name", key: "customerName" },
        { title: "Restaurant Name", key: "restaurantName" },
        { title: "Order Status", key: "orderStatus" },
        { title: "Payment Status", key: "paymentStatus" },
        { title: "Total Amount", key: "totalAmount" },
        { title: "Order Date", key: "orderDate" },
      ],
      rows: (newOrder as any)?.orders?.map((order: any, index: number) => ({
        sn: index + 1,  
        orderId: order._id,
        customerName: order.userId.name,
        restaurantName: order.restaurantId.restaurantName,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        orderDate: order.createdAt,
      })) || [],
    };
  }, [newOrder]); 

  return (
    <div>
      <PageHeader
        title="New Orders"
        actionVariant="outline"
      />
      <DataTable columns={tableData.columns} data={tableData.rows} />
    </div>
  )
}

export default NewOrderPageIndex