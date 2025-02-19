import { Pressable, Text } from 'react-native';
import { LogEntry, getDayNumber, getDayLetter } from '../lib/creatineLogUtils';

interface LogDayProps {
  day: LogEntry;
  saturation: number;
  latestDate: string;
  onClick: () => void;
}

export function LogDay({ day, saturation, latestDate, onClick }: LogDayProps) {
  const isAfterLatest = day.date > latestDate;
  const baseClasses = 'relative w-10 h-10 rounded border-[3px]';

  function getColorClass(sat: number) {
    if (sat < 0.1) return 'bg-gray-200';
    const clampedSat = Math.max(0, Math.min(sat, 1));
    const shade = Math.round((300 + 400 * clampedSat) / 100) * 100;
    return `bg-green-${shade}`;
  }

  const dynamicClasses = isAfterLatest
    ? 'bg-gray-100 opacity-25 border-transparent'
    : `${getColorClass(saturation)} ${day.logged ? 'border-blue-400' : 'border-transparent'}`;

  return (
    <Pressable
      onPress={() => {
        if (!isAfterLatest) onClick();
      }}
      className={`${baseClasses} ${dynamicClasses}`}
      android_ripple={{ borderless: true }}>
      <Text className="absolute right-0 top-0 p-0.5 text-[5px]">
        {getDayNumber(day.date)}
      </Text>
      <Text className="absolute bottom-0 left-0 p-0.5 text-[5px]">
        {getDayLetter(day.date)}
      </Text>
      {!isAfterLatest && saturation !== 0 && (
        <Text
          className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {`${(saturation * 100).toFixed(0)}%`}
        </Text>
      )}
    </Pressable>
  );
}
