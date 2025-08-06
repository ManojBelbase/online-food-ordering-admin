import { useMemo, useState } from "react";
import { PageHeader, StatusBadge, TableActions } from "../../components/GlobalComponents";
import { globalCategoryApi, type IGlobalCategory } from "../../server-action/api/global-category";
import DataTable from "../../components/GlobalComponents/Table/DataTable";
import { Modal } from "@mantine/core";
import GlobalCategoryForm from "./Components/GlobalCategoryForm";
import {  onDelete, onEdit } from "../../components/GlobalComponents/TableActions";

const GlobalCategoryIndex = () => {
  const { data } = globalCategoryApi.useGetAll();
  const { mutateAsync: deleteGlobalCategory } = globalCategoryApi.useDelete();
  const [modalState, setModalState] = useState<{ mode: string; data?: IGlobalCategory } | null>(null);

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: "Category Name", key: "name" },
        { title: "Slug", key: "slug" },
        { title: "Status", key: "status" },
        { title: "Image", key: "image" },
        { title: "Actions", key: "action" },
      ],
      rows:
        (data as any)?.globalCategory.map((item: IGlobalCategory, index: number) => ({
          sn: index + 1,
          name: item.name,
          slug: item.slug,
          status: <StatusBadge status={item?.isActive ? "Active" : "InActive"} />,
          image: item.image,
          action: (
            <TableActions
              actions={[
                onEdit(() => setModalState({ mode: "edit", data: item })),
                onDelete(deleteGlobalCategory, item.name, item._id || ''),
              ]}
            />
          ),
        })) || [],
    };
  }, [data]);

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
        <GlobalCategoryForm
          edit={modalState?.mode === "edit" ? modalState.data : undefined}
          onClose={() => setModalState(null)}
        />
      </Modal>


    </div>
  );
};

export default GlobalCategoryIndex;