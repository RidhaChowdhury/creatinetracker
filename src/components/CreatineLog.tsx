"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  date: string;
  logged: boolean;
}

const DAY_LETTERS = ["S", "M", "T", "W", "R", "F", "S"];
const TOTAL_WEEKS = 24;
const COMPACT_WEEKS = 8;

function getDayNumber(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDate();
}

function getDayLetter(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return DAY_LETTERS[d.getDay()];
}

function getThisSunday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const thisSunday = new Date(today);
  thisSunday.setDate(today.getDate() - dayOfWeek);
  return thisSunday;
}

function generateLog(): LogEntry[] {
  const thisSunday = getThisSunday();
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

function computeSaturations(entries: LogEntry[], latestDate: string): number[] {
  const saturations: number[] = [];
  const k = 0.1;
  const d = 0.02;
  for (let i = 0; i < entries.length; i++) {
    const { date, logged } = entries[i];
    if (date > latestDate) {
      saturations[i] = 0;
      continue;
    }
    if (i === 0) {
      saturations[0] = logged ? k : 0;
    } else {
      const prev = saturations[i - 1];
      saturations[i] = logged
        ? Math.min(prev + k * (1 - prev), 1)
        : prev * (1 - d);
    }
  }
  return saturations;
}

function getColorClass(sat: number): string {
  if (sat < 0.1) return "bg-gray-200";
  if (sat < 0.2) return "bg-green-300";
  if (sat < 0.4) return "bg-green-400";
  if (sat < 0.6) return "bg-green-500";
  if (sat < 0.8) return "bg-green-600";
  return "bg-green-700";
}

function buildWeeksArray(log: LogEntry[]): LogEntry[][] {
  const weeks: LogEntry[][] = [];
  for (let i = 0; i < log.length; i += 7) {
    weeks.push(log.slice(i, i + 7));
  }
  return weeks;
}

export default function CreatineLog({
  onExpandedChange,
}: {
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [latestDate] = useState(new Date().toISOString().slice(0, 10));
  const [log, setLog] = useState(generateLog());
  const saturations = computeSaturations(log, latestDate);
  const allWeeks = buildWeeksArray(log);
  const displayedWeeks = isExpanded
    ? allWeeks
    : allWeeks.slice(allWeeks.length - COMPACT_WEEKS);

  function toggleLog(index: number) {
    const day = log[index];
    if (day.date > latestDate) return;
    const newLog = [...log];
    newLog[index].logged = !newLog[index].logged;
    setLog(newLog);
  }

  function toggleExpand() {
    const nextVal = !isExpanded;
    setIsExpanded(nextVal);
    onExpandedChange?.(nextVal);
  }

  // Shared grid content
  const grid = (
    <LogGrid
      weeks={displayedWeeks}
      saturations={saturations}
      latestDate={latestDate}
      log={log}
      toggleLog={toggleLog}
    />
  );

  // Shared button
  const button = (
    <button
      onClick={toggleExpand}
      className="px-4 py-2 border rounded bg-blue-50 hover:bg-blue-100"
    >
      {isExpanded ? "Collapse to Last 4 Weeks" : "Expand Full 12 Weeks"}
    </button>
  );

  if (isExpanded) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full w-full">
            {grid}
            {/* Extra bottom padding to ensure grid content is not hidden */}
            {/* <div className="pb-20" /> */}
          </ScrollArea>
        </div>
        <div className="sticky bottom-0 left-0 w-full bg-white p-2 flex justify-center">
          {button}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="border rounded">{grid}</div>
      <div className="p-2 text-center">{button}</div>
    </div>
  );
}

function LogGrid({
  weeks,
  saturations,
  latestDate,
  log,
  toggleLog,
}: {
  weeks: LogEntry[][];
  saturations: number[];
  latestDate: string;
  log: LogEntry[];
  toggleLog: (index: number) => void;
}) {
  return (
    <div className="space-y-2 p-2">
      {weeks.map((week, wIndex) => (
        <div key={wIndex} className="flex justify-center space-x-2">
          {week.map((day, dIndex) => {
            const globalIndex = wIndex * 7 + dIndex;
            const sat = saturations[globalIndex];
            const isAfterLatest = day.date > latestDate;
            const baseClasses = "relative w-10 h-10 rounded border-2";
            return (
              <div
                key={day.date}
                onClick={() => {
                  if (!isAfterLatest) toggleLog(globalIndex);
                }}
                title={
                  isAfterLatest
                    ? `${day.date} (No data)`
                    : `${day.date} - Saturation: ${(sat * 100).toFixed(0)}%`
                }
                className={
                  isAfterLatest
                    ? `bg-gray-100 opacity-25 cursor-not-allowed border-transparent ${baseClasses}`
                    : `${getColorClass(sat)} ${
                        log[globalIndex].logged
                          ? "border-blue-400"
                          : "border-transparent"
                      } cursor-pointer ${baseClasses}`
                }
              >
                <span className="absolute top-0 right-0 text-[5px] p-0.5 pointer-events-none">
                  {getDayNumber(day.date)}
                </span>
                <span className="absolute bottom-0 left-0 text-[5px] p-0.5 pointer-events-none">
                  {getDayLetter(day.date)}
                </span>
                {!isAfterLatest && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold pointer-events-none">
                    {sat !== 0 && `${(sat * 100).toFixed(0)}%`}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
