import React, { useState } from "react";
import {
  Tabs,
} from "@mantine/core";
import {
  IconUser,
  IconShield,
  IconFaceId,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import PageHeader from "../../components/GlobalComponents/PageHeader";
import ProfileInfoTab from "./Components/ProfileInfoTab";
import SecurityTab from "./Components/SecurityTab";
import FaceRecognitionTab from "./Components/FaceRecognitionTab";
import { useAuth } from "../../redux/useAuth";

const ProfilePageIndex: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const {user}= useAuth();

  return (
    <div>
      <PageHeader
        title="Profile Settings"
        breadcrumbs={[
          { label: "Profile", href: "/profile" },
        ]}
      />
      <Tabs 
        value={activeTab}
        onChange={(value) => setActiveTab(value || "profile")} 
        styles={{
          list: {
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "8px 8px 0 0",
          },
          tab: {
            color: theme.colors.textSecondary,
            "&[data-active]": {
              color: theme.colors.primary,
              borderColor: theme.colors.primary,
            },
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="profile" style={{display: user?.role==="admin" ? "none" : "block"}} leftSection={<IconUser size={16} />}>
          {user?.role==="restaurant" ?"Restaurant Information":"Profile Information"}
          </Tabs.Tab>
          {/* <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Security Settings
          </Tabs.Tab> */}
          <Tabs.Tab value="face-recognition" leftSection={<IconFaceId size={16} />}>
            Face Recognition
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="md">
          <ProfileInfoTab />
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="md">
          <SecurityTab />
        </Tabs.Panel>

        <Tabs.Panel value="face-recognition" pt="sm">
          <FaceRecognitionTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ProfilePageIndex;
