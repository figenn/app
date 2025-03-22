"use client";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Spinner from "@/components/ui/loader";

interface SubscriptionChartProps {
  data: {
    year: number;
    cost: number;
    cost10: number;
    cost20: number;
    cost30: number;
  }[];
  isLoading: boolean;
  isMobile: boolean;
}

function SubscriptionChart({
  data,
  isLoading,
  isMobile,
}: SubscriptionChartProps) {
  const chartConfig = {
    cost: {
      label: "Cumulative Cost",
      color: "#FFA500",
    },
  } satisfies ChartConfig;

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart
              data={data}
              margin={{
                top: isMobile ? 5 : 10,
                right: isMobile ? 10 : 30,
                left: isMobile ? 10 : 0,
                bottom: isMobile ? 5 : 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Year ${value}`}
                fontSize={isMobile ? 10 : 14}
              />
              <YAxis
                tickFormatter={(value) => `€${value}`}
                tickLine={false}
                axisLine={false}
                fontSize={isMobile ? 10 : 14}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Year ${label}`}
                    formatter={(value) => `€${Number(value).toLocaleString()}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke="var(--color-chart-1)"
                fillOpacity={0.6}
                fill="var(--color-chart-1)"
              />
              <Area
                type="monotone"
                dataKey="cost10"
                stroke="var(--color-chart-2)"
                fillOpacity={0.6}
                fill="var(--color-chart-2)"
              />
              <Area
                type="monotone"
                dataKey="cost20"
                stroke="var(--color-chart-3)"
                fillOpacity={0.6}
                fill="var(--color-chart-3)"
              />
              <Area
                type="monotone"
                dataKey="cost30"
                stroke="var(--color-chart-4)"
                fillOpacity={0.4}
                fill="var(--color-chart-4)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </>
  );
}

export default SubscriptionChart;
