"use client";
import { useState } from "react";
import CreatineLog from "@/components/CreatineLog";
import StatBoard from "@/components/StatBoard";

export default function Page() {
  const [isExpanded, setIsExpanded] = useState(false);

    const saturationHistory = [
    { date: "2024-02-01", saturation: 0.2 },
    { date: "2024-02-02", saturation: 0.3 },
    { date: "2024-02-03", saturation: 0.4 },
    { date: "2024-02-04", saturation: 0.5 },
    { date: "2024-02-05", saturation: 0.6 },
    { date: "2024-02-06", saturation: 0.7 },
    { date: "2024-02-07", saturation: 0.75 },
    { date: "2024-02-08", saturation: 0.8 },
    { date: "2024-02-09", saturation: 0.85 },
    { date: "2024-02-10", saturation: 0.9 },
    { date: "2024-02-11", saturation: 0.95 },
    { date: "2024-02-12", saturation: 1.0 },
  ];

  const streak = 7;
  const complianceRate = 85;
  const daysUntilSaturated = 4;

  return (
    <div className="min-h-screen flex flex-col">
      <CreatineLog onExpandedChange={setIsExpanded} />
      {/* Sibling content only visible when the log is collapsed */}
      {!isExpanded && (
        <StatBoard
          saturationHistory={saturationHistory}
          streak={streak}
          complianceRate={complianceRate}
          daysUntilSaturated={daysUntilSaturated}
        />
      )}
    </div>
  );
}
