import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Table,
  Checkbox,
  Button,
  Title,
  Paper,
  Group,
  Text,
  LoadingOverlay,
  ScrollArea,
  Badge,
  Divider,
  Box,
} from "@mantine/core";
import { useAuth } from "../../redux/useAuth";
import { usePermissions } from "../../contexts/PermissonContext";
import { IconArrowLeft } from "@tabler/icons-react";
import { sidebarLinks } from "../../routes/SidebarLinks";

const PermissionManagerIndex: React.FC = () => {
  const { permissions, updatePermissions } = usePermissions();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const availableRoles = ["admin", "user"];

  if (isLoading) return <LoadingOverlay visible={true} />;

  if (!isAuthenticated || user?.role !== "user") {
    return <Navigate to="/unauthorized" replace />;
  }

  const allRoutes = sidebarLinks.flatMap((link) => [
    { path: link.to, label: link.label },
    ...(link.children?.map((child) => ({
      path: child.to,
      label: `${link.label} → ${child.label}`,
    })) || []),
  ]);

  const handleRoleChange = (path: string, role: string, checked: boolean) => {
    const currentRoles = permissions[path] || [];
    const newRoles = checked
      ? [...new Set([...currentRoles, role])]
      : currentRoles.filter((r) => r !== role);
    updatePermissions(path, newRoles);
  };

  return (
    <Box maw={1300} mx="auto">
      <Group justify="space-between" mb="xl">
        <Title order={2}>🔐 Route Permission Manager</Title>
        <Button variant="light" onClick={() => navigate("/")} leftSection={<IconArrowLeft />}>
          Back to Dashboard
        </Button>
      </Group>

      <Paper p="md" radius="md" shadow="md" withBorder>
        <ScrollArea h={600}>
          <Table
            striped
            highlightOnHover
            withTableBorder
            stickyHeader
            horizontalSpacing="md"
            verticalSpacing="sm"          
          >
            <thead>
              <tr className="flex items-center justify-end">
                <th>Route</th>
                {availableRoles.map((role) => (
                  <th key={role} style={{ textAlign: "center" }}>
                    <Badge color="gray" variant="light" size="lg">
                      {role}
                    </Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="flex items-center justify-center">
              {allRoutes.map((route) => (
                <tr key={route.path}>
                  <td>
                    <Text fw={500}>{route.label}</Text>
                    <Text size="xs" c="dimmed">
                      {route.path}
                    </Text>
                  </td>
                  {availableRoles.map((role) => (
                    <td key={role} style={{ textAlign: "center" }}>
                      <Checkbox
                        checked={(permissions[route.path] || []).includes(role)}
                        onChange={(event) =>
                          handleRoleChange(route.path, role, event.currentTarget.checked)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
        <Divider my="md" />
        <Text size="sm" c="dimmed">
          💡 If no roles are selected for a route, it will be accessible to all authenticated users.
        </Text>
      </Paper>
    </Box>
  );
};

export default PermissionManagerIndex;
