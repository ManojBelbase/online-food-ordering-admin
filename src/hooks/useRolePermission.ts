// hooks/useRolePermissions.ts
import { useAuth } from "../redux/useAuth";
import { routePermissions } from "../routes/permission";

export const useRolePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (path: string): boolean => {
    const normalizedPath = path.split('?')[0].replace(/\/$/, '') || '/';
    
    let requiredRoles = routePermissions[normalizedPath];
    
    if (!requiredRoles) {
      const matchingKey = Object.keys(routePermissions).find(key => {
        const normalizedKey = key.replace(/\/$/, '') || '/';
        return normalizedPath === normalizedKey || normalizedPath.startsWith(normalizedKey + '/');
      });
      if (matchingKey) {
        requiredRoles = routePermissions[matchingKey];
      }
    }
    
    // If still no match, default to empty array
    requiredRoles = requiredRoles || [];


    if (requiredRoles.length === 0) {
      // No specific roles required, just need to be authenticated
      return !!user;
    }

    if (!user || !user.role) {
      console.log("Permission denied: No user or role");
      return false;
    }

    const hasAccess = requiredRoles.includes(user.role);
    if (!hasAccess) {
      console.log("Permission denied: Role mismatch", {
        userRole: user.role,
        requiredRoles,
      });
    }
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