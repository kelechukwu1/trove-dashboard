"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LuBell, LuCircleHelp, LuSearch, LuX, LuLogOut } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/search-modal";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export function TopNav({ className }: { className?: string }) {
  const [activePopover, setActivePopover] = useState<"none" | "notifications" | "help">("none");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Close popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActivePopover("none");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-border bg-card",
          className
        )}
      >
        <div className="flex h-16 items-center px-4 md:px-6 gap-4" ref={navRef}>
          {/* Mobile brand */}
          <Link
            href="/dashboard"
            className="lg:hidden text-xl font-bold text-primary tracking-tight"
          >
            Trove
          </Link>

          {/* Search bar — desktop */}
          <div className="flex-1 max-w-md hidden md:flex">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative w-full text-left group cursor-pointer"
            >
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="w-full h-10 rounded-full bg-input border-0 pl-10 pr-4 flex items-center justify-between transition-all hover:ring-1 hover:ring-primary/30">
                <span className="text-sm text-muted-foreground">Search stocks, crypto...</span>
                <span className="hidden sm:inline-block text-[10px] font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border">
                  ⌘K
                </span>
              </div>
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-1 relative">
            {/* Mobile search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
            >
              <LuSearch className="size-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActivePopover(activePopover === "notifications" ? "none" : "notifications")}
                className={cn("text-muted-foreground relative transition-colors duration-200", activePopover === "notifications" && "bg-muted text-foreground")}
              >
                <LuBell className="size-5" />
                <span className="sr-only">Notifications</span>
                {/* Notification dot */}
                <span className="absolute top-2 right-2.5 size-2 rounded-full bg-destructive" />
              </Button>

              {/* Notifications Popover */}
              {activePopover === "notifications" && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-[14px] bg-card border border-border shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden animate-fade-in z-50">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                    <button onClick={() => setActivePopover("none")} className="text-muted-foreground hover:text-foreground cursor-pointer">
                      <LuX className="size-4" />
                    </button>
                  </div>
                  <div className="flex flex-col max-h-[300px] overflow-y-auto">
                    <div className="p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">Deposit Successful</p>
                        <span className="text-[11px] text-muted-foreground shrink-0">2m ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Your deposit of $5,000.00 has been credited to your US Portfolio.</p>
                    </div>
                    <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">Price Alert: NVDA</p>
                        <span className="text-[11px] text-muted-foreground shrink-0">1h ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Nvidia Corporation is up 5.2% today, crossing your set threshold.</p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-border bg-muted/30 text-center">
                    <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActivePopover(activePopover === "help" ? "none" : "help")}
                className={cn("text-muted-foreground transition-colors duration-200", activePopover === "help" && "bg-muted text-foreground")}
              >
                <LuCircleHelp className="size-5" />
                <span className="sr-only">Help</span>
              </Button>

              {/* Help Popover */}
              {activePopover === "help" && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-[14px] bg-card border border-border shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden animate-fade-in z-50">
                  <div className="p-2 flex flex-col">
                    <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors text-left cursor-pointer">
                      Help Center
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors text-left cursor-pointer">
                      Contact Support
                    </button>
                    <div className="h-px bg-border my-1 mx-2" />
                    <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors text-left cursor-pointer">
                      Keyboard Shortcuts
                    </button>
                    <div className="h-px bg-border my-1 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors text-left cursor-pointer"
                    >
                      <LuLogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
