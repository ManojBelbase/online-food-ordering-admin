import { useMemo, useState } from 'react';
import { PageHeader, TableActions } from '../../components/GlobalComponents';
import { foodItemApi, type IFoodItem } from '../../server-action/api/food-item';
import DataTable from '../../components/GlobalComponents/Table/DataTable';
import { Modal } from '@mantine/core';
import FoodItemForm from './Components/FoodItemForm';
import { foodItemsFilter } from './Components/FoodItemFilter';
import { onDelete, onEdit } from '../../components/GlobalComponents/TableActions';

const FoodItemPageIndex = () => {
  const { data } = foodItemApi.useGetAll();
  const { mutateAsync: deleteFoodItem } = foodItemApi.useDelete();
  const [modalState, setModalState] = useState<{ mode: string; data?: IFoodItem } | null>(null);

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: 'Food Item Name', key: 'name' },
        { title: 'Image', key: 'image' },
        { title: 'Cuisine Type', key: 'cuisineType' },
        { title: 'Price', key: 'price' },
        { title: 'Vegetarian', key: 'isVeg' },
        { title: 'Tags', key: 'tags' },
        { title: 'Action', key: 'action' },
      ],
      rows: (data as any)?.foodItems?.map((item: IFoodItem, index: number) => {
        return {
          sn: index + 1,
          name: item.name || 'N/A',
          image: item.image || 'N/A',
          cuisineType: item.cuisineType || 'N/A',
          price: item.price ? `$${item.price.toFixed(2)}` : 'N/A',
          tags: item.tags.join(', '),
          isVeg: item.isVeg ? 'Yes' : 'No',
          action: <TableActions actions={[
            onEdit(() => setModalState({ mode: 'edit', data: item })),
            onDelete(deleteFoodItem, item.name, item._id),
          ]} />,
        };
      }) || [],
    };
  }, [data]);

  return (
    <div>
      <PageHeader
        title="Food Items"
        onClick={() => setModalState({ mode: 'create' })}
        actionVariant="outline"
      />
      <DataTable
        columns={tableData.columns}
        data={tableData.rows}
        showPrintButton={true}
        printTitle='Food Item Report'
        printShowTitle={true}
        printShowRecordCount={false}
        printExcludeColumns={['action' ,'image']}
        filters={foodItemsFilter || []}
      />
      <Modal
        opened={modalState?.mode === 'create' || modalState?.mode === 'edit'}
        onClose={() => setModalState(null)}
        title={modalState?.mode === 'create' ? 'Create Food Item' : 'Edit Food Item'}
        size="xl"
      >
        <FoodItemForm
          edit={modalState?.mode === 'edit' ? modalState.data : undefined}
          onClose={() => setModalState(null)}
        />
      </Modal>

    </div>
  );
};

export default FoodItemPageIndex;