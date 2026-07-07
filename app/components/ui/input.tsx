"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LuEye, LuEyeOff } from "react-icons/lu";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: "text" | "email" | "password" | "search" | "number";
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={inputType}
            data-slot="input"
            className={cn(
              "flex h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground transition-colors duration-200",
              "placeholder:text-(--disabled)",
              "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:border-destructive focus:ring-destructive/30",
              isPassword && "pr-11",
              type === "search" && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--disabled) hover:text-muted-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <LuEyeOff className="h-[18px] w-[18px]" />
              ) : (
                <LuEye className="h-[18px] w-[18px]" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive mt-0.5">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
