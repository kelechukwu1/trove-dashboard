"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { useAuthStore } from "@/stores/auth.store";

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = usePortfolioData();
  const { userEmail } = useAuthStore();

  return (
    <aside
      className={cn(
        "hidden lg:flex w-[240px] flex-col justify-between py-6 px-4 h-screen sticky top-0 border-r border-border bg-card overflow-y-auto scrollbar-hide",
        className
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="text-xl font-bold text-primary tracking-tight"
        >
          Trove
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User section */}
      <div className="px-3 space-y-3 pt-5 border-t border-border">
        <div className="flex items-center gap-3 py-2">
          <div className="size-9 rounded-full overflow-hidden flex items-center justify-center bg-muted">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail || "default"}`}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground leading-tight">
              {user?.name || "Adaeze Okonkwo"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Premium Member
            </span>
          </div>
        </div>
        <Button className="w-full rounded-md gap-1.5" size="default">
          <LuPlus className="size-4" />
          Add Funds
        </Button>
      </div>
    </aside>
  );
}
