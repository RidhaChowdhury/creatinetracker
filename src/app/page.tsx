"use client";

import { useState } from "react";

interface LogEntry {
  date: string;
  logged: boolean;
}

function generateInitialLog(): LogEntry[] {
  const today = new Date();
  const days: LogEntry[] = [];
  // Create 84 days (oldest first)
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      date: d.toISOString().slice(0, 10),
      logged: false,
    });
  }
  return days;
}

export default function CreatineLog() {
  const [log, setLog] = useState<LogEntry[]>(generateInitialLog());

  // Toggle the log status for a day.
  const toggleLog = (index: number): void => {
    const newLog = [...log];
    newLog[index].logged = !newLog[index].logged;
    setLog(newLog);
  };

  // Compute the consecutive streak ending at the given day.
  const computeStreak = (index: number): number => {
    let streak = 0;
    for (let i = index; i >= 0; i--) {
      if (log[i].logged) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Map the streak count to a Tailwind background color.
  const getColorClass = (streak: number): string => {
    if (streak >= 5) return "bg-green-800";
    if (streak === 4) return "bg-green-700";
    if (streak === 3) return "bg-green-600";
    if (streak === 2) return "bg-green-500";
    if (streak === 1) return "bg-green-400";
    return "bg-gray-200";
  };

  // Break the log into weeks (7 days per row)
  const weeks: LogEntry[][] = [];
  for (let i = 0; i < log.length; i += 7) {
    weeks.push(log.slice(i, i + 7));
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Creatine Intake Tracker
      </h1>
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex justify-center space-x-2">
            {week.map((day, dayIndex) => {
              const globalIndex = weekIndex * 7 + dayIndex;
              const streak = computeStreak(globalIndex);
              return (
                <div
                  key={day.date}
                  className={`w-10 h-10 flex items-center justify-center cursor-pointer border-2 rounded 
                    ${day.logged ? "border-green-500" : "border-transparent"} 
                    ${getColorClass(streak)}`}
                  onClick={() => toggleLog(globalIndex)}
                  title={day.date}
                >
                  {day.logged && streak > 0 ? streak : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Click a square to toggle your creatine intake for that day.
      </p>
    </div>
  );
}
