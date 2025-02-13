"use client";

import { useState } from "react";
// Import the ScrollArea from your shadcn UI package. Adjust the path as needed.
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  date: string; // "YYYY-MM-DD"
  logged: boolean;
}

const DAY_LETTERS = ["S", "M", "T", "W", "R", "F", "S"];
const TOTAL_WEEKS = 12; // 12 rows of Sunday->Saturday

// Convert a date string "YYYY-MM-DD" to a numeric day-of-month (1..31)
function getDayNumber(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDate();
}

// Convert a date string "YYYY-MM-DD" to a single-letter weekday
function getDayLetter(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return DAY_LETTERS[d.getDay()];
}

// Find the Sunday of the current week
function getThisSunday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, etc.
  const thisSunday = new Date(today);
  thisSunday.setDate(today.getDate() - dayOfWeek);
  return thisSunday;
}

// Generate an array of LogEntry for 12 weeks (Sunday to Saturday rows)
// The bottom row is the current week.
function generateLog(): LogEntry[] {
  const thisSunday = getThisSunday();
  // Go back 11 weeks to get the start Sunday
  const startSunday = new Date(thisSunday);
  startSunday.setDate(thisSunday.getDate() - 7 * (TOTAL_WEEKS - 1));

  const days: LogEntry[] = [];
  let current = new Date(startSunday);
  for (let i = 0; i < TOTAL_WEEKS * 7; i++) {
    days.push({
      date: current.toISOString().slice(0, 10),
      logged: false,
    });
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export default function CreatineLog() {
  // latestDate is the cutoff; days after this are considered future.
  const [latestDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [log, setLog] = useState<LogEntry[]>(generateLog());

  // Compute saturations for days on or before latestDate.
  function computeSaturations(entries: LogEntry[]): number[] {
    const saturations: number[] = [];
    for (let i = 0; i < entries.length; i++) {
      const { date, logged } = entries[i];
      if (date > latestDate) {
        saturations[i] = 0;
        continue;
      }
      if (i === 0) {
        saturations[0] = logged ? 1 : 0;
      } else {
        const prevSat = saturations[i - 1];
        saturations[i] = logged ? prevSat + 1 : Math.max(prevSat - 0.5, 0);
      }
    }
    return saturations;
  }

  const saturations = computeSaturations(log);

  // Toggle log only for days on or before latestDate.
  function toggleLog(index: number) {
    const day = log[index];
    if (day.date > latestDate) return;
    const newLog = [...log];
    newLog[index].logged = !newLog[index].logged;
    setLog(newLog);
  }

  // Map saturation value to a Tailwind background color.
  function getColorClass(sat: number): string {
    if (sat >= 5) return "bg-green-800";
    if (sat >= 4) return "bg-green-700";
    if (sat >= 3) return "bg-green-600";
    if (sat >= 2) return "bg-green-500";
    if (sat >= 1) return "bg-green-400";
    return "bg-gray-200";
  }

  // Split log into weeks (arrays of 7 LogEntry)
  const weeks: LogEntry[][] = [];
  for (let i = 0; i < log.length; i += 7) {
    weeks.push(log.slice(i, i + 7));
  }

  return (
    <div className="h-screen p-4">
      <ScrollArea className="h-full w-full border rounded" >
        <div className="space-y-2 p-2">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex justify-center space-x-2">
              {week.map((day, dIndex) => {
                const globalIndex = wIndex * 7 + dIndex;
                const sat = saturations[globalIndex];
                const isAfterLatest = day.date > latestDate;
                const baseClasses = "relative w-10 h-10 rounded border-3";
                const commonSpans = (
                  <>
                    {/* Top-right: Day number */}
                    <span className="absolute top-0 right-0 text-[5px] p-0.5 pointer-events-none">
                      {getDayNumber(day.date)}
                    </span>
                    {/* Boottom-left: Weekday letter */}
                    <span className="absolute bottom-0 left-0 text-[5px] p-0.5 pointer-events-none">
                      {getDayLetter(day.date)}
                    </span>
                  </>
                );
                return (
                  <div
                    key={day.date}
                    onClick={() => {
                      if (!isAfterLatest) toggleLog(globalIndex);
                    }}
                    title={
                      isAfterLatest
                        ? `${day.date} (No data)`
                        : `${day.date} - Sat: ${sat.toFixed(1)}`
                    }
                    className={`${baseClasses} ${
                      isAfterLatest
                        ? "bg-gray-100 opacity-25 cursor-not-allowed border-transparent"
                        : `${getColorClass(sat)} ${
                            log[globalIndex].logged
                              ? "border-green-700"
                              : "border-transparent"
                          } cursor-pointer`
                    }`}
                  >
                    {commonSpans}
                    {/* Centered saturation (only for days on or before latestDate) */}
                    {!isAfterLatest && sat != 0 && (
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold pointer-events-none">
                        {sat.toFixed(1)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
