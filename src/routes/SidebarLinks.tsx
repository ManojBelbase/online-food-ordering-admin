import {
  IconDashboard,
  IconShoppingCart,
  IconCreditCard,
  IconUser,
  IconCategory2,
  IconCategoryFilled,
  IconHotelService,
  Icon24Hours,
} from "@tabler/icons-react";
import { FRONTENDROUTES } from "../constants/frontendRoutes";

interface ISidebarLinks {
  label: string;
  to: string;
  icon?: React.ComponentType<any>;
  children?: ISidebarLinks[];
}

export const sidebarLinks: ISidebarLinks[] = [
  { label: "Dashboard", to: "/", icon: IconDashboard },
  {
    label:'Customer',
    to:FRONTENDROUTES.CUSTOMER,
    icon:IconUser,
  },
  {
    label:"Global Category",
    to:FRONTENDROUTES.GLOBAL_CATEGORY,
    icon:IconCategory2
  },
  {
    label: "Orders",
    to: FRONTENDROUTES.ORDERS,
    icon: IconShoppingCart,
    children:[
      {label:"New Ordres", to:FRONTENDROUTES.NEW_ORDERS},
      {label:"Completed Ordres", to:FRONTENDROUTES.COMPLETED_ORDERS},
      {label:"CANCELLED Ordres", to:FRONTENDROUTES.CANCELLED_ORDERS}
    ]
  },
{
  label:"Restaurant",
  to:FRONTENDROUTES.RESTAURAT,
  icon:IconHotelService,
},
  { label: "Category", to: FRONTENDROUTES.CATEGORY, icon: IconCategoryFilled },

  {
    label:"Food Item", to:FRONTENDROUTES.FOOD_ITEM, icon:Icon24Hours
  },
  {
    label: "Payments",
    to: "/payments",
    icon: IconCreditCard,
    children: [
      { label: "Transactions", to: "/payments/transactions" },
      { label: "Payment Methods", to: "/payments/methods" },
      { label: "Refunds", to: "/payments/refunds" },
    ],
  },

  { label: "Profile", to: FRONTENDROUTES.PROFILE, icon: IconUser },
];