import React, { useState } from "react";
import {
  Container,
  Tabs,
} from "@mantine/core";
import {
  IconUser,
  IconShield,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import PageHeader from "../../components/GlobalComponents/PageHeader";
import ProfileInfoTab from "./Components/ProfileInfoTab";
import SecurityTab from "./Components/SecurityTab";
import { useAuth } from "../../redux/useAuth";

const ProfilePageIndex: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const {user}= useAuth();
  console.log(user?.role,"reole")

  return (
    <Container py="md" size="xl">
      <PageHeader
        title="Profile Settings"
        breadcrumbs={[
          { label: "Profile", href: "/profile" },
        ]}
      />

      <Tabs 
        value={activeTab} 
        onChange={(value) => setActiveTab(value || "profile")} 
        mt="md"
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
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
          {user?.role ?"Restaurant Information":"Profile Information"}
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Security Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="md">
          <ProfileInfoTab />
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="md">
          <SecurityTab />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default ProfilePageIndex;
