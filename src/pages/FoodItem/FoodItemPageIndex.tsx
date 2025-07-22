import { useMemo, useState } from 'react';
import { PageHeader, TableActions } from '../../components/GlobalComponents';
import { foodItemApi, type IFoodItem } from '../../server-action/api/food-item';
import DataTable from '../../components/GlobalComponents/Table/DataTable';
import { createDeleteAction, createEditAction } from '../../components/GlobalComponents/TableActions';
import DeleteModal from '../../components/GlobalComponents/DeleteModal';
import { Modal } from '@mantine/core';
import FoodItemForm from './Components/FoodItemForm';

const FoodItemPageIndex = () => {
  const { data } = foodItemApi.useGetAll();
  const { mutateAsync: deleteFoodItem } = foodItemApi.useDelete();
  const [modalState, setModalState] = useState<{ mode: string; data?: IFoodItem } | null>(null);

  const handleDeleteFoodItem = async (id: string) => {
    await deleteFoodItem(id);
    setModalState(null);
  };

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: 'Food Item Name', key: 'name' },
        { title: 'Image', key: 'image' },
        { title: 'Cuisine Type', key: 'cuisineType' },
        { title: 'Price', key: 'price' },
        { title: 'Vegetarian', key: 'isVeg' },
        { title: 'Action', key: 'action' },
      ],
      rows: (data as any)?.foodItems?.map((item: IFoodItem, index: number) => {
        const actions = [
          createEditAction(() => setModalState({ mode: 'edit', data: item })),
          createDeleteAction(() => setModalState({ mode: 'delete', data: item })),
        ];

        return {
          sn: index + 1,
          name: item.name || 'N/A',
          image: item.image || 'N/A',
          cuisineType: item.cuisineType || 'N/A',
          price: item.price ? `$${item.price.toFixed(2)}` : 'N/A',
          isVeg: item.isVeg ? 'Yes' : 'No',
          action: <TableActions actions={actions} />,
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
      <DataTable columns={tableData.columns} data={tableData.rows} />

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

      <DeleteModal
        opened={modalState?.mode === 'delete'}
        itemName={modalState?.data?.name || ''}
        onClose={() => setModalState(null)}
        onConfirm={() => modalState?.data?._id && handleDeleteFoodItem(modalState.data._id)}
      />
    </div>
  );
};

export default FoodItemPageIndex;