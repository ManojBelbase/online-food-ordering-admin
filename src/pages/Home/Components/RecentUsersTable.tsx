import React from "react";
import { Card, Title, Table, Badge } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText } from "../../../components/ui";

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

interface RecentUsersTableProps {
  data: RecentUser[];
}

const RecentUsersTable: React.FC<RecentUsersTableProps> = ({ data }) => {
  const { theme } = useTheme();

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: theme.colors.error,
      restaurant: theme.colors.primary,
      user: theme.colors.success,
      delivery: theme.colors.warning,
    };
    return roleColors[role?.toLowerCase() || ""] || theme.colors.textSecondary;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!data || data.length === 0) {
    return (
      <Card
        shadow="sm"
        padding="lg"
        radius="sm"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          height: "100%",
        }}
      >
        <Title order={3} mb="md" style={{ color: theme.colors.textPrimary }}>
          👥 Recent Users
        </Title>
        <CustomText color="secondary" size="sm">
          No users found
        </CustomText>
      </Card>
    );
  }

  const rows = data.slice(0, 5).map((user) => (
    <Table.Tr key={user._id}>
      <Table.Td>
        <CustomText size="sm" fontWeight={600} color="primary">
          {user.name || "N/A"}
        </CustomText>
      </Table.Td>
      <Table.Td>
        <CustomText size="sm" color="secondary">
          {user.email || "N/A"}
        </CustomText>
      </Table.Td>
      <Table.Td>
        <Badge
          color={getRoleColor(user.role || "")}
          variant="light"
          size="sm"
        >
          {user.role || "N/A"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <CustomText size="xs" color="secondary">
          {formatDate(user.createdAt)}
        </CustomText>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="sm"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        height: "100%",
      }}
    >
      <Title order={3} mb="md" style={{ color: theme.colors.textPrimary }}>
        👥 Recent Users
      </Title>
      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <CustomText size="sm" fontWeight={600} color="secondary">
                  Name
                </CustomText>
              </Table.Th>
              <Table.Th>
                <CustomText size="sm" fontWeight={600} color="secondary">
                  Email
                </CustomText>
              </Table.Th>
              <Table.Th>
                <CustomText size="sm" fontWeight={600} color="secondary">
                  Role
                </CustomText>
              </Table.Th>
              <Table.Th>
                <CustomText size="sm" fontWeight={600} color="secondary">
                  Joined
                </CustomText>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  );
};

export default RecentUsersTable;

