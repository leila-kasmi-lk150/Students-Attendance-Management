import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../component/Constant';
import * as Sqlite from 'expo-sqlite';

interface AttendancePieChartProps {
  session_id: number;
}

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};

const AttendancePieChart: React.FC<AttendancePieChartProps> = ({ session_id }) => {
  const db = Sqlite.openDatabase('Leiknach.db');
  const [attendanceData, setAttendanceData] = useState<{ name: string; value: number; color: string }[]>([]);

  // Fetch and process attendance data for the selected session
  const fetchAttendanceData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT state, COUNT(*) as count FROM table_presence WHERE session_id=? GROUP BY state',
        [session_id],
        (tx, results) => {
          const data = results.rows._array as { state: string; count: number }[];
          const processedData = data.map((item) => ({
            name: item.state,
            value: item.count,
            color: getColorForState(item.state),
          }));
          setAttendanceData(processedData);
        }
      );
    });
  };

  // Function to get color based on attendance state
  const getColorForState = (state: string): string => {
    switch (state) {
      case 'P':
        return '#2ecc71'; // Green for Present
      case 'Ab':
        return '#e74c3c'; // Red for Absent
      case 'JA':
        return '#f39c12'; // Orange for Justified Absence
      default:
        return '#000000'; // Default to black for unknown states
    }
  };

  // Fetch attendance data when the component mounts
  useEffect(() => {
    fetchAttendanceData();
  }, [session_id]);

  return (
    <>
      <Text>Pie Chart for Attendance States</Text>
      <PieChart
        data={attendanceData}
        width={300}
        height={200}
        chartConfig={chartConfig}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </>
  );
};

export default AttendancePieChart;
