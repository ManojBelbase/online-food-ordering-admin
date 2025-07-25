import { useMemo } from "react";
import { PageHeader, StatusBadge } from "../../components/GlobalComponents";
import { restaurantApi } from "../../server-action/api/restaurant";
import DataTable from "../../components/GlobalComponents/Table/DataTable";

const RestaurantPageIndex = () => {
  const { data } = restaurantApi.useGetAll();
  
  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: "Restaurant Name", key: "restaurantName" },
        { title: "Cuisine Type", key: "cuisineType" },
        { title: "Address", key: "address" },
        { title: "Status", key: "status" },
      ],
      rows: (data as any)?.restaurant?.map((restaurant: any, index: number) => ({
        sn: index + 1,
        restaurantName: restaurant.restaurantName,
        cuisineType: restaurant.cuisineType,
        address: restaurant.address,
        status: (
          <StatusBadge
            status={restaurant.manualOverride.isOpen ? "Open" : "Closed"}
          />
        ),
      })) || [],
    };
  }, [data]);

  return (
    <div>
      <PageHeader
        title="Restaurants"
        actionVariant="outline"
      />
      <DataTable
        data={tableData.rows}
        columns={tableData.columns}
        searchPlaceholder="Search restaurants..."
      />
      
    </div>
  );
};

export default RestaurantPageIndex;