import { type ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface NavItem {
  name: string;
  href: string;
  icon: string;
}
