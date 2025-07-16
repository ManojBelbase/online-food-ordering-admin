import { useMemo, useState } from "react";
import { PageHeader, StatusBadge } from "../../components/GlobalComponents";
import { userApi } from "../../server-action/api/user";
import DataTable from "../../components/GlobalComponents/Table/DataTable";
import { Modal } from "@mantine/core";
import CustomerForm from "./components/CustomerForm";

const CustomerPageIndex = () => {
  const { data } = userApi.useGetAll();
  const [openModal, setOpanModal]= useState(false)

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: "Full Name", key: "name" },
        { title: "Email", key: "email" },
        { title: "Role", key: "role" },
      ],
      rows: data?.map((user: any, index: number) => ({
        sn: index + 1,
        name: `${user.name}`,
        email:user.email,
        role:<StatusBadge status={user?.role}/>

      })) || [],
    };
  }, [data]);

  return (
    <div>
      <PageHeader
        title="Customer"
        onClick={() => setOpanModal(true)}
        actionVariant="outline"
      />
<DataTable data={tableData.rows} columns={tableData.columns} searchPlaceholder="Search..." />
    <Modal opened={openModal} onClose={()=>setOpanModal(false)} title="Add Customer" centered> 
      <CustomerForm/>
    </Modal>
    </div>
  );
};

export default CustomerPageIndex;
