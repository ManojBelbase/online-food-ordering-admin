// hooks/useRolePermissions.ts
import { usePermissions } from "../contexts/PermissonContext";
import { useAuth } from "../redux/useAuth";

export const useRolePermissions = () => {
  const { user } = useAuth();
  const { permissions } = usePermissions();

  const hasPermission = (path: string): boolean => {
    const requiredRoles = permissions[path] || [];
    
    // If no roles required, allow access
    if (requiredRoles.length === 0) {
      return true;
    }
    
    // Check if user has required role
    return requiredRoles.includes(user?.role ?? "");
  };

  const filterItemsByRole = (items: any[]) => {
    return items.filter(item => {
      if (item.to && !hasPermission(item.to)) {
        return false;
      }
      
      // Filter children if they exist
      if (item.children) {
        const filteredChildren = item.children.filter((child: any) => 
          hasPermission(child.to)
        );
        // Only show parent if it has accessible children
        return filteredChildren.length > 0;
      }
      
      return true;
    });
  };

  return { hasPermission, filterItemsByRole };
};