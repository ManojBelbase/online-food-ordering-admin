import { useMemo, useState } from 'react';
import { PageHeader, TableActions } from '../../components/GlobalComponents';
import { foodItemApi, type IFoodItem } from '../../server-action/api/food-item';
import DataTable from '../../components/GlobalComponents/Table/DataTable';
import { onEdit } from '../../components/GlobalComponents/TableActions';
import { Modal } from '@mantine/core';
import FoodItemForm from './Components/FoodItemForm';
import { foodItemsFilter } from './Components/FoodItemFilter';
import { createDeleteHandler } from '../../utils/globalDeleteHandler';
import { onDelete } from '../../utils/createDeleteAction';

const FoodItemPageIndex = () => {
  const { data } = foodItemApi.useGetAll();
  const { mutateAsync: deleteFoodItem } = foodItemApi.useDelete();
  const [modalState, setModalState] = useState<{ mode: string; data?: IFoodItem } | null>(null);
  const handleDeleteFoodItem = createDeleteHandler(deleteFoodItem, setModalState);
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
            onDelete(handleDeleteFoodItem, item.name, item._id),
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