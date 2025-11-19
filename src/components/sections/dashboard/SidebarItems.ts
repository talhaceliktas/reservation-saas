import {
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  LifeBuoy,
  Scissors,
  Settings,
  Users,
} from "lucide-react";

export const sidebarItems = [
  {
    group: "Main",
    items: [
      { icon: LayoutDashboard, label: "dashboard", href: "/dashboard" },
      { icon: CalendarDays, label: "calendar", href: "/dashboard/calendar" },
      { icon: Users, label: "customers", href: "/dashboard/customers" },
    ],
  },
  {
    group: "Management",
    items: [
      { icon: Scissors, label: "services", href: "/dashboard/services" },
      { icon: BriefcaseBusiness, label: "staff", href: "/dashboard/staff" },
    ],
  },
  {
    group: "System",
    items: [
      { icon: Settings, label: "settings", href: "/dashboard/settings" },
      { icon: LifeBuoy, label: "support", href: "/dashboard/support" },
    ],
  },
];
