import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet,TextInput, ScrollView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { clas, colors } from '../component/Constant'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import AddClass from './AddClass';
import EditClass from './EditClass';
import Home from './Home';
import Modal from 'react-native-modal';
import * as Sqlite from 'expo-sqlite';



const Group = ({ route }:{route: any}) => {
  // const for class information
  const [namegroup, setNameGroup] = useState('');
  const [typeGroup, setTypeGroup] = useState('');
  const navigation=useNavigation();
  const {class_id} = route.params;
  let db = Sqlite.openDatabase('Leiknach.db');
  // Model for add new group 
  const [isModalVisible, setModalVisible] = useState(false);
  interface GroupItem {
    group_id: number;
    group_name: string;
    group_type: string;
    class_id: number;
  }
  const [groupList, setGroupList] = useState<GroupItem[]>([]);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Handel const for add new group
  const handleSave = () => {
    toggleModal();
  };

  // Database functions
useEffect(() => {
  db.transaction((txn) => {
    // Create the table 'table_group'
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='table_group'",
      [],
      (tx, res) => {
        console.log('item:', res.rows.length);
        if (res.rows.length === 0) {
          txn.executeSql('DROP TABLE IF EXISTS table_group', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS table_group (group_id INTEGER PRIMARY KEY AUTOINCREMENT, group_name TEXT NOT NULL, group_type TEXT NOT NULL CHECK(group_type IN ("TD", "TP")), class_id INTEGER, FOREIGN KEY (class_id) REFERENCES table_class (class_id) ON DELETE CASCADE)',
            []
          );
          console.log('Created table_group');
        } else {
          console.log('Table_group already exists');
        }
      }
    );
  });
}, []);

// fetch all data group from sqlite db
useEffect(() => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM table_group WHERE class_id=?',
      [class_id],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          console.log(results.rows.item(i));
          temp.push(results.rows.item(i));
        }
        setGroupList(temp);
      }
    );
  });
}, []);

// Add new group to db
const addClass = () => {
  db.transaction((txn) => {
    txn.executeSql(
      'INSERT INTO table_group( group_name, group_type, class_id) VALUES (?,?,?)',
      [namegroup, typeGroup, class_id],
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
  function name() {
    Alert.alert(class_id);
  }
  return (
    <SafeAreaView style={{flex: 1, marginHorizontal: 16,marginTop: 45}}>

      {/* header  */}
      <View style={{flexDirection: 'row'}}>
      <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }} onPress={() => navigation.navigate(Home as never )} />
        <Text style={{flex: 1, fontSize: 25, fontWeight: '700'}}>Management Class</Text>        
      </View>

      {/* Search bar */}
      <View style={{backgroundColor: "#fff", flexDirection: "row", paddingVertical: 16, borderRadius: 10, paddingHorizontal: 16,marginVertical: 16,shadowColor: "#000", shadowOffset: {width:0, height: 4}, shadowOpacity: 0.1,shadowRadius: 7, }}>
        <Ionicons name="search-outline" size={24} color="#05BFDB" />
        <TextInput style={{paddingLeft: 8, fontSize: 16,}} placeholder='Search...'></TextInput>
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={styles.addNewClassButton} onPress={() => {
            setModalVisible(true); // Open add group modal
          }}>
          <Icon name="plus" size={15} color="white" style={styles.plusIcon} />
          <Text style={styles.buttonText}>Add New Group</Text>
        </TouchableOpacity>
      </View>
      {/* Add New Class Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Add New Class</Text>

          <View><Text>Name Class</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter Name of Class'
            // value={nameClass}
            // onChangeText={(text) => setNameClass(text)}
          />
          <View><Text>Speciality</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter Speciality'
            // value={speciality}
            // onChangeText={(text) => setSpeciality(text)}
          />
          <View><Text>Level</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter Level'
            // value={level}
            // onChangeText={(text) => setLevel(text)}
          />
          <View><Text>College Year</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter College Year'
            // value={collegeYearValue}
            // onChangeText={(text) => setCollegeYearValue(text)}
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

      {/* classes */}
      <View style={{marginTop: 22}}>
       
        <Text style={{fontSize: 22, fontWeight: 'bold',}}>Groups</Text>
        <View>
          <FlatList data={groupList} renderItem={({item })=>
              <View style={{backgroundColor: colors.light, shadowColor: "#000", shadowOffset:{width: 0, height:4},shadowOpacity:0.1, shadowRadius:7,borderRadius:16, marginVertical: 16, alignItems: 'center', }}>
                <TouchableOpacity style={{flexDirection: 'row', paddingLeft: 20,paddingRight: 20, paddingTop:30, paddingBottom:30 }}>
                  <Text style={{flex: 1}}>{item.group_name} {item.group_type}</Text>
                    <Icon name="edit" onPress={() => navigation.navigate(EditClass as never )}style={{marginRight: 10, top: 2}} size={20} color="#05BFDB" />
                    <Icon name="trash" size={20} color="#05BFDB" />
                </TouchableOpacity>
              </View>
          }/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Group

const styles = StyleSheet.create({
 
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