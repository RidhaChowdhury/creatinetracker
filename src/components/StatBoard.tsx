"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatBoardProps {
  saturationHistory: { date: string; saturation: number }[];
  streak: number;
  complianceRate: number;
  daysUntilSaturated: number;
}

export default function StatBoard({
  saturationHistory,
  streak,
  complianceRate,
  daysUntilSaturated,
}: StatBoardProps) {
  const COLORS = ["#22C55E", "#D1D5DB"]; // Tailwind green-500 & gray-300

  const complianceData = [
    { name: "Logged", value: complianceRate },
    { name: "Missed", value: 100 - complianceRate },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Saturation Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Saturation Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={saturationHistory}>
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, 1]} tickFormatter={(val) => `${val * 100}%`} />
              <Tooltip
                formatter={(val) => `${((val as number) * 100).toFixed(0)}%`}
              />
              <Line
                type="monotone"
                dataKey="saturation"
                stroke="#22C55E"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>Streak Counter</CardTitle>
        </CardHeader>
        <CardContent className="text-4xl font-bold text-green-500">
          {streak} Days
        </CardContent>
      </Card>

      {/* Compliance Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Rate</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie
                data={complianceData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Days Until Saturated */}
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>Days Until Saturated</CardTitle>
        </CardHeader>
        <CardContent className="text-4xl font-bold text-green-500">
          {daysUntilSaturated}
        </CardContent>
      </Card>
    </div>
  );
}
