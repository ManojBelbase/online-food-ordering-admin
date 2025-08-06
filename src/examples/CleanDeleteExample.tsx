/**
 * CLEAN DELETE APPROACH - No separate DeleteModal needed!
 */

import { useState } from 'react';
import { onEdit } from '../components/GlobalComponents/TableActions';
import { createDeleteHandler } from '../utils/globalDeleteHandler';
import { onDelete } from '../utils/createDeleteAction';

const CleanDeleteExample = () => {
  const [modalState, setModalState] = useState<any>(null);
  
  // Your API hooks
  // const { data } = yourApi.useGetAll();
  // const { mutateAsync: deleteItem } = yourApi.useDelete();
  
  // Global delete handler
  // const handleDeleteItem = createDeleteHandler(deleteItem, setModalState);

  const tableData = {
    columns: [
      { title: 'Name', key: 'name' },
      { title: 'Action', key: 'action' },
    ],
    rows: [
      // Your data mapping
      // data?.map((item, index) => {
      //   const actions = [
      //     onEdit(() => setModalState({ mode: 'edit', data: item })),
      //     onDelete(handleDeleteItem, item.name, item._id),
      //   ];
      //   
      //   return {
      //     name: item.name,
      //     action: <TableActions actions={actions} />,
      //   };
      // })
    ]
  };

  return (
    <div>
      {/* DataTable - No DeleteModal needed! */}
      {/* 
      <DataTable
        columns={tableData.columns}
        data={tableData.rows}
        filters={yourFilters}
      />
      */}

      {/* Only Edit Modal needed */}
      {/* 
      <Modal
        opened={modalState?.mode === 'edit'}
        onClose={() => setModalState(null)}
        title="Edit Item"
      >
        <YourEditForm
          edit={modalState?.data}
          onClose={() => setModalState(null)}
        />
      </Modal>
      */}
    </div>
  );
};

export default CleanDeleteExample;

/**
 * BENEFITS OF THIS APPROACH:
 * 
 * ✅ NO DeleteModal component needed
 * ✅ NO delete modal state management
 * ✅ NO separate delete confirmation JSX
 * ✅ Delete happens directly in table actions
 * ✅ Built-in confirmation dialog
 * ✅ Much cleaner code
 * 
 * USAGE:
 * 1. Import: onDelete
 * 2. Create: handleDelete = createDeleteHandler(deleteFunction, setModalState)
 * 3. Use: onDelete(handleDelete, itemName, itemId)
 * 
 * That's it! No modal needed.
 */
