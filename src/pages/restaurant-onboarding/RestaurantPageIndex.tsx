import { useMemo } from "react";
import { PageHeader } from "../../components/GlobalComponents";
import { restaurantApi } from "../../server-action/api/restaurant";
import DataTable from "../../components/GlobalComponents/Table/DataTable";

const RestaurantPageIndex = () => {
  const { data } = restaurantApi.useGetAll();

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: "Restaurant Name", key: "restaurantName" },
        { title: "Logo", key: "logo" },
        { title: "Cuisine Type", key: "cuisineType" },
        { title: "Address", key: "address" },
        { title: "License Number", key: "licenseNumber" },
      ],
      rows: (data as any)?.restaurant?.map((restaurant: any, index: number) => ({
        sn: index + 1,
        restaurantName: restaurant.restaurantName || "N/A",
        cuisineType: restaurant.cuisineType || "N/A",
        address: restaurant.address || "N/A",
        licenseNumber: restaurant.licenseNumber || "N/A",
        logo: restaurant.logo,
      
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
        showPrintButton={true}
        printTitle="Restaurant List Report"
        printShowTitle={true}
        printShowRecordCount={false}
        printExcludeColumns={['action', 'logo']}
    

      />

    </div>
  );
};

export default RestaurantPageIndex;