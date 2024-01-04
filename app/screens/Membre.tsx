import { Alert, StyleSheet, Text, TouchableOpacity, Dimensions, ScrollView, View, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../component/Constant';
import * as Sqlite from 'expo-sqlite';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';
import { Dropdown } from 'react-native-element-dropdown';
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
  const [isFocus, setIsFocus] = useState(false);
  const [studentList, setStudentList] = useState<StudentItem[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalEditVisible, setModalEditVisible] = useState(false);

  // Toggle model for add new student
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Handel const for add new student
  const handleSave = () => {
    addStudent();
    toggleModal();
  };
  // Handel const for edit student information
  const handleSaveEdit = () => {
    editStudent();
    toggleEditModal();
  };
  // Toggle model for edit student
  const toggleEditModal = () => {
    setModalEditVisible(!isModalEditVisible);
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
  type ExcelData = {
    [key: string]: string;
  };

  const handleImportExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;

        // Fetch the file content as an ArrayBuffer
        const response = await fetch(fileUri);
        const arrayBuffer = await response.arrayBuffer();
        const fileContent = new Uint8Array(arrayBuffer);

        // Parse the Excel data using workbook
        const workbook = XLSX.read(fileContent, { type: 'array' });

        const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
        const worksheet = workbook.Sheets[sheetName];

        // Extract data from the second and third columns dynamically
        const data: ExcelData[] = XLSX.utils.sheet_to_json(worksheet, { header: ['Num', 'Nom', 'Prénom'] });

        // Validate data format
        const validationErrors = validateDataFormat(data);
        if (validationErrors.length) {
          // Display validation errors to the user
          console.error(validationErrors);
          return;
        }

        // Insert data into SQLite table
        await insertDataIntoDatabase(data);

        //  success message
        Alert.alert('List of students successfully imported')
        console.log('Data successfully imported into table_students.');

      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateDataFormat = (data: ExcelData[]) => {
    const errors: string[] = [];

    // Check for non-string values in Nom (Surname) and Prénom (Name)
    data.forEach((row: ExcelData, index: number) => {
      const nom = row['Nom'] || row['Surname'];
      const prenom = row['Prénom'] || row['Name'];

      if (typeof nom !== 'string' || typeof prenom !== 'string') {
        errors.push(`Invalid data at row ${index + 2}: Surname and Name must be strings`);
        Alert.alert(`Invalid data at row ${index + 2}: Surname and Name must be strings`);
      }
    });


    return errors;
  };


  const insertDataIntoDatabase = async (data: ExcelData[]) => {
    await db.transaction((txn) => {
      // Start from the second row to exclude the header
      data.slice(1).forEach(async (row: ExcelData, index: number) => {
        const nom = row['Nom'] || row['Surname'];
        const prenom = row['Prénom'] || row['Name'];

        // Additional checks on the data, you can customize this as needed
        if (!nom || !prenom) {
          console.error(`Invalid data at row ${index + 2}: Surname and Name are required`);
          return;
        }

        const params = [prenom, nom, class_id, group_id];
        await txn.executeSql(
          'INSERT INTO table_students (student_firstName, student_lastName, class_id, group_id) VALUES (?,?,?,?)',
          params
        );
      });
    });
  };
  //end  import XLSX from 'xlsx';

  // Delet student
  var [deleteStudentId, setDeleteStudentId] = useState('');
  const getDataDeleteStudent = (item: any) => {
    deleteStudentId = item.student_id.toString();
    deleteStudent();
  }
  const deleteStudent = () => {
    Alert.alert(
      'Confirm Deletion',
      'Do you really want to delete this student?',
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
                  'DELETE FROM table_students WHERE student_id=?',
                  [deleteStudentId],
                  (tx, res) => {
                    if (res.rowsAffected === 1) {
                      Alert.alert('Student deleted successfully!');
                    } else {
                      Alert.alert('Error deleting student');
                    }
                  }
                );
              });
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
            } catch (error) {
              console.error('Error deleting student:', error);
              Alert.alert('Error deleting student');
            }
          },
        },
      ]
    );
  };
  // Edit student
  var [editStudentFirstName, setEditStudentFirstName] = useState('');
  var [editStudentLastName, setEditStudentLastName] = useState('');
  var [editStudentId, setEditStudentId] = useState('');

  const getDataEditingStudent = (item: any) => {
    editStudentId = item.student_id.toString();
    setEditStudentId(item.student_id);
    setEditStudentFirstName(item.student_firstName);
    setEditStudentLastName(item.student_lastName);
  }

  const [editStudentGroup, setEditStudentGroup] = useState<string>('');
  const [groups, setGroups] = useState<{ group_id: string; group_name: string; group_type: string; label: string }[]>([]);

  useEffect(() => {
    setEditStudentGroup(group_id);
    // Fetch groups 
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT group_id, group_name, group_type FROM table_group WHERE class_id = ?',
        [class_id],
        (_, { rows }) => {
          const groupList = rows._array.map((row) => ({
            group_id: row.group_id.toString(),
            group_name: row.group_name.toString(),
            group_type: row.group_type.toString(),
            label: `${row.group_name} - ${row.group_type}`
          }));
          setGroups(groupList);
        }
      );
    });
  }, [class_id]);
  const editStudent = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'UPDATE table_students SET student_firstName=?, student_lastName=?, group_id=? WHERE student_id=?',
        [editStudentFirstName, editStudentLastName, editStudentGroup, editStudentId],
        (tex, res) => {
          if (res.rowsAffected === 1) {
            if (editStudentGroup == group_id) {
              Alert.alert('Student updated successfully!');
              console.log('Student updated');
            } else {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT * FROM table_group WHERE group_id=?',
                  [editStudentGroup],
                  (tx, results) => {
                    const transferredGroup = results.rows.item(0);
                    Alert.alert(
                      'The student transferred successfully to \n' +
                      transferredGroup.group_name +
                      ' ' +
                      transferredGroup.group_type
                    );
                    console.log('Student updated');
                  }
                );
              });
            }
          } else {
            Alert.alert('Error updating student');
            console.log('Error updating student');
            console.log(res);
          }
        }
      );

    });
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

    setEditStudentGroup(group_id);
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
              handleImportExcel()
            }}>
              <Ionicons name="ios-folder-open-outline" size={25} color={colors.gray} style={{ marginRight: 5, top: 1, }} />
              <Text style={[{ fontSize: 15, }, { color: colors.gray }]}>Import excel file</Text>

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
                style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30 }}
              >
                <Text style={{ flex: 1 }}>{item.student_lastName} {item.student_firstName}</Text>
                <Icon name="edit"
                  onPress={() => {
                    setModalEditVisible(true); // Open the modal
                    getDataEditingStudent(item); // Set the GROUP to be edited
                  }}
                  style={{ marginRight: 10, top: 2 }} size={20} color="#05BFDB" />
                <Icon name="trash" size={20} color="#05BFDB"
                  onPress={() => {
                    getDataDeleteStudent(item);
                  }} />
              </TouchableOpacity>
            </View>
          } />
        </View>
      </View>
      {/* This model view for edit student,  */}
      <Modal isVisible={isModalEditVisible} onBackdropPress={() => setModalEditVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Edit Class Class</Text>

          <View><Text>Surname:</Text></View>
          <TextInput style={[styles.modalInput, { width: '100%' }]}
            placeholder='Enter Surname of Student'
            value={editStudentLastName}
            onChangeText={(text) => setEditStudentLastName(text)}
          />
          <View><Text>First Name:</Text></View>
          <TextInput style={[styles.modalInput, { width: '100%' }]}
            placeholder='Enter First Name of Student'
            value={editStudentFirstName}
            onChangeText={(text) => setEditStudentFirstName(text)}
          />
          <View><Text>Group : </Text></View>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={groups}
            search
            maxHeight={300}
            labelField="label" // Use "label" as the labelField
            valueField="group_id"
            placeholder={!isFocus ? `${group_name} - ${group_type}` : '...'}
            searchPlaceholder="Search..."
            value={editStudentGroup}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(selectedItem) => {
              if (selectedItem) {
                // If an item is selected, set the selected group_id
                setEditStudentGroup(selectedItem.group_id);
              } else {
                // If no item is selected, default to the original group_id
                setEditStudentGroup(group_id);
              }
              setIsFocus(false);
            }}
          />



          <View style={[styles.buttonEdit, { width: 100, }]}>
            <TouchableOpacity onPress={handleSaveEdit} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleEditModal} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Close</Text>
            </TouchableOpacity>
          </View></View>
      </Modal>
    </SafeAreaView>
  )
}

export default Membre

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 1,  // Adjust the border width as needed
    borderRadius: 5, // Adjust the border radius as needed
  },
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
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    margin: 20
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})