"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LogWeek from "./LogWeek";
import {
  generateLog,
  computeSaturations,
  LogEntry,
} from "@/lib/creatineLogUtils";

export default function CreatineLog() {
  const [latestDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [log, setLog] = useState<LogEntry[]>(generateLog());
  const saturations = computeSaturations(log, latestDate);

  function toggleLog(index: number) {
    const day = log[index];
    if (day.date > latestDate) return;
    const newLog = [...log];
    newLog[index].logged = !newLog[index].logged;
    setLog(newLog);
  }

  const weeks: LogEntry[][] = [];
  for (let i = 0; i < log.length; i += 7) {
    weeks.push(log.slice(i, i + 7));
  }

  return (
    <div className="h-screen p-4">
      <ScrollArea className="h-full w-full border rounded">
        <div className="space-y-2 p-2">
          {weeks.map((week, wIndex) => (
            <LogWeek
              key={wIndex}
              week={week}
              saturations={saturations.slice(wIndex * 7, wIndex * 7 + 7)}
              latestDate={latestDate}
              baseIndex={wIndex * 7}
              toggleLog={toggleLog}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
