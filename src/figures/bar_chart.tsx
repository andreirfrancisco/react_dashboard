import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the ChartConfig type with an index signature
interface ChartConfig {
  label?: React.ReactNode; // Optional label
  color?: string; // Optional color
  theme?: Record<"light" | "dark", string>; // Optional theme
  [key: string]: any; // Index signature to allow additional properties
}

// Configuration for the chart
const chartConfig: ChartConfig = {
  label: "Current Count",
  color: "bg-orange-100",
};

interface BarComponentProps {
  data: {
    x_axis: string[];
    y_axis: number[];
  };
}

export function BarComponent({ data }: BarComponentProps) {
  const { x_axis, y_axis } = data;

  const chartData = x_axis.map((date, index) => ({
    date,
    count: y_axis[index] || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle> Unemployed </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='max-h-[550px] w-full'>
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar className='text-large' dataKey="count" fill={chartConfig.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}