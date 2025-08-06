import { useMemo, useState } from "react";
import { PageHeader, TableActions } from "../../components/GlobalComponents";
import { categoryApi, type ICategory } from "../../server-action/api/category";
import DataTable from "../../components/GlobalComponents/Table/DataTable";
import { onDelete, onEdit } from "../../components/GlobalComponents/TableActions";
import CategoryForm from "./Components/CategoryForm";
import { Modal } from "@mantine/core";

const CategoryPageIndex = () => {
  const { data } = categoryApi.useGetAll();
  
  const { mutateAsync: deleteCategory } = categoryApi.useDelete();
  const [modalState, setModalState] = useState<{ mode: string; data?: ICategory } | null>(null);


  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Category Name", key: "name" },
        { title: "Image", key: "image" },
        { title: "Global Category", key: "globalCategory" },
        { title: "Action", key: "action" },
      ],
      rows: (data as any)?.category?.map((item: ICategory, index: number) => {
    

        return {
          sn: index + 1,
          name: item.name || "N/A",
          image: item.image || "N/A",
          globalCategory: item.globalCategoryId,
          action: <TableActions actions={[
            onEdit(() => setModalState({ mode: "edit", data: item })),
            onDelete(deleteCategory, item.name, item._id || ''),
          ]} />,
        };
      }) || [],
 
    };
  }, [data]);

  return (
    <div>
      <PageHeader
        title=" Category"
        onClick={() => setModalState({ mode: "create" })}
        actionVariant="outline"
      />
      <DataTable columns={tableData.columns} data={tableData.rows} />

      <Modal
        opened={modalState?.mode === "create" || modalState?.mode === "edit"}
        onClose={() => setModalState(null)}
        title={modalState?.mode === "create" ? "Create Category" : "Edit Category"}
        size="xl"
      >
        <CategoryForm
          edit={modalState?.mode === "edit" ? modalState.data : undefined}
          onClose={() => setModalState(null)}
        />
      </Modal>

      
    </div>
  );
};

export default CategoryPageIndex;