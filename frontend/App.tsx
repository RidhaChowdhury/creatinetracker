import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { LogDay } from 'components/LogDay';
import { LogWeek } from 'components/LogWeek';

import './global.css';

export default function App() {
  return (
    <>
      <LogWeek
        week={[
          { date: '2023-01-01', logged: false },
          { date: '2023-01-02', logged: false },
          { date: '2023-01-03', logged: false },
          { date: '2023-01-04', logged: false },
          { date: '2023-01-05', logged: false },
          { date: '2023-01-06', logged: false },
          { date: '2023-01-07', logged: false },
        ]}
        saturations={[0, 0, 0, 0, 0, 0, 0]}
        latestDate="2023-01-01"
        baseIndex={0}
        toggleLog={() => {}}
      />
      <StatusBar style="auto" />
    </>
  );
}
