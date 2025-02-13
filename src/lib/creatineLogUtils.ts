export interface LogEntry {
  date: string;
  logged: boolean;
}

export const DAY_LETTERS = ["S", "M", "T", "W", "R", "F", "S"];
export const TOTAL_WEEKS = 12;

/** Returns the day-of-month from a "YYYY-MM-DD" string */
export function getDayNumber(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDate();
}

/** Returns the weekday letter from a "YYYY-MM-DD" string */
export function getDayLetter(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return DAY_LETTERS[d.getDay()];
}

/** Returns the Sunday of the current week */
export function getThisSunday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const thisSunday = new Date(today);
  thisSunday.setDate(today.getDate() - dayOfWeek);
  return thisSunday;
}

/** Generates log entries for TOTAL_WEEKS full weeks */
export function generateLog(): LogEntry[] {
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

/** Computes saturation values based on log entries and a cutoff date */
export function computeSaturations(
  entries: LogEntry[],
  latestDate: string
): number[] {
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
      saturations[0] = logged ? k * (1 - 0) : 0;
    } else {
      const prev = saturations[i - 1];
      saturations[i] = logged
        ? Math.min(prev + k * (1 - prev), 1)
        : prev * (1 - d);
    }
  }
  return saturations;
}
