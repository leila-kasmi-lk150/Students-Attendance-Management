import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../component/Constant'
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from './Home';
import Modal from 'react-native-modal';
import * as Sqlite from 'expo-sqlite';
import { CheckBox } from 'react-native-elements';



const Group = ({ route, navigation }: { route: any, navigation: any }) => {
  const [isTdChecked, setTdChecked] = useState(false);
  const [isTpChecked, setTpChecked] = useState(false);

  const handleTdCheckboxChange = () => {
    setTdChecked(!isTdChecked);
  };

  const handleTpCheckboxChange = () => {
    setTpChecked(!isTpChecked);
  };

  const [isEditTdChecked, setEditTdChecked] = useState(false);
  const [isEditTpChecked, setEditTpChecked] = useState(false);

  const handleEditTdCheckboxChange = () => {
    setEditTdChecked(!isEditTdChecked);
    setEditTpChecked(false); // Uncheck TP
  };

  const handleEditTpCheckboxChange = () => {
    setEditTpChecked(!isEditTpChecked);
    setEditTdChecked(false); // Uncheck TD
  };

  const [nameGroup, setNameGroup] = useState('');


  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
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
  // Model for edit group
  const [isModalEditVisible, setModalEditVisible] = useState(false);
  // Toggle model for add new group
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setNameGroup('');
    setTdChecked(false);
    setTpChecked(false);
    setAddGroupError('');
    setGroupNameError('');
    setTypeError('');
  };
  // Toggle model for edit group
  const toggleEditModal = () => {
    setModalEditVisible(!isModalEditVisible);
    setGroupNameErrorEdit('');
    setTypeErrorEdit('');
    setEditGroupError('');
  };
  // Handel const for add new group
  const handleSave = async () => {

    const isValid = await validateAddGroup();

    if (isValid) {
      addGroup();
      toggleModal();
      setNameGroup('');
      setTdChecked(false);
      setTpChecked(false);
    }

  };
  const handleSaveEdit = async () => {
    const isValid = await validateEditGroup();
    if (isValid) {
      editGroup();
      toggleEditModal();
    }
  };
  // Database functions
  useEffect(() => {
    db.transaction((txn) => {
      // Create the table 'table_group'
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_group'",
        [],
        (tx, res) => {
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

  // search 
  const [searchText, setSearchText] = useState('');
  const searchGroup = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_group WHERE (group_name LIKE ? OR group_type LIKE ? ) AND class_id=? ORDER BY class_id DESC',
        [`%${searchText}%`, `%${searchText}%`, class_id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setGroupList(temp);
        }
      );
    });
  }

  useEffect(() => {
    searchGroup();
    if (searchText.length == 0) {
      fetchGroup();
    }
  }, [searchText]);
  // fetch all data group from sqlite db
  const fetchGroup = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_group WHERE class_id=? ORDER BY class_id DESC',
        [class_id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setGroupList(temp);
        }
      );
    });
    setSearchText('');
  }
  useEffect(() => {
    fetchGroup();
  }, []);


  // Validation state variables --> add group
  const [groupNameError, setGroupNameError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [addGroupError, setAddGroupError] = useState('');

  const validateAddGroup = () => {
    setGroupNameError('');
    setTypeError('');
    setAddGroupError('');

    return new Promise((resolve) => {
      let isValid = true;

      if (!nameGroup.trim()) {
        setGroupNameError('Name group is required');
        isValid = false;
      }

      if (!isTdChecked && !isTpChecked) {
        setTypeError('Type is required');
        isValid = false;
      }

      const upperCaseNameGroup = nameGroup.trim().toUpperCase();

      db.transaction((txn) => {
        let groupTypeQuery = null;

        if (isTdChecked && !isTpChecked) {
          groupTypeQuery = 'TD';
        } else if (!isTdChecked && isTpChecked) {
          groupTypeQuery = 'TP';
        } else if (isTdChecked && isTpChecked) {
          groupTypeQuery = 'TP and TD';
        }

        if (groupTypeQuery == 'TP and TD') {
          txn.executeSql(
            "SELECT * FROM table_group WHERE UPPER(TRIM(group_name)) = ? AND class_id=? ",
            [upperCaseNameGroup, class_id],
            (tx, res) => {
              if (res.rows.length > 0) {
                const existingGroup = res.rows.item(0);
                setAddGroupError(` ${existingGroup.group_name} ${existingGroup.group_type} already exists.`);
                isValid = false;
              }
              resolve(isValid);
            }
          );
        } else {
          txn.executeSql(
            "SELECT * FROM table_group WHERE UPPER(TRIM(group_name)) = ? AND group_type = ? AND class_id=?",
            [upperCaseNameGroup, groupTypeQuery, class_id],
            (tx, res) => {
              if (res.rows.length > 0) {
                const existingGroup = res.rows.item(0);
                setAddGroupError(` ${existingGroup.group_name} ${existingGroup.group_type} already exists.`);
                isValid = false;
              }
              resolve(isValid);
            }
          );
        }
      });
    });
  };
  const addGroup = () => {
    db.transaction((txn) => {
      const insertQuery = 'INSERT INTO table_group( group_name, group_type, class_id) VALUES (?,?,?)';

      if (isTdChecked) {
        txn.executeSql(insertQuery, [nameGroup, 'TD', class_id], handleTransactionResponse);
      }

      if (isTpChecked) {
        txn.executeSql(insertQuery, [nameGroup, 'TP', class_id], handleTransactionResponse);
      }
    });
  };

  const handleTransactionResponse = (_: any, res: any) => {
    if (res.rowsAffected === 1) {
      Alert.alert('Group added successfully!');
    } else {
      Alert.alert('Error adding group');
    }

    fetchGroup();
  };

  // Delet Group
  var [deleteGroupId, setDeleteGroupId] = useState('');
  const getDataDeleteGroup = (item: any) => {
    deleteGroupId = item.group_id.toString();
    deleteGroup();
  }

  const deleteGroup = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Do you really want to delete this group?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await db.transaction(async (txn) => {
                const deleteGroupQuery = 'DELETE FROM table_group WHERE group_id=?';
                const deleteRelatedQueries = [
                  'DELETE FROM table_students WHERE group_id=?',
                  'DELETE FROM table_session WHERE group_id=?',
                  'DELETE FROM table_presence WHERE group_id=?',
                ];
  
                txn.executeSql(deleteGroupQuery, [deleteGroupId], (tx, res) => {
                  if (res.rowsAffected === 1) {
                    for (const query of deleteRelatedQueries) {
                      txn.executeSql(query, [deleteGroupId]);
                    }
                    Alert.alert('Group deleted successfully!');
                  } else {
                    Alert.alert('Error deleting group');
                  }
                });
              });
              fetchGroup();
  
            } catch (error) {
              console.error('Error deleting group:', error);
              Alert.alert('Error deleting group. Please try again.');
            }
          },
        },
      ]
    );
  };
  

  // Edit group to 

  // Validation state variables --> edit group
  const [groupNameErrorEdit, setGroupNameErrorEdit] = useState('');
  const [typeErrorEdit, setTypeErrorEdit] = useState('');
  const [editGroupError, setEditGroupError] = useState('');

  const validateEditGroup = () => {
    setGroupNameErrorEdit('');
    setTypeErrorEdit('');
    setEditGroupError('');

    return new Promise((resolve) => {
      let isValid = true;

      if (!editGroupName.trim()) {
        setGroupNameErrorEdit('Name group is required');
        return resolve(false);
      }

      if (!isEditTdChecked && !isEditTpChecked) {
        setTypeErrorEdit('Type is required');
        return resolve(false);
      }

      const upperCaseNameGroup = editGroupName.trim().toUpperCase();

      db.transaction((txn) => {


        if (isEditTdChecked || isEditTpChecked) {
          const groupTypeQuery = isEditTdChecked ? 'TD' : 'TP';
          txn.executeSql(
            "SELECT * FROM table_group WHERE group_id = ? AND class_id = ?",
            [editGroupId, class_id],
            (tx, res) => {
              const groupExist = res.rows.item(0);

              if (upperCaseNameGroup !== groupExist.group_name.trim().toUpperCase()) {


                txn.executeSql(
                  "SELECT * FROM table_group WHERE UPPER(TRIM(group_name)) = ? AND group_type = ? AND class_id = ?",
                  [upperCaseNameGroup, groupTypeQuery, class_id],
                  (tx, res) => {
                    if (res.rows.length > 0) {
                      const groupExist = res.rows.item(0);
                      setEditGroupError('This group already exists.');
                      isValid = false;
                    }
                    resolve(isValid);
                  }
                );
              } else {
                resolve(isValid);
              }
            }
          );
        } else {
          resolve(isValid);
        }
      });
    });
  };

  var [editGroupName, setEditGroupName] = useState('');
  var [editGroupId, setEditGroupId] = useState('');

  const getDataEditingGroup = (item: any) => {
    editGroupId = item.group_id.toString();
    setEditGroupName(item.group_name);
    setEditGroupId(item.group_id);
    if (item.group_type == 'TD') {
      setEditTdChecked(true);
      setEditTpChecked(false);
    } else {
      setEditTpChecked(true);
      setEditTdChecked(false);
    }
  }

  const editGroup = () => {
    db.transaction((txn) => {
      const updateQuery = 'UPDATE table_group SET group_name=?, group_type=? WHERE group_id=?';

      if (isEditTdChecked) {
        txn.executeSql(updateQuery, [editGroupName, 'TD', editGroupId], handleTransactionResponseUpdate);
      }

      if (isEditTpChecked) {
        txn.executeSql(updateQuery, [editGroupName, 'TP', editGroupId], handleTransactionResponseUpdate);
      }
    });
  };
  const handleTransactionResponseUpdate = (_: any, res: any) => {
    if (res.rowsAffected === 1) {
      Alert.alert('Group Updated successfully!');
    } else {
      Alert.alert('Error updating group');
    }
    fetchGroup();
  };
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 45 }}>

      {/* header  */}
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }} onPress={() => navigation.navigate(Home as never)} />
        <Text style={{ flex: 1, fontSize: 25, fontWeight: '700' }}>{class_name} {class_speciality} {class_level}</Text>
      </View>

      {/* Search bar */}
      <View style={{ backgroundColor: "#fff", flexDirection: "row", paddingVertical: 16, borderRadius: 10, paddingHorizontal: 16, marginVertical: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7 }}>
        <Ionicons name="search-outline" size={24} color="#05BFDB" onPress={searchGroup} />
        <TextInput
          style={{ paddingLeft: 8, fontSize: 16, flex: 1 }}
          placeholder='Search for Group ...'
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={fetchGroup}>
          <Ionicons name="close-outline" size={24} color="#05BFDB" />
        </TouchableOpacity>
      </View>


      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.addNewClassButton} onPress={() => {
          setModalVisible(true); // Open add group modal
        }}>
          <Icon name="plus" size={15} color="white" style={styles.plusIcon} />
          <Text style={styles.buttonText}>Add New Group</Text>
        </TouchableOpacity>
      </View>
      {/* Add New group Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Add New Group</Text>
          {addGroupError.trim() ? (
            <Text style={{ color: 'red' }}>{addGroupError}</Text>
          ) : null}
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Name Group:</Text></View>
          <TextInput style={styles.modalInput}
            placeholder='Enter Name of Group'
            value={nameGroup}
            onChangeText={(text) => setNameGroup(text)}
          />
          {groupNameError.trim() ? (
            <Text style={{ color: 'red' }}>{groupNameError}</Text>
          ) : null}
          <View>
            <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Type Group:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                title="TD"
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#000', fontWeight: 'normal' }}
                checkedColor="#000"
                uncheckedColor="#ccc"
                checked={isTdChecked}
                onPress={handleTdCheckboxChange}
              />
              <CheckBox
                title="TP"
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#000', fontWeight: 'normal' }}
                checkedColor="#000"
                uncheckedColor="#ccc"
                checked={isTpChecked}
                onPress={handleTpCheckboxChange}
              />
            </View>
            {typeError.trim() ? (
              <Text style={{ color: 'red' }}>{typeError}</Text>
            ) : null}
          </View>
          <View style={styles.buttonEdit}>
            <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
              <Text style={styles.buttonTexts}>Close</Text>
            </TouchableOpacity>
          </View></View>
      </Modal>

      {/* groups */}
      <View style={{ marginTop: 22, flex: 1 }}>

        <Text style={{ fontSize: 22, fontWeight: 'bold', }}>Groups</Text>
        <View style={{ flex: 1 }}>
          <FlatList data={groupList} renderItem={({ item }) =>
            <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: 'center', }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('NavigateMember', { group_id: item.group_id, group_name: item.group_name, group_type: item.group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}

                style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30 }}
              >
                <Text style={{ flex: 1 }}>{item.group_name} {item.group_type}</Text>
                <Icon name="edit"
                  onPress={() => {
                    setModalEditVisible(true); // Open the modal
                    getDataEditingGroup(item); // Set the GROUP to be edited
                  }}
                  style={{ marginRight: 10, top: 2 }} size={20} color="#05BFDB" />
                <Icon name="trash" size={20} color="#05BFDB"
                  onPress={() => {
                    getDataDeleteGroup(item);
                  }} />
              </TouchableOpacity>
            </View>
          } />
        </View>
      </View>


      {/* This model view for edit group,  */}
      <Modal isVisible={isModalEditVisible} onBackdropPress={() => setModalEditVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Edit Group</Text>
          {editGroupError.trim() ? (
            <Text style={{ color: 'red' }}>{editGroupError}</Text>
          ) : null}
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Name Group</Text></View>
          <TextInput style={styles.modalInput}
            value={editGroupName}
            onChangeText={(text) => setEditGroupName(text)}
          />
          {groupNameErrorEdit.trim() ? (
            <Text style={{ color: 'red' }}>{groupNameErrorEdit}</Text>
          ) : null}
          <View>
            <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Type Group:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                // style={styles.modalInput}
                title="TD"
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#000', fontWeight: 'normal' }}
                checkedColor="#000"
                uncheckedColor="#ccc"
                checked={isEditTdChecked}
                onPress={handleEditTdCheckboxChange}

              />
              <CheckBox
                title="TP"
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#000', fontWeight: 'normal' }}
                checkedColor="#000"
                uncheckedColor="#ccc"
                checked={isEditTpChecked}
                onPress={handleEditTpCheckboxChange}
              />
            </View>
            {typeErrorEdit.trim() ? (
              <Text style={{ color: 'red' }}>{typeErrorEdit}</Text>
            ) : null}
          </View>
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