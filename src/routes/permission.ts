// constants/permissions.ts

import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constants/roles";

export const routePermissions: { [path: string]: string[] } = {
  "/": [], // Public route, no roles required
  [FRONTENDROUTES.CUSTOMER]: [Roles.ADMIN],
  [FRONTENDROUTES.PROFILE]: [], 
  [FRONTENDROUTES.CATEGORY]: [Roles.USER],
  [FRONTENDROUTES.MENU]: [Roles.ADMIN],
  [FRONTENDROUTES.PERMISSION]: [Roles.ADMIN],
  [FRONTENDROUTES.ORDERS]: [Roles.USER, Roles.USER],
  "/payments": ["admin"],
  "/payments/transactions": ["admin"],
  "/payments/methods": ["admin"],
  "/payments/refunds": ["admin"],
  "/menu/categories": ["admin"],
  "/menu/items": ["admin"],
  "/menu/add-item": ["admin"],
  "/menu/inventory": ["admin"],
};