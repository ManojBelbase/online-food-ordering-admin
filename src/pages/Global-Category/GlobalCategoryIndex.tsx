import { useMemo, useState } from "react";
import { PageHeader, StatusBadge, TableActions } from "../../components/GlobalComponents";
import { globalCategoryApi, type IGlobalCategory } from "../../server-action/api/global-category";
import DataTable from "../../components/GlobalComponents/Table/DataTable";
import { Modal } from "@mantine/core";
import GlobalCategoryForm from "./Components/GlobalCategoryForm";
import { createDeleteAction, createEditAction, createViewAction } from "../../components/GlobalComponents/TableActions";

const GlobalCategoryIndex = () => {
  const { data } = globalCategoryApi.useGetAll(); 

  const [openModal, setOpenModal] = useState(false);

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: " Category Name", key: "name" },
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
          status:<StatusBadge status={item?.isActive ?"Active":"InActive"}/>,
          image: item.image,
          action: (
            <TableActions
              actions={[
                createViewAction(() => {}),
                createEditAction(() => {}),
                createDeleteAction(() => {}),

              ]}
            />
          ),
        })) || [],
    };
  }, [data]);

  return (
    <div>
      <PageHeader title="Global Category" onClick={()=>setOpenModal(true)}  actionVariant="outline"/>
      <DataTable columns={tableData.columns} data={tableData.rows} />

      <Modal opened={openModal} onClose={()=>setOpenModal(false)} title="Global Category Form" size={"xl"}>
        <GlobalCategoryForm/>
      </Modal>
    </div>
  );
};

export default GlobalCategoryIndex;
