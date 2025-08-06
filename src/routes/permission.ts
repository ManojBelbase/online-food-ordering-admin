// constants/permissions.ts

import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constants/roles";

export const routePermissions: { [path: string]: string[] } = {
  "/": [Roles.ADMIN, Roles.RESTAURANT, Roles.USER, Roles.DELIVERY],
  "/components": [Roles.ADMIN, Roles.RESTAURANT, Roles.USER, Roles.DELIVERY],
  [FRONTENDROUTES.CUSTOMER]: [Roles.ADMIN],
  [FRONTENDROUTES.PROFILE]: [Roles.ADMIN, Roles.RESTAURANT, Roles.USER, Roles.DELIVERY],
  [FRONTENDROUTES.GLOBAL_CATEGORY]: [Roles.ADMIN],
  [FRONTENDROUTES.RESTAURANT]: [Roles.ADMIN],
  [FRONTENDROUTES.RESTAURANT_ONBOARDING]: [Roles.RESTAURANT],
  [FRONTENDROUTES.CATEGORY]: [Roles.RESTAURANT],
  [FRONTENDROUTES.ORDERS]: [Roles.RESTAURANT],
  [FRONTENDROUTES.FOOD_ITEM]: [Roles.ADMIN, Roles.RESTAURANT],
  [FRONTENDROUTES.NEW_ORDERS]: [Roles.RESTAURANT],
  "/menu/items": [Roles.ADMIN, Roles.RESTAURANT, Roles.USER, Roles.DELIVERY],
};