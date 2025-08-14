import type { FilterConfig } from "../../../../components/GlobalComponents/Table/TableFilter";

export const orderFilter: FilterConfig[]=[
    {
        key: "orderStatus",
        label: "Order Status",
        options: [
            { label: "All", value: "" },
            { label: "Pending", value: "pending" },
            {
                label: "Accepted", value: "accepted"
            },
            {
                label: "Preparing", value: "preparing"
            },
            {
                label: "Ready", value: "ready"
            },
            {
                label: "Cancelled", value: "cancelled"
            },
            {
                label: "Completed",
                value: "completed"
            }
        ],
        type: "select"
    }
]