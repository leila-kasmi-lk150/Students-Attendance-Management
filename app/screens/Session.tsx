import React, { Component, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { DataTable } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../component/Constant';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import * as Sqlite from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const Session = ({ route, navigation }: { route: any, navigation: any }) => {
  let db = Sqlite.openDatabase('Leiknach.db');
  const screenWidth = Dimensions.get('window').width;
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;

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
  useEffect(() => {
    fetchStusent();
  }, []);

  // Model for add new session 
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setAddSessionError('');
  };
  const handleSave = async () => {
    const isValid = await validateAddSession();
    if (isValid) {
      addSession();
      toggleModal();
      setAddSessionError('');
    }
  };
  // Model for edit session
  const [isModalEditVisible, setModalEditVisible] = useState(false);
  const toggleEditModal = () => {
    setModalEditVisible(!isModalEditVisible);
  };
  const handleSaveEdit = async () => {
    editSession();
    toggleEditModal();
  };

  // Constants for dateTimePicker export file excel: From
  const [selectedDateFromExport, setSelectedDateFromExport] = useState(new Date());
  const [showDatePickerFromExport, setShowDatePickerFromExport] = useState(false);

  const handleDateChangeFromExport = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setShowDatePickerFromExport(false);
      const timestamp = event.nativeEvent.timestamp;
      const newDate = timestamp ? new Date(timestamp) : new Date();
      setSelectedDateFromExport(newDate);
    }
  };

  const formattedDateFromExport = moment(selectedDateFromExport).format('YYYY-MM-DD');

  // Constants for dateTimePicker export file excel: TO
  const [selectedDateTOExport, setSelectedDateTOExport] = useState(new Date());
  const [showDatePickerTOExport, setShowDatePickerTOExport] = useState(false);

  const handleDateChangeTOExport = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setShowDatePickerTOExport(false);
      const timestamp = event.nativeEvent.timestamp;
      const newDate = timestamp ? new Date(timestamp) : new Date();
      setSelectedDateTOExport(newDate);
    }
  };

  const formattedDateTOExport = moment(selectedDateTOExport).format('YYYY-MM-DD');
  // ================================


  const generateExcel = async () => {

    // Get selected dates and group ID
    const selectedDateFromExport = formattedDateFromExport;
    const selectedDateTOExport = formattedDateTOExport;
   


    db.transaction((transaction) => {
      // 1. Fetch class information
      transaction.executeSql(
        `SELECT class_name, class_speciality, class_level, class_collegeYear FROM table_class WHERE class_id = (SELECT class_id FROM table_group WHERE group_id = ?)`,
        [group_id],
        (_, classData) => {
          const classRows: Array<{
            class_name: string;
            class_speciality: string;
            class_level: string;
            class_collegeYear: string;
          }> = [];

          for (let i = 0; i < classData.rows.length; i++) {
            classRows.push(classData.rows.item(i));
          }

          const [classRow] = classRows;

          // 2. Fetch group information
          transaction.executeSql(
            `SELECT group_name, group_type FROM table_group WHERE group_id = ?`,
            [group_id],
            (_, groupData) => {
              const groupRows: Array<{
                group_name: string;
                group_type: string;
              }> = [];

              for (let i = 0; i < groupData.rows.length; i++) {
                groupRows.push(groupData.rows.item(i));
              }

              const [groupRow] = groupRows;

              // 3. Fetch student and session data
              transaction.executeSql(
                `
                  SELECT
                    s.student_id,
                    s.student_firstName,
                    s.student_lastName,
                    p.state,
                    strftime('%d/%m/%Y %H:%M', se.session_date || ' ' || se.session_time) AS session_datetime
                  FROM table_students s
                  JOIN table_presence p ON s.student_id = p.student_id
                  JOIN table_session se ON p.session_id = se.session_id
                  WHERE s.group_id = ?
                  AND datetime(se.session_date || ' ' || se.session_time) BETWEEN datetime(?) AND datetime(?)
                  ORDER BY s.student_lastName, session_datetime
                `,
                [group_id, selectedDateFromExport, selectedDateTOExport],
                (_, studentSessionData) => {
                  const studentRows: Array<{
                    student_id: number;
                    student_firstName: string;
                    student_lastName: string;
                    state: string;
                    session_datetime: string;
                  }> = [];

                  for (let i = 0; i < studentSessionData.rows.length; i++) {
                    studentRows.push(studentSessionData.rows.item(i));
                  }

                  const sessionsData: Array<{ session_datetime: string }> = Array.from(
                    new Set(studentRows.map((row) => row.session_datetime))
                  ).map((datetime) => {
                    return {
                      session_datetime: datetime,
                    };
                  });

                  const headerRow: Array<string | number> = [
                    'Last Name',
                    'First Name',
                    ...sessionsData.map((session) => session.session_datetime),
                  ];

                  interface DataRow {
                    student_id: number | string;
                    last_name: string;
                    first_name: string;
                    [key: string]: string | number; // Allow any string or number key
                  }

                  const dataRows: DataRow[] = studentRows.reduce((acc: DataRow[], row) => {
                    const existingRow = acc.find((r) => r.student_id === row.student_id);
                  
                    if (existingRow) {
                      existingRow[row.session_datetime] = row.state;
                    } else {
                      const newRow: DataRow = {
                        student_id: row.student_id,
                        last_name: row.student_lastName,
                        first_name: row.student_firstName,
                        [row.session_datetime]: row.state,
                      };
                      acc.push(newRow);
                    }
                  
                    return acc;
                  }, []);

                  const worksheet: Array<Array<string | number>> = [
                    // Class information
                    [
                      classRow.class_name,
                      classRow.class_speciality,
                      classRow.class_level,
                      classRow.class_collegeYear,
                    ],
                    // Group information
                    [groupRow.group_name, groupRow.group_type],
                    // Header row with student and session dates
                    headerRow,
                    ...dataRows.map((row) => {
                      return [row.last_name, row.first_name, ...Object.values(row).slice(3)];
                    }),
                  ];

                  let wb = XLSX.utils.book_new();
                  let ws = XLSX.utils.aoa_to_sheet(worksheet);
                  XLSX.utils.book_append_sheet(wb, ws, 'attendance', true);
                  const base64 = XLSX.write(wb, { type: 'base64' });
                  const filename = FileSystem.documentDirectory + 'attendance.xlsx';
                  FileSystem.writeAsStringAsync(filename, base64, {
                    encoding: FileSystem.EncodingType.Base64,
                  }).then(() => {
                    Sharing.shareAsync(filename);
                  });
                }
              );
            }
          );
        }
      );
    });







  };




  // const for my dateTimePicker of add new session
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setShowDatePicker(false);
      const timestamp = event.nativeEvent.timestamp;
      const newDate = timestamp ? new Date(timestamp) : new Date();

      setSelectedDate(newDate);
    }
  };
  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      setShowTimePicker(false);
      const truncatedTime = moment(selectedTime).startOf('minute').toDate();
      setSelectedTime(truncatedTime);
    }
  };


  // =====================
  interface SessionItem {
    session_id: string;
    session_date: string;
    session_time: string;
    class_id: number;
    group_id: number;
    checkAttendance: boolean;
  }
  const [sessionList, setSessionList] = useState<SessionItem[]>([]);

  // Database functions
  useEffect(() => {
    db.transaction((txn) => {
      // Create the table 'table_session'
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_session'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_session', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_session (session_id INTEGER PRIMARY KEY AUTOINCREMENT, checkAttendance BOOLEAN DEFAULT 0, session_date DATE NOT NULL,session_time TIME NOT NULL, class_id INTEGER, group_id INTEGER, FOREIGN KEY (class_id) REFERENCES table_class(class_id) ON DELETE CASCADE, FOREIGN KEY (group_id) REFERENCES table_group(group_id) ON DELETE CASCADE)',
              []
            );
            console.log('Created table_session');
          } else {
            console.log('Table_session already exists');
          }
        }
      );
    });
  }, []);

  // fetch all data Session from sqlite db
  const fetchSession = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_session WHERE group_id=?',
        [group_id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setSessionList(temp);
        }
      );
    });
  }
  useEffect(() => {
    fetchSession();
  }, []);

  // Add new Session with validation
  const [addSessionError, setAddSessionError] = useState('');
  const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  const formattedTime = selectedTime.toTimeString().split(' ')[0]; // Format as 'HH:mm'
  const validateAddSession = () => {
    setAddSessionError('');
    return new Promise((resolve) => {
      let isValid = true;
      db.transaction((txn) => {
        txn.executeSql(
          "SELECT * FROM table_session WHERE session_date = ? AND session_time=? AND group_id=? ",
          [formattedDate, formattedTime, group_id],
          (tx, res) => {
            if (res.rows.length > 0) {
              const existingGroup = res.rows.item(0);
              setAddSessionError(` This session already exists.`);

              isValid = false;
            } 
            resolve(isValid);
          }
        );
      });
    });
  };
  const addSession = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO table_session (session_date, session_time, class_id, group_id) VALUES (?, ?, ?, ?)',
        [formattedDate, formattedTime, class_id, group_id],
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) {
            Alert.alert('Session added successfully!')
            fetchSession();
          } else {
            console.error('Error adding session: No rows affected.');
            Alert.alert('Error adding session')
          }
        }
      );
    });
  };

  // Delet Session
  var [deleteSessionId, setDeleteSessionId] = useState('');
  const getDataDeleteSession = (item: any) => {
    deleteSessionId = item.session_id.toString();
    deleteSession();
  }

  const deleteSession = () => {
    Alert.alert(
      'Confirm Deletion',
      'Do you really want to delete this session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await db.transaction((txn) => {
                txn.executeSql(
                  'DELETE FROM table_session WHERE session_id=?',
                  [deleteSessionId],
                  (tx, res) => {
                    if (res.rowsAffected === 1) {
                      txn.executeSql(
                        'DELETE FROM table_presence WHERE session_id=?',
                        [deleteSessionId],
                        (_, result) => {
                          if (result.rowsAffected > 0) {
                            Alert.alert('Session deleted successfully!');
                          } else {
                            Alert.alert('Error deleting session');
                          }
                        }
                      );
                    } else {
                      Alert.alert('Error deleting session');
                    }
                  }
                );
              });
              fetchSession();
            } catch (error) {
              console.error('Error deleting Session:', error);
              Alert.alert('Error deleting Session');
            }
          },
        },
      ]
    );
  };
  

  // Edit Session 
  // const for my dateTimePicker of edit session
  const [selectedDateEdit, setSelectedDateEdit] = useState(new Date());
  const [showDatePickerEdit, setShowDatePickerEdit] = useState(false);
  const [selectedTimeEdit, setSelectedTimeEdit] = useState(new Date());
  const [showTimePickerEdit, setShowTimePickerEdit] = useState(false);
  const handleDateChangeEdit = (event: DateTimePickerEvent, selectedDateEdit?: Date) => {
    if (selectedDateEdit) {
      setShowDatePickerEdit(false);
      const timestamp = event.nativeEvent.timestamp;
      const newDate = timestamp ? new Date(timestamp) : new Date();
      setSelectedDateEdit(newDate);
    }
  };
  // Function to handle time change in edit session
  const handleTimeChangeEdit = (event: DateTimePickerEvent, selectedTimeEdit?: Date) => {
    if (selectedTimeEdit) {
      setShowTimePickerEdit(false);
      const truncatedTime = moment(selectedTimeEdit).startOf('minute').toDate();
      setSelectedTimeEdit(truncatedTime);
    }
  };
  var [editSessionId, setEditSessionId] = useState('');
  const getDataEditingSession = (item: any) => {
    setEditSessionId(item.session_id.toString());

    // Ensure item.session_date is a valid Date object
    const sessionDate = moment(item.session_date, 'YYYY-MM-DD').toDate();
    setSelectedDateEdit(sessionDate);

    // Ensure item.session_time is a valid Date object
    const sessionTime = moment(item.session_time, 'HH:mm').toDate();
    setSelectedTimeEdit(sessionTime);
  };

  const formattedDateEdit = moment(selectedDateEdit).format('YYYY-MM-DD');
  const formattedTimeEdit = moment(selectedTimeEdit).format('HH:mm');

  const editSession = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'UPDATE table_session SET session_date=?, session_time=? WHERE session_id=?',
        [formattedDateEdit, formattedTimeEdit, editSessionId],
        (tex, res) => {
          if (res.rowsAffected === 1) {
            Alert.alert('Session updated successfully!');
          } else {
            Alert.alert('Error updating session');
          }
        }
      );
      fetchSession();
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      {/* header  */}
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
          onPress={() => navigation.navigate('Group', { class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
        />
        <Text style={{ flex: 1, fontSize: 25, fontWeight: '700' }}>{class_name} {group_name} {group_type}</Text>
      </View>

      {/* Export  */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, width: (screenWidth * 0.3), padding: 15, marginVertical: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, }}>
          <TouchableOpacity onPress={() => setShowDatePickerFromExport(true)}>
            <Text style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
              <Text style={{ color: colors.gray, fontWeight: 'bold', fontSize: 14 }}>
                <Ionicons name="calendar" size={14} color="#05BFDB" />
                <Text> From </Text>
              </Text>
            </Text>
            <Text style={{ color: colors.gray, fontSize: 10 }}> {formattedDateFromExport}</Text>
          </TouchableOpacity>
        </View>
        {showDatePickerFromExport && (
          <DateTimePicker
            value={selectedDateFromExport}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChangeFromExport}
          />
        )}
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 10, width: (screenWidth * 0.3), padding: 15, marginVertical: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7,
        }}>
          <TouchableOpacity onPress={() => setShowDatePickerTOExport(true)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.gray, fontWeight: 'bold', fontSize: 14 }}>
                <Ionicons name="calendar" size={14} color="#05BFDB" />
                <Text> To </Text>
              </Text>
            </View>
            <Text style={{ color: colors.gray, fontSize: 10 }}> {formattedDateTOExport}</Text>
          </TouchableOpacity>
        </View>
        {showDatePickerTOExport && (
          <DateTimePicker
            value={selectedDateTOExport}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChangeTOExport}
          />
        )}

        <View style={{ backgroundColor: "#fff", borderRadius: 10, marginVertical: 25, padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, width: screenWidth * 0.2, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
          if (sessionList.length ==0) {
            Alert.alert('No Sessions', 'Please add sessions before exporting an Excel file.');
          }else{
            generateExcel(); 
          }
          
        }}>
            <Ionicons name='download' size={20} color="#05BFDB" />
            <View><Text style={{ color: colors.gray, fontWeight: 'bold', fontSize: 10 }}>Export</Text></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add new session */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.addNewClassButton} onPress={() => {
          if (studentList.length ==0) {
          Alert.alert('Empty Group', 'Please add students before creating a new session.');
          }else{
            setModalVisible(true); // Open add session modal
          }
          
        }}>
          <Icon name="plus" size={15} color="white" style={styles.plusIcon} />
          <Text style={styles.buttonText}>Add New Session</Text>
        </TouchableOpacity>
      </View>
      {/* Add New Session Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Add New Session</Text>
          {addSessionError.trim() ? (<Text style={{ color: 'red' }}>{addSessionError}</Text>) : null}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View>
              <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Date:</Text>
              <Text style={{ borderColor: 'gray', backgroundColor: '#fff', borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 10, }}>
                <Ionicons name="calendar" size={14} color={colors.dark} />   {selectedDate.toDateString()}
              </Text>
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View >
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Time:</Text>
              <Text style={{ borderColor: 'gray', backgroundColor: '#fff', borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 10, }}>
                <Ionicons name="time" size={14} color={colors.dark} />   {moment(selectedTime).format('HH:mm')}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          <View style={styles.buttonEdit}>
            <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* List of Session */}
      <View style={{ marginTop: 22, flex: 1 }}>

        <Text style={{ fontSize: 22, fontWeight: 'bold', }}>List of Sessions</Text>
        <View style={{ flex: 1 }}>
          <FlatList data={sessionList} renderItem={({ item }) =>
            <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: 'center', }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('PresenceScreens', { session_id: item.session_id, group_id: group_id, group_name: group_name, group_type: group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
                style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30 }}
              >
                <Text style={{ flex: 1 }}>
                  {moment(item.session_date).format('ddd, MMM D YYYY')} - {moment(item.session_time, 'HH:mm:ss').format('HH:mm')}
                </Text>
                <Icon name="edit"
                  onPress={() => {
                    setModalEditVisible(true); // Open the modal
                    getDataEditingSession(item);
                  }}
                  style={{ marginRight: 10, top: 2 }} size={20} color="#05BFDB" />
                <Icon name="trash" size={20} color="#05BFDB"
                  onPress={() => {
                    getDataDeleteSession(item);
                  }} />
              </TouchableOpacity>
            </View>
          } />
        </View>
      </View>

      {/* This model view for edit session,  */}
      <Modal isVisible={isModalEditVisible} onBackdropPress={() => setModalEditVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Edit Session</Text>
          <TouchableOpacity onPress={() => setShowDatePickerEdit(true)}>
            <View>
              <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Date:</Text>
              <Text style={{ borderColor: 'gray', backgroundColor: '#fff', borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 10, }}>
                <Ionicons name="calendar" size={14} color={colors.dark} />  {selectedDateEdit ? selectedDateEdit.toDateString() : ''}
              </Text>
            </View>
          </TouchableOpacity>

          {showDatePickerEdit && (
            <DateTimePicker
              value={selectedDateEdit}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChangeEdit}
            />
          )}
          <TouchableOpacity onPress={() => setShowTimePickerEdit(true)}>
            <View>
              <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Time:</Text>
              <Text style={{ borderColor: 'gray', backgroundColor: '#fff', borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 10, }}>
                <Ionicons name="calendar" size={14} color={colors.dark} /> {selectedTimeEdit ? moment(selectedTimeEdit).format('HH:mm') : ''}
              </Text>
            </View>
          </TouchableOpacity>

          {showTimePickerEdit && (
            <DateTimePicker
              value={selectedTimeEdit}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChangeEdit}
            />
          )}

          <View style={styles.buttonEdit}>
            <TouchableOpacity onPress={handleSaveEdit} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleEditModal} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Session

const styles = StyleSheet.create({
  addNewClassButton: {
    backgroundColor: '#05BFDB',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: 250,
    // left: 30,
  },
  plusIcon: {
    marginRight: 5,
    left: 20,
    top: 1,
  },
  buttonText: {
    color: 'white',
    left: 30,
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    left: 95,
  },
  modalContent: {
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 5,
  },
  buttonEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    margin: 3,
    left: 16,
  },
  buttonTexts: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});