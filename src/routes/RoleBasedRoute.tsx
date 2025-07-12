import { Center, Text, Button } from "@mantine/core";
import { useRolePermissions } from "../hooks/useRolePermission";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  path: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, path }) => {
  const { hasPermission } = useRolePermissions();

  if (!hasPermission(path)) {
    return (
      <Center style={{ height: "100vh", flexDirection: "column" }}>
        <Text size="xl" mb="md">Unauthorized Access</Text>
        <Text mb="md">You don't have permission to access this page.</Text>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </Center>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRoute;