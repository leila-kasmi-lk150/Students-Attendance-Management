import { Alert, StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../component/Constant';
import * as Sqlite from 'expo-sqlite';
import Papa from 'papaparse';
// import * as XLSX from 'xlsx';
import * as DocumentPicker from 'expo-document-picker';
import * as RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';

const Membre = ({ route, navigation }: { route: any, navigation: any }) => {
  let db = Sqlite.openDatabase('Leiknach.db');
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  interface StudentItem {
    student_id: string;
    student_firstName: string;
    student_lastName: string;
    class_id: number;
    group_id: number;

  }
  const [studentList, setStudentList] = useState<StudentItem[]>([]);

  const [isModalVisible, setModalVisible] = useState(false);
  // Toggle model for add new student
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Handel const for add new student
  const handleSave = () => {
    addStudent();
    toggleModal();
  };
  // Database functions
  useEffect(() => {
    db.transaction((txn) => {
      // Create the table 'table_student'
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_students'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_students', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_students (student_id INTEGER PRIMARY KEY AUTOINCREMENT, student_firstName TEXT NOT NULL,student_lastName TEXT NOT NULL, class_id INTEGER, group_id INTEGER, FOREIGN KEY (class_id) REFERENCES table_class(class_id) ON DELETE CASCADE, FOREIGN KEY (group_id) REFERENCES table_group(group_id) ON DELETE CASCADE)', // Closing parenthesis was added here
              []
            );
            console.log('Created table_student');
          } else {
            console.log('Table_student already exists');
          }
        }
      );
    });
  }, []);

  // Add new student one by one
  const addStudent = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'INSERT INTO table_students( student_firstName,student_lastName, class_id, group_id) VALUES (?,?,?,?)',
        [studentFirstName, studentLastName, class_id, group_id],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            Alert.alert('Student added successfully!');
            console.log('student added');

          } else {
            Alert.alert('Error');
            console.log('error');
            console.log(res);
          }
        }
      );
    })
  }

  // fetch all data student from sqlite db
  useEffect(() => {
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
  }, []);

  // import XLSX from 'xlsx';


  const importExcelData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
          type: 'BINARY' as any, // Type assertion
        });
  
        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        const expectedColumns = ['A', 'B', 'C']; // Adjust as needed
        const actualColumns = Object.keys(worksheet);
  
        if (!expectedColumns.every((col, index) => actualColumns[index] === col)) {
          console.error('Invalid file format. Please check the column order.');
          return;
        }
  
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];
        rows.slice(1).forEach(async (row) => {
          const [_, lastName, firstName] = row as [string, string, string]; // Assuming the order is: ID, LastName, FirstName
          // Add more validation if needed
  
          await db.transaction((txn) => {
            txn.executeSql(
              'INSERT INTO table_students (student_firstName, student_lastName, class_id, group_id) VALUES (?,?,?,?)',
              [firstName, lastName, class_id, group_id],
              (_, res) => {
                console.log('Data inserted successfully.');
              },
              // (error) => {
              //   console.error('Error inserting data:', error);
              // }
            );
          });
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };
  






  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      {/* header  */}
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
          onPress={() => navigation.navigate('Group',
            { class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
        />
        <Text style={{ flex: 1, fontSize: 25, fontWeight: '700' }}>{class_name} {group_name} {group_type}</Text>
      </View>

      {/* Search bar */}
      <View style={{ backgroundColor: "#fff", flexDirection: "row", paddingVertical: 16, borderRadius: 10, paddingHorizontal: 16, marginVertical: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, }}>
        <Ionicons name="search-outline" size={24} color="#05BFDB" />
        <TextInput style={{ paddingLeft: 8, fontSize: 16, }} placeholder='Search for Student...'></TextInput>
      </View>

      {/* Add new student */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.addNewClassButton} onPress={() => {
          setModalVisible(true); // Open add student modal
        }}>
          <Icon name="plus" size={15} color="white" style={styles.plusIcon} />
          <Text style={styles.buttonText}>Add New Student</Text>
        </TouchableOpacity>
      </View>

      {/* Add New Student Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} >
        <View style={[styles.modalContent]}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Add New Student</Text>
          <View><Text>Surname:</Text></View>
          <TextInput style={[styles.modalInput, { width: '100%' }]}
            placeholder='Enter Surname of Student'
            value={studentLastName}
            onChangeText={(text) => setStudentLastName(text)}
          />
          <View><Text>First Name:</Text></View>
          <TextInput style={[styles.modalInput, { width: '100%' }]}
            placeholder='Enter First Name of Student'
            value={studentFirstName}
            onChangeText={(text) => setStudentFirstName(text)}
          />
          <View style={{ alignItems: 'center' }}>
            <View style={styles.ORcontainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }} onPress={() => {
              importExcelData()
            }}>
              <Ionicons name="ios-folder-open-outline" size={25} color={colors.gray} style={{ marginRight: 5, top: 1, }} />
              <Text style={[{ fontSize: 15, }, { color: colors.gray }]}>Import csv file</Text>
              {/* <Ionicons name="ios-folder-open-outline" size={25} color={colors.gray} style={{ marginLeft: 5, top: 1, }} /> */}

            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <TouchableOpacity onPress={handleSave} style={[{ backgroundColor: colors.primary, padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center', margin: 3, }]}>
                <Text style={styles.buttonTexts}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={[{
                backgroundColor: colors.primary, padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center', margin: 3,
              }]}>
                <Text style={styles.buttonTexts}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* List of Student */}
      <View style={{ marginTop: 22, flex: 1 }}>

        <Text style={{ fontSize: 22, fontWeight: 'bold', }}>List of Student</Text>
        <View style={{ flex: 1 }}>
          <FlatList data={studentList} renderItem={({ item }) =>
            <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: 'center', }}>
              <TouchableOpacity
                // onPress={() => navigation.navigate('NavigateMember', 
                // { group_id: item.group_id, group_name: item.group_name,group_type: item.group_type, class_id: class_id, class_name:class_name , class_speciality:class_speciality, class_level:class_level })}

                style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30 }}
              >
                <Text style={{ flex: 1 }}>{item.student_firstName} {item.student_lastName}</Text>
                <Icon name="edit"
                  onPress={() => {
                    // setModalEditVisible(true); // Open the modal
                    // getDataEditingGroup(item); // Set the GROUP to be edited
                  }}
                  style={{ marginRight: 10, top: 2 }} size={20} color="#05BFDB" />
                <Icon name="trash" size={20} color="#05BFDB"
                  onPress={() => {
                    // getDataDeleteGroup(item);
                  }} />
              </TouchableOpacity>
            </View>
          } />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Membre

const styles = StyleSheet.create({
  ORcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary,
  },
  orText: {
    marginHorizontal: 10,
    color: colors.dark,
  },
  addNewClassButton: {
    backgroundColor: colors.primary,
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
  modalContent: {
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 5,
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
  buttonEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: 100,
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
  modalButtonAdd: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    margin: 3,
    left: 16,
    width: '80%',
  },
  buttonTexts: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  importsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: 250,
    // left: 30,
  },
})