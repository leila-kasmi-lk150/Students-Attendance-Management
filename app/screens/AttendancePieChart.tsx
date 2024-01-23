import { Text, View, } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Sqlite from 'expo-sqlite';
import { PieChart } from 'react-native-chart-kit';
const AttendancePieChart = ({ route, navigation }: { route: any; navigation: any }) => {
  let db = Sqlite.openDatabase('Leiknach.db');
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;
  const { session_id } = route.params;

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };


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
  const getState = (state: string): string => {
    switch (state) {
      case 'P':
        return 'Present'; // Green for Present
      case 'Ab':
        return 'Absent'; // Red for Absent
      case 'JA':
        return 'Justified'; // Orange for Justified Absence
      default:
        return 'unknown state'; // Default to black for unknown states
    }
  };
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
            name: getState(item.state),
            value: item.count,
            color: getColorForState(item.state),
          }));
          setAttendanceData(processedData);
        }
      );
    });
  };

  // Fetch attendance data when the component mounts
  useEffect(() => {
    fetchAttendanceData();
  }, [session_id]);

  const AttendancePieChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
    // ... (AttendancePieChart component code)

    return (
      <View style={{ marginTop: 40}}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Pie Chart for Attendance States</Text>
        <PieChart
          data={data}
          width={300}
          height={200}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      {/* header  */}
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
          onPress={() => navigation.navigate('PresenceScreens', { session_id: session_id, group_id: group_id, group_name: group_name, group_type: group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}

        />
        <Text style={{ flex: 1, fontSize: 20, fontWeight: '700' }}>{class_name} {group_name} {group_type}</Text>
      </View>

      {/* add pie chart  */}
      <AttendancePieChart data={attendanceData} />
    </SafeAreaView>
  );
};

export default AttendancePieChart;
