// hooks/useRolePermissions.ts
import { useCallback } from "react";
import { useAuth } from "../redux/useAuth";
import { routePermissions } from "../routes/permission";

export const useRolePermissions = () => {
  const { user } = useAuth();

  const hasPermission = useCallback((path: string): boolean => {
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
    
    requiredRoles = requiredRoles || [];


    if (requiredRoles.length === 0) {
      return !!user;
    }

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }, [user]);

  const filterItemsByRole = useCallback((items: any[]) => {
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
  }, [hasPermission]);

  return { hasPermission, filterItemsByRole };
};