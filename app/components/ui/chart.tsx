"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";

interface ChartDataPoint {
  date: string;
  value: number;
}

interface ChartProps extends React.ComponentProps<"div"> {
  data: ChartDataPoint[];
  color?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-card border border-border px-3 py-2 shadow-lg">
      <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-foreground">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function Chart({
  data,
  color = "#059A83",
  height = 200,
  showGrid = false,
  showAxis = false,
  className,
  ...props
}: ChartProps) {
  return (
    <div
      data-slot="chart"
      className={cn("w-full", className)}
      style={{ height }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
          )}
          {showAxis && (
            <>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--disabled)" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--disabled)" }}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
                width={45}
              />
            </>
          )}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
          />
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="natural"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fill="url(#chartGradient)"
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export { Chart };
export type { ChartDataPoint };
