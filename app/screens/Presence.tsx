import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions, TextInput, } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { DataTable, RadioButton, } from "react-native-paper";
import { colors } from "../component/Constant";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import Modal from "react-native-modal";
import * as Sqlite from 'expo-sqlite';

const Presence = ({ route, navigation }: { route: any; navigation: any }) => {
  let db = Sqlite.openDatabase('Leiknach.db');
  const screenWidth = Dimensions.get("window").width;
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;
  const { session_id } = route.params;
  const { checkAttendance } = route.params;

  // Database functions
  useEffect(() => {
    db.transaction((txn) => {
      // Create the table 'table_presence'
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_presence'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_presence', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_presence (presence_id INTEGER PRIMARY KEY AUTOINCREMENT,state TEXT CHECK(state IN ("P", "Ab", "JA")),comment TEXT, class_id INTEGER,group_id INTEGER,session_id INTEGER,student_id INTEGER,FOREIGN KEY (class_id) REFERENCES table_class(class_id) ON DELETE CASCADE,FOREIGN KEY (group_id) REFERENCES table_group(group_id) ON DELETE CASCADE,FOREIGN KEY (session_id) REFERENCES table_session(session_id) ON DELETE CASCADE,FOREIGN KEY (student_id) REFERENCES table_students(student_id) ON DELETE CASCADE)',
              []
            );
            console.log('Created table_presence');
          } else {
            console.log('Table_presence already exists');
          }
        }
      );
    });
  }, []);
  // Model for add new session
  const [isModalPresenceVisible, setModalPresenceVisible] = useState(false);
  // Toggle model for add new session
  const toggleModalPresence = () => {
    setModalPresenceVisible(!isModalPresenceVisible);
  };
  const handleSavePresence = async () => {
    // this alert just for test , replace with the name of function that add new session
    Alert.alert("Presence !! Just Test");
    toggleModalPresence();
  };

  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(
    null
  );
  const renderConsultAttendanc = ({ item }: { item: StudentItem }) => (
    <View
      style={{
        backgroundColor: colors.light,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 7,
        borderRadius: 16,
        marginVertical: 16,
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setSelectedStudent(item);
          setModalPresenceVisible(true);
        }}
        style={{
          flexDirection: "row",
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 30,
          paddingBottom: 30,
        }}
      >
        <Text style={{ flex: 1 }}>{item.student_lastName} {item.student_firstName}
          {'\n'}
          <Text style={{ color: 'green' }}>Present</Text>
          {'\n'}
          <Text style={{ color: colors.gray }}>
            Lorem ipsum, dolor sit amet consectetued cum explicabo qui assumenda.
          </Text>

        </Text>
      </TouchableOpacity>
    </View>

  );

  // For Flatlist of check Attendance
  const [selectedStatus, setSelectedStatus] = useState('P');
  const [selectedStatusMap, setSelectedStatusMap] = useState<Record<string, string>>({}); // Map to store selectedStatus for each student
  const handleRadioButtonChange = (studentId: string, value: string) => {
    setSelectedStatusMap((prevMap) => ({
      ...prevMap,
      [studentId]: value,
    }));
  };
  const handleCommentChange = (studentId: string, text: string) => {
    setCommentMap((prevMap) => ({
      ...prevMap,
      [studentId]: text,
    }));
  };
  interface SaveButtonItem {
    id: string;
  }
  const renderStudentItem = ({ item }: { item: StudentItem | SaveButtonItem }) => {
    if ('student_id' in item) {
      return (
        <View style={{ backgroundColor: colors.light, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16 }}>
          <View style={{ flex: 1, padding: 15 }}>
            <Text style={{ fontWeight: 'bold', color: 'black' }}>{item.student_lastName} {item.student_firstName}</Text>
            <RadioButton.Group
              onValueChange={(value) => handleRadioButtonChange(item.student_id, value)}
              value={selectedStatusMap[item.student_id]}
            >
              <View style={{ flexDirection: 'row' }}>
                <RadioButton.Item label="P" value="P" />
                <RadioButton.Item label="Ab" value="Ab" />
              </View>
            </RadioButton.Group>
            <TextInput
              style={{ height: 40, borderColor: "gray", backgroundColor: "#fff", borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, borderRadius: 10, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, }}
              placeholder="Enter Comment ..."
              value={commentMap[item.student_id] || ''}
              onChangeText={(text) => handleCommentChange(item.student_id, text)}
            />
          </View>
        </View>
      );
    } else {
      return renderSaveButton();
    }
  };

  const renderSaveButton = () => (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        onPress={checkPresence}
        style={[{ backgroundColor: colors.primary, padding: 10, borderRadius: 5, margin: 20, alignItems: 'center', width: '40%' }]}>
        <Text style={{ color: colors.light }}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  // Check Attendance

  const [commentMap, setCommentMap] = useState<Record<string, string>>({}); // Map to store comments for each student
  const checkPresence = () => {
    const dataToInsert = studentList.map((student) => ({
      studentId: student.student_id,
      status: selectedStatusMap[student.student_id] || 'P', // Default to 'P' if not set
      comment: commentMap[student.student_id] || '',
    }));
    let insert = true;
    // Insert data into the table_presence
    db.transaction((tx) => {
      dataToInsert.forEach(({ studentId, status, comment }) => {
        tx.executeSql(
          'INSERT INTO table_presence (state, comment, class_id, group_id, session_id, student_id) VALUES (?, ?, ?, ?, ?, ?)',
          [status, comment, class_id, group_id, session_id, studentId],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              insert=true;
            } else {
              console.log(`Failed to insert data for student ${studentId}`);
              Alert.alert('Error')
            }
          }
        );
      });
    });
    if (insert) {
      console.log(`Data inserted successfully for student`);
      Alert.alert('Data inserted successfully for student')
    } else {
      console.log(`Failed to insert data for student `);
      Alert.alert('Error')
    }
  };




  // fetch all data student from sqlite db
  interface StudentItem {
    student_id: string;
    student_firstName: string;
    student_lastName: string;
    class_id: number;
    group_id: number;
  }
  const [studentList, setStudentList] = useState<StudentItem[]>([]);
  const fetchStusent = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_students WHERE group_id=?',
        [group_id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            console.log(results.rows.item(i));
            temp.push(results.rows.item(i));
          }
          setStudentList(temp);
        }
      );
    });
  }
  useEffect(() => {
    fetchStusent();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      {/* header  */}
      <View style={{ flexDirection: "row" }}>
        <Ionicons
          name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
          onPress={() => navigation.navigate("Group", { class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level, })}
        />
        <Text style={{ flex: 1, fontSize: 25, fontWeight: "700" }}> Check Attendance </Text>
      </View>
      {checkAttendance ? (
        // checkAttendance = true
        <View>
          {/* Search Section */}
          <View style={styles.viewSearch}>
            <Ionicons name="search-outline" size={24} color={colors.primary} />
            <TextInput
              style={{ paddingLeft: 8, fontSize: 16 }}
              placeholder="Search for Student..."
            />
          </View>

          {/* add pie chart  */}

          {/* consult the attendance state per session (P, Ab, JA , C */}
          <View style={{ marginTop: 22 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}> Consult Attendance</Text>
            <View >
              <FlatList
                data={studentList}
                renderItem={renderConsultAttendanc}
                keyExtractor={(item) => item.student_id.toString()}
              />
              {selectedStudent && (
                <Modal
                  isVisible={isModalPresenceVisible}
                  onBackdropPress={() => setModalPresenceVisible(false)}
                >
                  <View style={styles.modalContent}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      {selectedStudent.student_lastName}{" "}
                      {selectedStudent.student_firstName}
                    </Text>
                    <View>
                      <Text
                        style={{
                          marginTop: 5,
                          marginBottom: 5,
                          fontWeight: "600",
                        }}
                      >
                        State:
                      </Text>
                    </View>
                    <RadioButton.Group
                      onValueChange={(value) => setSelectedStatus(value)}
                      value={selectedStatus}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <RadioButton.Item label="P" value="p" />
                        <RadioButton.Item label="Ab" value="ab" />
                        <RadioButton.Item label="JA" value="JA" />
                      </View>
                    </RadioButton.Group>
                    <View>
                      <Text
                        style={{
                          marginTop: 5,
                          marginBottom: 5,
                          fontWeight: "600",
                        }}
                      >
                        Comment:
                      </Text>
                    </View>
                    <TextInput
                      style={[styles.modalInput, { width: "100%" }]}
                      placeholder="Enter comment"
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 100,
                      }}
                    >
                      <TouchableOpacity
                        onPress={handleSavePresence}
                        style={{
                          backgroundColor: colors.primary,
                          padding: 10,
                          borderRadius: 5,
                          marginTop: 10,
                          alignItems: "center",
                          margin: 3,
                          left: 16,
                        }}
                      >
                        <Text style={styles.buttonTexts}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={toggleModalPresence}
                        style={{
                          backgroundColor: colors.primary,
                          padding: 10,
                          borderRadius: 5,
                          marginTop: 10,
                          alignItems: "center",
                          margin: 3,
                          left: 16,
                        }}
                      >
                        <Text style={styles.buttonTexts}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          </View>
        </View>
      ) : (
        // checkAttendance= false
        <View style={{ flex: 1, }}>
          <View style={{ marginTop: 22, flex: 1, }}>

            <FlatList
              data={[...studentList, { id: 'saveButton' }]}
              renderItem={renderStudentItem}
              keyExtractor={(item, index) => ('student_id' in item) ? item.student_id : item.id}
            />

          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Presence;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 5,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    backgroundColor: "#fff",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonEdit: {
    justifyContent: "center",
    alignItems: "center",
    // width: 200,
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    margin: 15,
    width: ScreenWidth * 0.4,
  },
  buttonTexts: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  viewSearch: {
    backgroundColor: colors.light,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginVertical: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
  },
});
