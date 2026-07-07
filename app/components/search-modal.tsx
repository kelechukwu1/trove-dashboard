"use client";

import { useEffect, useState, useRef } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { HoldingCard } from "@/components/holding-card";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [recentSearchIds, setRecentSearchIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { holdings } = usePortfolioData();

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearchIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  const handleSelect = (holdingId: string) => {
    // Add to top of list, filter out duplicates, keep only last 5
    const newRecents = [holdingId, ...recentSearchIds.filter(id => id !== holdingId)].slice(0, 5);
    setRecentSearchIds(newRecents);
    localStorage.setItem("recentSearches", JSON.stringify(newRecents));
    onClose();
  };

  const filteredHoldings = query.trim() === "" 
    ? [] 
    : holdings.filter(h => 
        h.name.toLowerCase().includes(query.toLowerCase()) || 
        h.ticker.toLowerCase().includes(query.toLowerCase())
      );

  const recentHoldings = recentSearchIds
    .map(id => holdings.find(h => h.id === id))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));

  useEffect(() => {
    if (isOpen) {
      // Focus input after modal renders
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery(""); // clear on close
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header / Input */}
        <div className="flex items-center px-4 border-b border-border">
          <LuSearch className="size-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 h-14 bg-transparent border-0 outline-none px-4 text-base text-foreground placeholder:text-muted-foreground focus:ring-0"
            placeholder="Search stocks, crypto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
              ESC
            </span>
            <button
              onClick={onClose}
              className="p-1 sm:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <LuX className="size-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 min-h-[300px] max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            recentHoldings.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Searches
                  </p>
                  <button 
                    onClick={() => {
                      setRecentSearchIds([]);
                      localStorage.removeItem("recentSearches");
                    }}
                    className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer uppercase tracking-wide"
                  >
                    Clear All
                  </button>
                </div>
                {recentHoldings.map(holding => (
                  <div onClick={() => handleSelect(holding.id)} key={holding.id} className="transition-transform active:scale-[0.99]">
                    <HoldingCard holding={holding} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center pt-16 pb-8">
                <p className="text-sm font-medium text-foreground">
                  No recent searches
                </p>
              </div>
            )
          ) : filteredHoldings.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">
                Holdings
              </p>
              {filteredHoldings.map(holding => (
                <div onClick={() => handleSelect(holding.id)} key={holding.id} className="transition-transform active:scale-[0.99]">
                  <HoldingCard holding={holding} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center pt-16 pb-8">
              <p className="text-sm font-medium text-foreground">
                No results found for "{query}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                We couldn't find anything matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
