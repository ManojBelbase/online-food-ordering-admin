import {
  IconDashboard,
  IconNews,
  IconChartBar,
  IconFileText,
  IconSettings,
  IconLock,
} from "@tabler/icons-react";

export const sidebarLinks = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: IconDashboard,
  },
  {
    label: "Market news",
    to: "/market-news",
    icon: IconNews,
    children: [
      { label: "Overview", to: "/market-news/overview" },
      { label: "Forecasts", to: "/market-news/forecasts" },
      { label: "Outlook", to: "/market-news/outlook" },
    ],
  },
  {
    label: "Real time",
    to: "/realtime",
    icon: IconChartBar,
  },
  {
    label: "Releases",
    to: "/releases",
    icon: IconFileText,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: IconChartBar,
  },
  {
    label: "Contracts",
    to: "/contracts",
    icon: IconFileText,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: IconSettings,
  },
  {
    label: "Security",
    to: "/security",
    icon: IconLock,
  },
];
