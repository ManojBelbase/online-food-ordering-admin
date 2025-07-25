// constants/permissions.ts

import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constants/roles";

export const routePermissions: { [path: string]: string[] } = {
  "/": [], 
  [FRONTENDROUTES.CUSTOMER]: [Roles.ADMIN],
  [FRONTENDROUTES.PROFILE]: [], 
  [FRONTENDROUTES.GLOBAL_CATEGORY]:[Roles.ADMIN],
  [FRONTENDROUTES.RESTAURANT_ONBOARDING]:[Roles.RESTAURANT],
  [FRONTENDROUTES.CATEGORY]: [Roles.RESTAURANT],
  [FRONTENDROUTES.ORDERS]: [Roles.RESTAURANT],
};