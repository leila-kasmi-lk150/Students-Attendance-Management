import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput, } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {  RadioButton, } from "react-native-paper";
import { colors } from "../component/Constant";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import Modal from "react-native-modal";
import * as Sqlite from 'expo-sqlite';
const Presence = ({ route, navigation }: { route: any; navigation: any }) => {
  let db = Sqlite.openDatabase('Leiknach.db');
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;
  const { session_id } = route.params;
  // Database functions
  useEffect(() => {
    db.transaction((txn) => {
      // Create the table 'table_presence'
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_presence'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_presence', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_presence (presence_id INTEGER PRIMARY KEY AUTOINCREMENT,state VARCHAR(4),comment TEXT, class_id INTEGER,group_id INTEGER,session_id INTEGER,student_id INTEGER,FOREIGN KEY (class_id) REFERENCES table_class(class_id) ON DELETE CASCADE,FOREIGN KEY (group_id) REFERENCES table_group(group_id) ON DELETE CASCADE,FOREIGN KEY (session_id) REFERENCES table_session(session_id) ON DELETE CASCADE,FOREIGN KEY (student_id) REFERENCES table_students(student_id) ON DELETE CASCADE)',
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
    try {
      // Update the presenceList with the new state and comment
      setPresenceList((prevList) =>
        prevList.map((item) =>
          item.student_id === selectedStudent?.student_id
            ? { ...item, state: selectedStatus, comment: comment || null }
            : item
        )
      );

      // Update the data in the SQLite database
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE table_presence SET state=?, comment=? WHERE student_id=? AND session_id=?',
          [selectedStatus, comment, selectedStudent?.student_id, session_id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert('Data updated successfully in the database');
            } 
          }
        );
      });

      // Close the modal
      toggleModalPresence();


    } catch (error) {
      console.error(error);
      Alert.alert("Failed to save presence");
    }
  };


  // For Flatlist of Consulte Attendance
  var [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<PresenceItem | null>(null);
  const renderConsultAttendanc = ({ item }: { item: PresenceItem }) => (
    <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: "center", }}>
      <TouchableOpacity
        onPress={() => {
          setSelectedStudent(item);
          setComment(item.comment);
          setSelectedStatus(item.state); 
          setModalPresenceVisible(true);
        }}
        style={{ flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30, }}
      >
        <Text style={{ flex: 1 }}>{item.student_lastName} {item.student_firstName}
          {'\n'}
          <Text style={{ color: item.state === 'P' ? 'green' : item.state === 'Ab' ? 'red' : item.state === 'JA' ? 'orange' : 'black' }}>
            {item.state === 'P' ? 'Present' : item.state === 'Ab' ? 'Absent' : item.state === 'JA' ? 'Justified Absence' : 'Unknown State'}
          </Text>

          {'\n'}
          <Text style={{ color: colors.gray }}>{item.comment}</Text>

        </Text>
      </TouchableOpacity>
    </View>

  );

  const [comment, setComment] = useState<string | null | undefined>('');

  // fetch all data Attendance state of student from sqlite db
  interface PresenceItem {
    session_id: number; // Assuming session_id is numerical
    comment: string | null; // Allow for null comments
    state: string;
    student_id: number; // Assuming student_id is numerical
    student_firstName: string;
    student_lastName: string;
    class_id: number;
    group_id: number;
  }

  // serach 
  const [searchText, setSearchText] = useState('');
  const searchStudent = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT TS.student_id, TS.student_firstName, TS.student_lastName, TP.comment, TP.state, TP.class_id, TP.group_id FROM table_students TS LEFT JOIN table_presence TP ON TS.student_id = TP.student_id AND TP.session_id = ? WHERE (TS.student_firstName LIKE ? OR TS.student_lastName LIKE ? ) AND TP.session_id=?',
        [session_id, `%${searchText}%`, `%${searchText}%`, session_id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));

          }
          setPresenceList(temp);
        }
      );
    });
  };

  useEffect(() => {
    searchStudent();
  }, [searchText]);
  const [presenceList, setPresenceList] = useState<PresenceItem[]>([]);
  const fetchPresence = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT TS.student_id, TS.student_firstName, TS.student_lastName, TP.comment, TP.state, TP.class_id, TP.group_id FROM table_students TS LEFT JOIN table_presence TP ON TS.student_id = TP.student_id AND TP.session_id = ? WHERE TP.session_id=?',
        [session_id, session_id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));

          }
          setPresenceList(temp);
        }
      );
    });
    setSearchText('');
  };
  // For Flatlist of check Attendance
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
              // value={selectedStatusMap[item.student_id]}
              value={selectedStatusMap[item.student_id] || 'P'}
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

  const checkPresence = async () => {
    try {
      const dataToInsert = studentList.map((student) => ({
        studentId: student.student_id,
        status: selectedStatusMap[student.student_id] || 'P',
        comment: commentMap[student.student_id] || '',
      }));

      const insertPromises = dataToInsert.map(({ studentId, status, comment }) => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO table_presence (state, comment, class_id, group_id, session_id, student_id) VALUES (?, ?, ?, ?, ?, ?)',
              [status, comment, class_id, group_id, session_id, studentId],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  tx.executeSql(
                    'UPDATE table_session SET checkAttendance = ? WHERE session_id = ?',
                    [1, session_id],
                    (tx, updateResults) => {
                      if (updateResults.rowsAffected > 0) {
                        resolve(studentId);
                      } else {
                        reject(new Error(`Error updating checkAttendance for student ${studentId}`));
                      }
                    }
                  );
                } else {
                  reject(new Error(`Failed to insert data for student ${studentId}`));
                }
              }
            );
          });
        });
      });

      const successfulStudents = await Promise.all(insertPromises);

      // Assuming fetchSession involves updating state
      await fetchSession(); // Wait for fetchSession to complete before continuing

      Alert.alert('Data inserted successfully for students');
    } catch (error) {
      console.error(error);
      Alert.alert('Error');
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
            temp.push(results.rows.item(i));
          }
          setStudentList(temp);
        }
      );
    });
  }
  // fetch all data Session from sqlite db

  const [checkAttendance, setCheckAttendance] = useState(false);

  const fetchSession = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT checkAttendance FROM table_session WHERE session_id=?',
        [session_id],
        (tx, results) => {
          if (results.rows.length > 0) {
            const attendanceValue = results.rows.item(0).checkAttendance;
            setCheckAttendance(attendanceValue);
          }
        }
      );
    });
  };


  useEffect(() => {
    const fetchData = async () => {
      await fetchSession();
      if (checkAttendance) {
        fetchPresence();
        fetchStatistic();
      } else {
        fetchStusent();
      }
    };

    fetchData();
  }, [checkAttendance]);

  const [abCount, setAbCount] = useState(0);
  const [pCount, setPCount] = useState(0);
  const [jaCount, setJaCount] = useState(0);

  const fetchStatistic = () => {
      db.transaction((tx) => {
          tx.executeSql(
              'SELECT COUNT(state) as count FROM table_presence WHERE session_id=? AND state=?',
              [session_id, 'P'],
              (tx, results) => {
                  setPCount(results.rows.item(0).count);
              }
          );
          tx.executeSql(
              'SELECT COUNT(state) as count FROM table_presence WHERE session_id=? AND state=?',
              [session_id, 'Ab'],
              (tx, results) => {
                  setAbCount(results.rows.item(0).count);
              }
          );
          tx.executeSql(
              'SELECT COUNT(state) as count FROM table_presence WHERE session_id=? AND state=?',
              [session_id, 'JA'],
              (tx, results) => {
                  setJaCount(results.rows.item(0).count);
              }
          );
      });
  };
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>

      {
        checkAttendance ? (
          // checkAttendance = true

          <View style={{ flex: 1 }}>
            {/* header  */}
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
                onPress={() => navigation.navigate('SessionScreens', { group_id: group_id, group_name: group_name, group_type: group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
              />
              <Text style={{ flex: 1, fontSize: 25, fontWeight: "700" }}> {class_name} {group_name} {group_type}</Text>
              
            </View>
            {/* Search Section */}
            <View style={{ backgroundColor: "#fff", flexDirection: "row", paddingVertical: 16, borderRadius: 10, paddingHorizontal: 16, marginVertical: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7 }}>
              <Ionicons name="search-outline" size={24} color="#05BFDB" onPress={searchStudent} />
              <TextInput
                style={{ paddingLeft: 8, fontSize: 16, flex: 1 }}
                placeholder='Search for Student ...'
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
              <TouchableOpacity onPress={fetchPresence}>
                <Ionicons name="close-outline" size={24} color="#05BFDB" />
              </TouchableOpacity>
            </View>

            <View>
        <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Statistic</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

          <View style={{ backgroundColor: colors.light, marginRight: 36, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, marginVertical: 16, }}>
            <Text style={{ color: colors.dark, fontSize: 18, }}
              onPress={() => {
              }}><Text style={{ color: colors.primary, fontWeight: 'bold' }}>P : </Text>{pCount}</Text>
          </View>
          <View style={{ backgroundColor: colors.light, marginRight: 36, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, marginVertical: 16, }}>
            <Text style={{ color: colors.dark, fontSize: 18, }}
              onPress={() => {
              }}><Text style={{ color: colors.primary, fontWeight: 'bold' }}>Ab : </Text>{abCount}</Text>
          </View>
          <View style={{ backgroundColor: colors.light, marginRight: 36, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, marginVertical: 16, }}>
            <Text style={{ color: colors.dark, fontSize: 18, }}
              onPress={() => {
              }}><Text style={{ color: colors.primary, fontWeight: 'bold' }}>JA : </Text>{jaCount}</Text>
          </View>
        </View>
      </View>

            {/* consult the attendance state per session (P, Ab, JA , C */}
            <View style={{ marginTop: 22, flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" , marginBottom:10}}> Consult Attendance</Text>
              <View>
                <FlatList
                  data={presenceList}
                  renderItem={renderConsultAttendanc}
                  keyExtractor={(item) => item.student_id.toString()}
                />
                {selectedStudent && (
                  // update information 
                  <Modal
                    isVisible={isModalPresenceVisible}
                    onBackdropPress={() => setModalPresenceVisible(false)}>
                    <View style={styles.modalContent}>
                      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Edit {selectedStudent?.student_lastName} {selectedStudent?.student_firstName}</Text>
                      <View>
                        <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: "600" }}>State:</Text>
                      </View>
                      <RadioButton.Group
                        onValueChange={(value) => setSelectedStatus(value)}
                        value={selectedStatus}>
                        <View style={{ flexDirection: "row" }}>
                          <RadioButton.Item label="P" value="P" />
                          <RadioButton.Item label="Ab" value="Ab" />
                          <RadioButton.Item label="JA" value="JA" />
                        </View>
                      </RadioButton.Group>
                      <View>
                        <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: "600" }}> Comment: </Text>
                      </View>
                      <TextInput
                        style={[styles.modalInput, { width: "100%" }]}
                        placeholder="Enter comment"
                        value={comment !== null ? comment : undefined}
                        onChangeText={(text) => setComment(text)}
                      />
                      <View style={{ flexDirection: "row", justifyContent: "space-between", width: 100 }}>
                        <TouchableOpacity
                          onPress={handleSavePresence}
                          style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", margin: 3, left: 16 }}>
                          <Text style={styles.buttonTexts}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={toggleModalPresence}
                          style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", margin: 3, left: 16 }}>
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
            {/* header  */}
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
                onPress={() => navigation.navigate('SessionScreens', { group_id: group_id, group_name: group_name, group_type: group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
              />
              <Text style={{ flex: 1, fontSize: 25, fontWeight: "700" }}> {class_name} {group_name} {group_type}</Text>
            </View>
            <View style={{ marginTop: 22, flex: 1, }}>
              <Text style={{ fontSize: 17, fontWeight: "700" }}> Check Attendance </Text>
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
