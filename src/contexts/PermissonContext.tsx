import React, { createContext, useContext, useState, useEffect } from "react";
import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constant/roles";

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
  "/orders/create": ["admin"],
  [FRONTENDROUTES.PROFILE]: [],
  [FRONTENDROUTES.CATEGORY]: [Roles.USER],
  "/menu": ["admin"],
 [FRONTENDROUTES.PERMISSION]:["admin"]
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