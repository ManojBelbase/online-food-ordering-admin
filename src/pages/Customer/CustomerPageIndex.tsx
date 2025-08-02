import { useMemo, useState } from "react";
import { PageHeader, StatusBadge } from "../../components/GlobalComponents";
import { userApi } from "../../server-action/api/user";
import DataTable from "../../components/GlobalComponents/Table/DataTable";
import { Modal } from "@mantine/core";
import { IconMailCheck, IconMailX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { emailVerificationApi } from "../../server-action/api/emailVerification";
import EmailVerificationStatusComponent from "../../components/EmailVerificationStatus";
import CustomerForm from "./components/CustomerForm";

const CustomerPageIndex = () => {
  const { data, refetch } = userApi.useGetAll();
  const [openModal, setOpanModal]= useState(false)

  const handleCustomerCreated = () => {
    setOpanModal(false);
    refetch();
  };

  const handleResendVerification = async (email: string, userName: string, userId: string) => {
    try {

      await emailVerificationApi.adminResendVerificationEmail(userId);

      notifications.show({
        title: "Verification Email Sent",
        message: `Verification email sent to ${userName} (${email})`,
        color: "green",
        icon: <IconMailCheck size={16} />,
        autoClose: 3000,
      });

      refetch();
    } catch (error: any) {
      console.error('Error resending verification:', error);
      const errorMessage = error?.response?.data?.error?.message ||
                          error?.response?.data?.message ||
                          "Failed to send verification email";

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        icon: <IconMailX size={16} />,
        autoClose: 5000,
      });
    }
  };

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "Sn", key: "sn" },
        { title: "Full Name", key: "name" },
        { title: "Email", key: "email" },
        { title: "Role", key: "role" },
        { title: "Email Verification", key: "emailStatus" },
      ],
      rows: data?.map((user: any, index: number) => ({
        sn: index + 1,
        name: `${user.name}`,
        email: user.email,
        role: <StatusBadge status={user?.role}/>,
        emailStatus: (
          <EmailVerificationStatusComponent
            email={user.email}
            isEmailVerified={user.isEmailVerified}
            onResendClick={() => handleResendVerification(user.email, user.name, user._id || user.id)}
            showResendButton={true}
          />
        ),
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
      <CustomerForm onSuccess={handleCustomerCreated} />
    </Modal>
    </div>
  );
};

export default CustomerPageIndex;
