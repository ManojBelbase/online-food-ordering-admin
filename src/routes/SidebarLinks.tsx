import {
  IconDashboard,
  IconShoppingCart,
  IconCreditCard,
  IconUser,
  IconLock,
  IconCategory2,
  IconCategoryFilled,
  IconHotelService,
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
  },
{
  label:"Restaurant",
  to:FRONTENDROUTES.RESTAURAT,
  icon:IconHotelService,
},
  { label: "Category", to: FRONTENDROUTES.CATEGORY, icon: IconCategoryFilled },
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



  { label: "Permission", to: FRONTENDROUTES.PERMISSION, icon: IconLock },
  { label: "Profile", to: FRONTENDROUTES.PROFILE, icon: IconUser },
];