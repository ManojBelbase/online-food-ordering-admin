// constants/permissions.ts

import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constants/roles";

export const routePermissions: { [path: string]: string[] } = {
  "/": [], 
  [FRONTENDROUTES.CUSTOMER]: [Roles.ADMIN],
  [FRONTENDROUTES.PROFILE]: [], 
  [FRONTENDROUTES.GLOBAL_CATEGORY]:[Roles.ADMIN],
  [FRONTENDROUTES.CATEGORY]: [Roles.RESTAURANT, Roles.ADMIN],
  [FRONTENDROUTES.ORDERS]: [Roles.USER, Roles.USER],
};