"use client";
import { getDayNumber, getDayLetter } from "@/lib/creatineLogUtils";
import { LogEntry } from "@/lib/creatineLogUtils";

interface LogDayProps {
  day: LogEntry;
  saturation: number;
  latestDate: string;
  onClick: () => void;
}

export default function LogDay({
  day,
  saturation,
  latestDate,
  onClick,
}: LogDayProps) {
  const isAfterLatest = day.date > latestDate;
  const baseClasses = "relative w-10 h-10 rounded border-3";

  function getColorClass(sat: number): string {
    if (sat < 0.1) return "bg-gray-200";
    const clampedSat = Math.max(0, Math.min(sat, 1));
    const shade = Math.round((300 + 400 * clampedSat) / 100) * 100;
    return `bg-green-${shade}`;
  }

  return (
    <div
      onClick={() => {
        if (!isAfterLatest) onClick();
      }}
      title={
        isAfterLatest
          ? `${day.date} (No data)`
          : `${day.date} - Saturation: ${(saturation * 100).toFixed(0)}%`
      }
      className={`${baseClasses} ${
        isAfterLatest
          ? "bg-gray-100 opacity-25 cursor-not-allowed border-transparent"
          : `${getColorClass(saturation)} ${
              day.logged ? "border-blue-400" : "border-transparent"
            } cursor-pointer`
      }`}
    >
      <span className="absolute top-0 right-0 text-[5px] p-0.5 pointer-events-none">
        {getDayNumber(day.date)}
      </span>
      <span className="absolute bottom-0 left-0 text-[5px] p-0.5 pointer-events-none">
        {getDayLetter(day.date)}
      </span>
      {!isAfterLatest && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold pointer-events-none">
          {saturation !== 0 && `${(saturation * 100).toFixed(0)}%`}
        </span>
      )}
    </div>
  );
}
