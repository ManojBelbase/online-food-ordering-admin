import { useMemo } from "react";
import DataTable from "../../../components/GlobalComponents/Table/DataTable";
import { orderApi } from "../../../server-action/api/orders"
import { DateFormatter, PageHeader } from "../../../components/GlobalComponents";

const NewOrderPageIndex = () => {
  const {data:newOrder}= orderApi.useGetAll();
  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: "Customer Name", key: "customerName" },
        { title: "Order Status", key: "orderStatus" },
        { title: "Total Amount", key: "totalAmount" },
        { title: "Payment Status", key: "paymentStatus" },
        { title: "Order Date", key: "orderDate" },

      ],
      rows: (newOrder as any)?.data?.map((order: any, index: number) => ({
        sn: index + 1,  
        customerName: order.userId.name,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        totalAmount: `Rs. ${order.totalAmount}`,
        orderDate: <DateFormatter date={order.createdAt} format="iso"/>,
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