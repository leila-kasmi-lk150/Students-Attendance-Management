import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, ScrollView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { clas, colors } from '../component/Constant'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Group from './Group';
import Modal from 'react-native-modal';
import * as Sqlite from 'expo-sqlite';
import RNPickerSelect from 'react-native-picker-select';

const Home = () => {
  let db = Sqlite.openDatabase('Leiknach.db');
  const navigation = useNavigation();
  const [nameClass, setNameClass] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [level, setLevel] = useState('');
  const [collegeYear, setCollegeYear] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  interface ClassItem {
    class_id: number;
    class_name: string;
    class_speciality: string;
    class_level: string;
    class_collegeYear: string;
  }
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [collegeYearClassList, setcollegeYearClassList] = useState<ClassItem[]>([]);
  // const for model section add and edit
  // Model for add new class 
  const [isModalVisible, setModalVisible] = useState(false);
  // Model for edit class
  const [isModalEditVisible, setModalEditVisible] = useState(false);
  // Toggle model for add new class
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Toggle model for edit class
  const toggleEditModal = () => {
    setModalEditVisible(!isModalEditVisible);
  };
  // Handel const for add new class
  const handleSave = () => {
    addClass();
    toggleModal();
    // navigation.navigate(Home as never )
  };
  const handleSaveEdit = () => {
    toggleEditModal();
  };

  // data base functions
  useEffect(() => {
    db.transaction((txn) => {
      // create table class 
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_class'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_class', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_class(class_id INTEGER PRIMARY KEY AUTOINCREMENT, class_name VARCHAR(20), class_speciality VARCHAR(20), class_level VARCHAR(20), class_collegeYear VARCHAR(20))',
              []
            );
            console.log("create table");
          } else {
            console.log("Already created table");

          }
        }
      );
    });
  }, []);

  // Add new class to db
  const addClass = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'INSERT INTO table_class( class_name, class_speciality, class_level, class_collegeYear) VALUES (?,?,?,?)',
        [nameClass, speciality, level, collegeYear],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            Alert.alert('Class added successfully!');
            console.log('class added');

          } else {
            Alert.alert('Error');
            console.log('error');
            console.log(res);
          }
        }
      );
    })
  }

  // fetch data class from sqlite db
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_class',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            console.log(results.rows.item(i));
            temp.push(results.rows.item(i));
          }
          setClassList(temp);
        }
      );
    });
  }, []);

  // fetch class of college year XXXX-YYYY
  const collegeYearClass = (collegeYear: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_class WHERE class_collegeYear= ?',
        [collegeYear],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            console.log(results.rows.item(i));
            temp.push(results.rows.item(i));
          }
          setcollegeYearClassList(temp);

        }
      );
    });
  };

  // Start
  return (
    <SafeAreaView style={styles.SafeAreaViewStyle}>
      {/* header  */}
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flex: 1, fontSize: 25, fontWeight: '700' }}>Student Attendance</Text>
        <Ionicons name="ios-settings-outline" size={25} color={colors.primary} style={{ top: 15 }} />
      </View>
      {/* Search bar */}
      <View style={styles.viewSearch}>
        <Ionicons name="search-outline" size={24} color={colors.primary} />
        <TextInput style={{ paddingLeft: 8, fontSize: 16, }} placeholder='Search for Class...' />
      </View>
      {/* Add new class button */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.addNewClassButton}
          onPress={() => {
            setModalVisible(true); // Open add class modal
          }} >
          <Icon name="plus" size={15} color="white" style={styles.plusIcon} />
          <Text style={styles.buttonText}>Add New Class</Text>
        </TouchableOpacity>
      </View>
      {/* Add New Class Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Add New Class</Text>
          <View><Text>Name Class</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter Name of Class'
            value={nameClass}
            onChangeText={(text) => setNameClass(text)}
          />
          <View><Text>Speciality</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter Speciality'
            value={speciality}
            onChangeText={(text) => setSpeciality(text)}
          />
          <View><Text>Level</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter Level'
            value={level}
            onChangeText={(text) => setLevel(text)}
          />
          <View><Text>College Year</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter College Year'
            value={collegeYear}
            onChangeText={(text) => setCollegeYear(text)}
          />

          <View style={styles.buttonEdit}>
            <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Close</Text>
            </TouchableOpacity>
          </View></View>
      </Modal>
      {/* class filter by year */}
      <View style={{ marginTop: 22 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', }}>College Year</Text>
        {/* College year  */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {
              classList.map((collegeYear, index) => {
                return (
                  <View style={{ backgroundColor: selectedIndex === index ? colors.primary : colors.light, marginRight: 36, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, marginVertical: 16, }}>
                    <Text style={{ color: selectedIndex === index ? colors.light : colors.dark, fontSize: 18, }}
                      onPress={() => {
                        setSelectedIndex(index);
                        collegeYearClass(collegeYear.class_collegeYear);
                      }}> {collegeYear.class_collegeYear}</Text>
                  </View>
                )
              })
            }
          </ScrollView>
        </View>
      </View>


      {/* classes */}
      <View style={{ marginTop: 22, flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', }}>Classes</Text>
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        {
          <FlatList
            data={collegeYearClassList}
            keyExtractor={(item) => item.class_id.toString()}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: 'center', }}>
                <TouchableOpacity onPress={() => navigation.navigate(Group as never)} style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30 }}>
                  <Text style={{ flex: 1 }}>{item.class_name} {item.class_speciality} {item.class_level}</Text>
                  <Icon name="edit" style={{ marginRight: 10, top: 2 }} size={20} color="#05BFDB"
                    onPress={() => {
                      setModalEditVisible(true); // Open the modal
                    }} />
                  <Icon name="trash" size={20} color="#05BFDB" />
                </TouchableOpacity>
              </View>
            )}
          />



        }
        {/* </ScrollView> */}
      </View>

      <Modal isVisible={isModalEditVisible} onBackdropPress={() => setModalEditVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Edit Class Class</Text>
          <View><Text>Name Class</Text></View>
          <TextInput style={styles.modalInput} placeholder='Enter Name of Class' />
          <View><Text>Speciality</Text></View>
          <TextInput style={styles.modalInput} placeholder='Enter Speciality' />
          <View><Text>Level</Text></View>
          <TextInput style={styles.modalInput} placeholder='Enter Level' />
          <View><Text>College Year</Text></View>
          <TextInput style={styles.modalInput} placeholder='Enter College Year' />
          <View style={styles.buttonEdit}>
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

export default Home

const styles = StyleSheet.create({
  SafeAreaViewStyle: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 45
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
});