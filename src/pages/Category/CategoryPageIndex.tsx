import { useMemo, useState } from "react";
import { PageHeader, TableActions } from "../../components/GlobalComponents";
import { categoryApi, type ICategory } from "../../server-action/api/category";
import DataTable from "../../components/GlobalComponents/Table/DataTable";
import { createDeleteAction, createEditAction } from "../../components/GlobalComponents/TableActions";
import DeleteModal from "../../components/GlobalComponents/DeleteModal";
import CategoryForm from "./Components/CategoryForm";
import { Modal } from "@mantine/core";

const CategoryPageIndex = () => {
  const { data } = categoryApi.useGetAll();
  console.log(data, "data");
  const { mutateAsync: deleteCategory } = categoryApi.useDelete();
  const [modalState, setModalState] = useState<{ mode: string; data?: ICategory } | null>(null);

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    setModalState(null);
  };

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Category Name", key: "name" },
        { title: "Image", key: "image" },
        { title: "Global Category", key: "globalCategory" },
        { title: "Action", key: "action" },
      ],
      rows: (data as any)?.category?.map((item: ICategory, index: number) => ({
        sn: index + 1,
        name: item.name,
        image: item.image,
        globalCategory: item.globalCategoryId,
        action: (
          <TableActions
            actions={[
              createEditAction(() => setModalState({ mode: "edit", data: item })),
              createDeleteAction(() => setModalState({ mode: "delete", data: item })),
            ]}
          />
        ),
      })) || [], // Fallback to empty array if data is undefined
    };
  }, [data]); // Add data to the dependency array

  return (
    <div>
      <PageHeader
        title="Global Category"
        onClick={() => setModalState({ mode: "create" })}
        actionVariant="outline"
      />
      <DataTable columns={tableData.columns} data={tableData.rows} />

      <Modal
        opened={modalState?.mode === "create" || modalState?.mode === "edit"}
        onClose={() => setModalState(null)}
        title={modalState?.mode === "create" ? "Create Global Category" : "Edit Global Category"}
        size="xl"
      >
        <CategoryForm
          edit={modalState?.mode === "edit" ? modalState.data : undefined}
          onClose={() => setModalState(null)}
        />
      </Modal>

      <DeleteModal
        opened={modalState?.mode === "delete"}
        itemName={modalState?.data?.name || ""}
        onClose={() => setModalState(null)}
        onConfirm={() => modalState?.data?._id && handleDeleteCategory(modalState.data._id)}
      />
    </div>
  );
};

export default CategoryPageIndex;