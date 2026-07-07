"use client";

import { ReactNode } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthProvider } from "@/context/auth-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider requireAuth>
      <div className="min-h-screen flex bg-(--page-bg)">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <TopNav />
          <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-[1200px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
