"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressSegment {
  value: number;
  color: string;
  label?: string;
}

interface ProgressBarProps extends React.ComponentProps<"div"> {
  segments: ProgressSegment[];
  height?: number;
}

function ProgressBar({
  segments,
  height = 12,
  className,
  ...props
}: ProgressBarProps) {
  return (
    <div
      data-slot="progress-bar"
      className={cn(
        "flex w-full overflow-hidden rounded-full",
        className
      )}
      style={{ height: `${height}px` }}
      {...props}
    >
      {segments.map((segment, index) => (
        <div
          key={index}
          className="transition-all duration-500 ease-out first:rounded-l-full last:rounded-r-full"
          style={{
            width: `${segment.value}%`,
            backgroundColor: segment.color,
            minWidth: segment.value > 0 ? "3px" : "0",
          }}
          title={segment.label ? `${segment.label}: ${segment.value.toFixed(1)}%` : undefined}
        />
      ))}
    </div>
  );
}

export { ProgressBar };
export type { ProgressSegment };
