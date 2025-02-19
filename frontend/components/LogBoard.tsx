import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { LogWeek } from './LogWeek';

interface LogEntry {
  date: string;
  logged: boolean;
}

/** A prop for toggling expansion externally, if needed. */
interface LogBoardProps {
  onExpandedChange?: (expanded: boolean) => void;
}

function getDayNumber(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDate();
}

function getDayLetter(dateStr: string) {
  const DAY_LETTERS = ['S', 'M', 'T', 'W', 'R', 'F', 'S'];
  const d = new Date(dateStr + 'T00:00:00');
  return DAY_LETTERS[d.getDay()];
}

/** Get the Sunday of the current week. */
function getThisSunday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const thisSunday = new Date(today);
  thisSunday.setDate(today.getDate() - dayOfWeek);
  return thisSunday;
}

/** Build a 24-week log. */
function generateLog(): LogEntry[] {
  const TOTAL_WEEKS = 24;
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

function computeSaturations(entries: LogEntry[], latestDate: string) {
  const saturations: number[] = [];
  const k = 0.1; // growth factor on logging
  const d = 0.02; // decay factor on non-logging

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
      saturations[i] = logged ? Math.min(prev + k * (1 - prev), 1) : prev * (1 - d);
    }
  }

  return saturations;
}

/** Slice the entire log array into 7-day chunks. */
function buildWeeksArray(log: LogEntry[]) {
  const weeks: LogEntry[][] = [];
  for (let i = 0; i < log.length; i += 7) {
    weeks.push(log.slice(i, i + 7));
  }
  return weeks;
}

export function LogBoard({ onExpandedChange }: LogBoardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Example of "today" used as the latest date
  const [latestDate] = useState(new Date().toISOString().slice(0, 10));

  const [log, setLog] = useState<LogEntry[]>(() => generateLog());
  const saturations = computeSaturations(log, latestDate);
  const allWeeks = buildWeeksArray(log);

  const COMPACT_WEEKS = 4;
  const displayedWeeks = isExpanded ? allWeeks : allWeeks.slice(allWeeks.length - COMPACT_WEEKS);

  function toggleLog(index: number) {
    const day = log[index];
    if (day.date > latestDate) return;
    const newLog = [...log];
    newLog[index].logged = !newLog[index].logged;
    setLog(newLog);
  }

  function toggleExpand() {
    const newVal = !isExpanded;
    setIsExpanded(newVal);
    onExpandedChange?.(newVal);
  }

  const expandLabel = isExpanded ? 'Collapse to Last 4 Weeks' : 'Expand Full 24 Weeks';

  // Expanded mode with a scrollable area for all weeks
  if (isExpanded) {
    return (
      <View className="flex-1">
        <ScrollView className="flex-1 p-2">
          {displayedWeeks.map((week, wIndex) => {
            const globalWeekIndex = allWeeks.length - displayedWeeks.length + wIndex;
            const baseIndex = globalWeekIndex * 7;
            return (
              <LogWeek
                key={globalWeekIndex}
                week={week}
                saturations={saturations}
                latestDate={latestDate}
                baseIndex={baseIndex}
                toggleLog={toggleLog}
              />
            );
          })}
        </ScrollView>

        <View className="items-center border-t border-gray-300 bg-white p-2">
          <Pressable
            onPress={toggleExpand}
            className="rounded border border-blue-200 bg-blue-50 px-4 py-2">
            <Text>{expandLabel}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Compact mode: only last 4 weeks, no scroll
  return (
    <View className="p-4">
      <View className="rounded border border-gray-300 p-2">
        {displayedWeeks.map((week, wIndex) => {
          const globalWeekIndex = allWeeks.length - displayedWeeks.length + wIndex;
          const baseIndex = globalWeekIndex * 7;
          return (
            <LogWeek
              key={globalWeekIndex}
              week={week}
              saturations={saturations}
              latestDate={latestDate}
              baseIndex={baseIndex}
              toggleLog={toggleLog}
            />
          );
        })}
      </View>

      <View className="items-center p-2">
        <Pressable
          onPress={toggleExpand}
          className="rounded border border-blue-200 bg-blue-50 px-4 py-2">
          <Text>{expandLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}
