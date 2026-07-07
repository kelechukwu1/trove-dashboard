import { RxDashboard } from "react-icons/rx";
import {
  HiOutlineBriefcase,
  HiOutlineArrowsRightLeft,
  HiOutlineChartBarSquare,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

export const SECTOR_COLORS: Record<string, string> = {
  Technology: "#059A83",
  Automotive: "#00B6DF",
  Healthcare: "#E0F5E1",
  Finance: "#7B79C9",
  Entertainment: "#00323D",
};

export const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: RxDashboard },
  { name: "Portfolio", href: "/portfolio", icon: HiOutlineBriefcase },
  {
    name: "Transactions",
    href: "/transactions",
    icon: HiOutlineArrowsRightLeft,
  },
  { name: "Markets", href: "/markets", icon: HiOutlineChartBarSquare },
  { name: "Settings", href: "/settings", icon: HiOutlineCog6Tooth },
];

export const ITEMS_PER_PAGE = 10;
