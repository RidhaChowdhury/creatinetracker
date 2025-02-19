import { View } from 'react-native';
import { LogDay } from './LogDay';
import { LogEntry } from '../lib/creatineLogUtils';

interface LogWeekProps {
  week: LogEntry[];
  saturations: number[];
  latestDate: string;
  baseIndex: number;
  toggleLog: (index: number) => void;
}

export function LogWeek({ week, saturations, latestDate, baseIndex, toggleLog }: LogWeekProps) {
  return (
    <View className="flex flex-row justify-center space-x-2">
      {week.map((day, index) => (
        <LogDay
          key={day.date}
          day={day}
          saturation={saturations[index]}
          latestDate={latestDate}
          onClick={() => toggleLog(baseIndex + index)}
        />
      ))}
    </View>
  );
}
