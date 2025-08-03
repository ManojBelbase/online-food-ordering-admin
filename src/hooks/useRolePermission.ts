// hooks/useRolePermissions.ts
import { useAuth } from "../redux/useAuth";
import { routePermissions } from "../routes/permission";

export const useRolePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (path: string): boolean => {
    const requiredRoles = routePermissions[path] || [];


    if (requiredRoles.length === 0) {
      return !!user;
    }

    if (!user || !user.role) {
      return false;
    }

    const hasAccess = requiredRoles.includes(user.role);
    return hasAccess;
  };

  const filterItemsByRole = (items: any[]) => {
    return items.filter((item) => {
      if (item.to && !hasPermission(item.to)) {
        return false;
      }

      if (item.children) {
        const filteredChildren = item.children.filter((child: any) =>
          hasPermission(child.to)
        );
        return filteredChildren.length > 0 || hasPermission(item.to);
      }

      return true;
    });
  };

  return { hasPermission, filterItemsByRole };
};