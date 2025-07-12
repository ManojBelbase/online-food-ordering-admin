import React, { createContext, useContext, useState, useEffect } from "react";
import { FRONTENDROUTES } from "../constants/frontendRoutes";

interface RoutePermissions {
  [path: string]: string[];
}

interface PermissionsContextType {
  permissions: RoutePermissions;
  updatePermissions: (path: string, roles: string[]) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

const initialPermissions: RoutePermissions = {
  "/": [],
  "/components": ["admin"],
  "/orders": ["admin"],
  "/orders/create": ["admin"],
  "/orders/pending": ["admin"],
  "/orders/processing": ["admin"],
  "/orders/completed": ["admin"],
  "/orders/cancelled": ["admin"],
  [FRONTENDROUTES.PROFILE]: [],
  [FRONTENDROUTES.CATEGORY]: ["admin",'user'],
  "/menu": ["admin"],
  "/menu/categories": ["admin"],
  "/menu/items": ["admin"],
  "/menu/add-item": ["admin"],
  "/menu/inventory": ["admin"],
  "/customers": ["admin"],
  "/customers/reviews": ["admin"],
  "/customers/loyalty": ["admin"],
  "/delivery/areas": ["admin"],
  "/delivery/staff": ["admin"],
  "/delivery/tracking": ["admin"],
  "/payments": ["admin"],
  "/payments/transactions": ["admin"],
  "/payments/methods": ["admin"],
  "/payments/refunds": ["admin"],
  "/analytics": ["admin"],
  "/analytics/sales": ["admin"],
  "/analytics/customers": ["admin"],
  "/analytics/menu": ["admin"],
  "/analytics/revenue": ["admin"],
  "/notifications": [],
  "/theme-test": [],
  "/users/roles": ["admin"],
 [FRONTENDROUTES.PERMISSION]:[]
};

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<RoutePermissions>(initialPermissions);

  useEffect(() => {
    const savedPermissions = localStorage.getItem("routePermissions");
    if (savedPermissions) {
      try {
        const parsedPermissions = JSON.parse(savedPermissions);
        setPermissions(parsedPermissions);
      } catch (error) {
      }
    }
  }, []); 

  const updatePermissions = (path: string, roles: string[]) => {
    setPermissions((prev) => {
      const newPermissions = { ...prev, [path]: roles };
      localStorage.setItem("routePermissions", JSON.stringify(newPermissions));
      return newPermissions;
    });
  };

  return (
    <PermissionsContext.Provider value={{ permissions, updatePermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}