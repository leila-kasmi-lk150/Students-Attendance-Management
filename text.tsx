import React from 'react';
import { Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../component/Constant';

interface AttendancePieChartProps {
  data: { name: string; value: number }[];
}

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};

const AttendancePieChart: React.FC<AttendancePieChartProps> = ({ data }) => {
  return (
    <>
      <Text>Pie Chart for Attendance States</Text>
      <PieChart
        data={data}
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



// Import other necessary dependencies

const Presence: React.FC<Props> = ({ route, navigation }) => {
  // ... Other code ...

  const [attendanceData, setAttendanceData] = useState<{ name: string; value: number }[]>([]);

  // Fetch and process attendance data for the selected session
  const fetchAttendanceData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT state, COUNT(*) as count FROM table_presence WHERE session_id=? GROUP BY state',
        [session_id],
        (tx, results) => {
          const data = results.rows._array as { state: string; count: number }[];
          const processedData = data.map((item) => ({ name: item.state, value: item.count }));
          setAttendanceData(processedData);
        }
      );
    });
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [session_id]);

  // ... Other code ...

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      {/* ... Other code ... */}
      {checkAttendance ? (
        // ... Other code ...
        <View style={{ marginTop: 22, flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Consult Attendance</Text>
          <View>
            <FlatList
              data={presenceList}
              renderItem={renderConsultAttendance}
              keyExtractor={(item) => item.student_id.toString()}
            />
            {selectedStudent && (
              <Modal
                isVisible={isModalPresenceVisible}
                onBackdropPress={() => setModalPresenceVisible(false)}>
                <View style={styles.modalContent}>
                  {/* ... Other code ... */}
                  <AttendancePieChart data={attendanceData} />
                  {/* ... Other code ... */}
                </View>
              </Modal>
            )}
          </View>
        </View>
      ) : (
        // ... Other code ...
      )}
    </SafeAreaView>
  );
};

export default Presence;
