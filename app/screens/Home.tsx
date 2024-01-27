import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, ScrollView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../component/Constant'
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import * as Sqlite from 'expo-sqlite';

const Home = ({ navigation }: { navigation: any }) => {
  let db = Sqlite.openDatabase('Leiknach.db');
  // const for class information
  const [nameClass, setNameClass] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [level, setLevel] = useState('');
  // Validation state variables --> add class
  const [nameClassError, setNameClassError] = useState('');
  const [specialityError, setSpecialityError] = useState('');
  const [levelError, setLevelError] = useState('');
  const [collegeYearError, setCollegeYearError] = useState('');
  const [addClassError, setAddClassError] = useState('');

  // Validation state variables --> edit class
  const [nameClassErrorEdit, setNameClassErrorEdit] = useState('');
  const [specialityErrorEdit, setSpecialityErrorEdit] = useState('');
  const [levelErrorEdit, setLevelErrorEdit] = useState('');
  const [collegeYearErrorEdit, setCollegeYearErrorEdit] = useState('');
  const [editClassError, setEditClassError] = useState('');


  // this selectedIndex const for spesific witch college year is selected and highlighted
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
    setNameClassError('');
    setSpecialityError('');
    setLevelError('');
    setAddClassError('');
    setCollegeYearError('');
    setNameClass('');
    setLevel('');
    setSpeciality('');
  };
  // Toggle model for edit class
  const toggleEditModal = () => {
    setModalEditVisible(!isModalEditVisible);
    setNameClassErrorEdit('');
    setSpecialityErrorEdit('');
    setLevelErrorEdit('');
    setEditClassError('');
    setCollegeYearErrorEdit('');
  };
  // Handel const for add new class
  const handleSave = async () => {
    const isValid = await validateAddClass();

    if (isValid) {
      addClass();
      toggleModal();
      setNameClass('');
      setLevel('');
      setSpeciality('');
    }


  };
  const handleSaveEdit = async () => {
    const isValid = await validateEditClass();
    if (isValid) {
      editClass();
      toggleEditModal();
    }

  };

  // data base functions
  useEffect(() => {
    db.transaction((txn) => {
      // create table class 
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_class'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_class', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_class(class_id INTEGER PRIMARY KEY AUTOINCREMENT, class_name TEXT, class_speciality TEXT, class_level TEXT, class_collegeYear VARCHAR(20))',
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

  const validateAddClass = () => {
    setNameClassError('');
    setSpecialityError('');
    setLevelError('');
    setCollegeYearError('');
    setAddClassError('');
    const collegeYearRegex = /^\d{4}-\d{4}$/;

    return new Promise((resolve) => {
      let isValid = true;

      if (!nameClass.trim()) {
        setNameClassError('Name Class is required');
        isValid = false;
      }
      if (!speciality.trim()) {
        setSpecialityError('Speciality is required');
        isValid = false;
      }
      if (!level.trim()) {
        setLevelError('Level is required');
        isValid = false;
      }
      if (!collegeYearValue.trim()) {
        setCollegeYearError('College year is required');
        isValid = false;
      } else if (!collegeYearRegex.test(collegeYearValue.trim())) {
        setCollegeYearError('Invalid college year format. Use XXXX-YYYY.');
        isValid = false;
      } else {
        const [startYear, endYear] = collegeYearValue.split('-').map(Number);
        if (endYear !== startYear + 1) {
          setCollegeYearError('Wrong academic year !.');
          isValid = false;
        }
      }

      const upperCaseNameClass = nameClass.trim().toUpperCase();
      const upperCaseSpeciality = speciality.trim().toUpperCase();
      const upperCaseLevel = level.trim().toUpperCase();
      const upperCaseCollegeYearValue = collegeYearValue.trim().toUpperCase();

      db.transaction((txn) => {
        txn.executeSql(
          "SELECT * FROM table_class WHERE UPPER(TRIM(class_name))=? AND UPPER(TRIM(class_speciality))=? AND UPPER(TRIM(class_level))=? AND UPPER(TRIM(class_collegeYear))=?",
          [upperCaseNameClass, upperCaseSpeciality, upperCaseLevel, upperCaseCollegeYearValue],
          (tx, res) => {
            if (res.rows.length > 0) {
              setAddClassError('This class already exists.');
              isValid = false;
            }
            // Resolve the promise with the validation result
            resolve(isValid);
          }
        );
      });
    });
  };

  // Add new class to db

  const addClass = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'INSERT INTO table_class( class_name, class_speciality, class_level, class_collegeYear) VALUES (?,?,?,?)',
        [nameClass, speciality, level, collegeYearValue],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            Alert.alert('Class added successfully!');



          } else {
            Alert.alert('Error');
          }
          if (SelectedCollegeYear != collegeYearValue) {
            db.transaction((tx) => {
              tx.executeSql(
                'SELECT DISTINCT class_collegeYear FROM table_class ORDER BY class_collegeYear DESC',
                [],
                (tx, results) => {
                  var temp = [];
                  for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                  }
                  setClassList(temp);
                }
              );
            });
            fetchLastCollegeYear();

          } else if (SelectedCollegeYear.length > 0) {
            collegeYearClass(SelectedCollegeYear);
          } else {
            fetchLastCollegeYear();
          }
        }
      );
    })


  }
  // Validate input of edit class form

  const validateEditClass = () => {
    setNameClassErrorEdit('');
    setSpecialityErrorEdit('');
    setLevelErrorEdit('');
    setCollegeYearErrorEdit('');
    setEditClassError('');
    const collegeYearRegex = /^\d{4}-\d{4}$/;

    return new Promise((resolve) => {
      let isValid = true;

      if (!editClassName.trim()) {
        setNameClassErrorEdit('Name Class is required');
        isValid = false;
      }
      if (!editClassSpeciality.trim()) {
        setSpecialityErrorEdit('Speciality is required');
        isValid = false;
      }
      if (!editClasslevel.trim()) {
        setLevelErrorEdit('Level is required');
        isValid = false;
      }
      if (!editClassCollegeYear.trim()) {
        setCollegeYearErrorEdit('College year is required');
        isValid = false;
      } else if (!collegeYearRegex.test(editClassCollegeYear.trim())) {
        setCollegeYearErrorEdit('Invalid college year format. Use XXXX-YYYY.');
        isValid = false;
      } else {
        const [startYear, endYear] = editClassCollegeYear.split('-').map(Number);
        if (endYear !== startYear + 1) {
          setCollegeYearErrorEdit('The second part of the academic year must be the next year.');
          isValid = false;
        }
      }

      const upperCaseNameClass = editClassName.trim().toUpperCase();
      const upperCaseSpeciality = editClassSpeciality.trim().toUpperCase();
      const upperCaseLevel = editClasslevel.trim().toUpperCase();
      const upperCaseCollegeYearValue = editClassCollegeYear.trim().toUpperCase();

      db.transaction((txn) => {
        txn.executeSql(
          "SELECT * FROM table_class WHERE class_id = ?",
          [editClassId],
          (tx, res) => {
            const originalClass = res.rows.item(0);
            if (
              upperCaseNameClass !== originalClass.class_name.toUpperCase() ||
              upperCaseSpeciality !== originalClass.class_speciality.toUpperCase() ||
              upperCaseLevel !== originalClass.class_level.toUpperCase() ||
              upperCaseCollegeYearValue !== originalClass.class_collegeYear.toUpperCase()
            ) {
              txn.executeSql(
                "SELECT * FROM table_class WHERE UPPER(TRIM(class_name))=? AND UPPER(TRIM(class_speciality))=? AND UPPER(TRIM(class_level))=? AND UPPER(TRIM(class_collegeYear))=?",
                [upperCaseNameClass, upperCaseSpeciality, upperCaseLevel, upperCaseCollegeYearValue],
                (tx, res) => {
                  if (res.rows.length > 0) {
                    setEditClassError('This class already exists.');
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
      });


    });
  };
  // Edit class to db
  var [editClassName, setEditClassName] = useState('');
  var [editClassSpeciality, setEditClassSpeciality] = useState('');
  var [editClasslevel, setEditClasslevel] = useState('');
  var [editClassCollegeYear, setEditClassCollegeYear] = useState('');
  var [editClassId, setEditClassId] = useState('');

  const getDataEditingClass = (item: any) => {
    editClassId = item.class_id.toString();
    setEditClassId(item.class_id);
    setEditClassName(item.class_name);
    setEditClasslevel(item.class_level);
    setEditClassSpeciality(item.class_speciality);
    setEditClassCollegeYear(item.class_collegeYear);

  }

  const editClass = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'UPDATE table_class SET class_name=?, class_speciality=?, class_level=?, class_collegeYear=? WHERE class_id=?',
        [editClassName, editClassSpeciality, editClasslevel, editClassCollegeYear, editClassId],
        (tex, res) => {
          if (res.rowsAffected === 1) {
            Alert.alert('Class updated successfully!');
          } else {
            Alert.alert('Error updating class');
          }
        }
      );
      if (SelectedCollegeYear.length > 0) {
        collegeYearClass(SelectedCollegeYear);
      } else {
        fetchLastCollegeYear();
      }
    });
  };

  // Delet class
  var [deleteClassId, setDeleteClassId] = useState('');
  const getDataDeleteClass = (item: any) => {
    deleteClassId = item.class_id.toString();
    deleteClass();
  }
  const deleteClass = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Do you really want to delete this class?',
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
                const deleteClassQuery = 'DELETE FROM table_class WHERE class_id=?';
                const deleteRelatedQueries = [
                  'DELETE FROM table_group WHERE class_id=?',
                  'DELETE FROM table_students WHERE class_id=?',
                  'DELETE FROM table_session WHERE class_id=?',
                  'DELETE FROM table_presence WHERE class_id=?',
                ];

                txn.executeSql(deleteClassQuery, [deleteClassId], (tx, res) => {
                  if (res.rowsAffected === 1) {
                    for (const query of deleteRelatedQueries) {
                      txn.executeSql(query, [deleteClassId]);
                    }
                    Alert.alert('Class deleted successfully!');
                  } else {
                    Alert.alert('Error deleting class');
                  }
                });
              });

              if (SelectedCollegeYear.length > 0) {
                await collegeYearClass(SelectedCollegeYear);
              } else {
                await fetchLastCollegeYear();
              }

            } catch (error) {
              console.error('Error deleting class:', error);
              Alert.alert('Error deleting class. Please try again.');
            }
          },
        },
      ]
    );
  };


  // fetch all data class from sqlite db
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT DISTINCT class_collegeYear FROM table_class ORDER BY class_collegeYear DESC',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setClassList(temp);
        }
      );
    });
  }, []);
  const fetchLastCollegeYear = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT DISTINCT class_collegeYear FROM table_class ORDER BY class_collegeYear DESC LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const lastCollegeYear = results.rows.item(0).class_collegeYear;
            setCollegeYearValue(lastCollegeYear);
            fetchClassData(lastCollegeYear);
          }
        }
      );
    });
  }
  // Fetch the last collegeYear from the table
  const lastcolleg = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT DISTINCT class_collegeYear FROM table_class ORDER BY class_collegeYear DESC LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const lastCollegeYear = results.rows.item(0).class_collegeYear;
            setCollegeYearValue(lastCollegeYear);
            fetchClassData(lastCollegeYear);
            setSelectedIndex(lastCollegeYear);
          }
        }
      );
    });
  }
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT DISTINCT class_collegeYear FROM table_class ORDER BY class_collegeYear DESC LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const lastCollegeYear = results.rows.item(0).class_collegeYear;
            setCollegeYearValue(lastCollegeYear);
            fetchClassData(lastCollegeYear);
          }
        }
      );
    });
  }, []);

  // Fetch class data based on a specific collegeYear
  const fetchClassData = (collegeYear: any) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_class WHERE class_collegeYear=? ORDER BY class_collegeYear DESC',
        [collegeYear],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setcollegeYearClassList(temp);
        }
      );
    });
  };
  // fetch class of college year XXXX-YYYY
  const [SelectedCollegeYear, setSelectedCollegeYear] = useState('');
  const collegeYearClass = (collegeYear: string) => {
    setSelectedCollegeYear(collegeYear);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_class WHERE class_collegeYear= ?',
        [collegeYear],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setcollegeYearClassList(temp);

        }
      );
    });
  };

  const [collegeYearValue, setCollegeYearValue] = useState('');
  useEffect(() => {
    if (collegeYearClassList.length > 0) {
      const latestCollegeYear = collegeYearClassList[0].class_collegeYear;
      setCollegeYearValue(latestCollegeYear);
    }
  }, [collegeYearClassList]);

  // Search
  const searchClass = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_class WHERE class_name LIKE ? OR class_level LIKE ? OR class_speciality LIKE ? AND class_collegeYear=?',
        [`%${searchText}%`, `%${searchText}%`, `%${searchText}%`, collegeYearValue],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setcollegeYearClassList(temp);
        }
      );
    });
  };

  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    // Call the search function when the search text changes
    searchClass();
  }, [searchText]);
  // Start
  return (
    <SafeAreaView style={styles.SafeAreaViewStyle}>
      {/* header  */}
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flex: 1, fontSize: 25, fontWeight: '700' }}>Student Attendance</Text>
        <Ionicons name="ios-settings-outline" size={25} color={colors.primary} style={{ top: 15 }} />
      </View>

      {/* Search bar */}
      <View style={{ backgroundColor: "#fff", flexDirection: "row", paddingVertical: 16, borderRadius: 10, paddingHorizontal: 16, marginVertical: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7 }}>
        <Ionicons name="search-outline" size={24} color="#05BFDB" />
        <TextInput
          style={{ paddingLeft: 8, fontSize: 16, flex: 1 }}
          placeholder='Search for Class...'
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={() => { fetchLastCollegeYear(); lastcolleg(); }}>
          <Ionicons name="close-outline" size={24} color="#05BFDB" />
        </TouchableOpacity>
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
        <ScrollView contentContainerStyle={{ paddingTop: 100 }}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Add New Class</Text>
            {addClassError.trim() ? (
              <Text style={{ color: 'red' }}>{addClassError}</Text>
            ) : null}
            <View>
              <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Name Class</Text>
              <TextInput
                style={styles.modalInput}
                placeholder='Enter Name of Class'
                value={nameClass}
                onChangeText={(text) => setNameClass(text)}
              />
              {nameClassError.trim() ? (
                <Text style={{ color: 'red' }}>{nameClassError}</Text>
              ) : null}
            </View>
            <View>
              <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Speciality</Text>
              <TextInput
                style={styles.modalInput}
                placeholder='Enter Speciality'
                value={speciality}
                onChangeText={(text) => setSpeciality(text)}
              />
              {specialityError.trim() ? (
                <Text style={{ color: 'red' }}>{specialityError}</Text>
              ) : null}
            </View>
            <View>
              <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Level</Text>
              <TextInput
                style={styles.modalInput}
                placeholder='Enter Level'
                value={level}
                onChangeText={(text) => setLevel(text)}
              />
              {levelError.trim() ? (
                <Text style={{ color: 'red' }}>{levelError}</Text>
              ) : null}
            </View>
            <View>
              <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>College Year</Text>
              <TextInput
                style={styles.modalInput}
                placeholder='Enter College Year : XXXX-YYYY'
                value={collegeYearValue}
                onChangeText={(text) => setCollegeYearValue(text)}
              />
              {collegeYearError.trim() ? (
                <Text style={{ color: 'red' }}>{collegeYearError}</Text>
              ) : null}
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
        </ScrollView>
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


      {/* View classes of college year that selected */}
      <View style={{ marginTop: 22, flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', }}>Classes</Text>
        {
          <FlatList
            data={collegeYearClassList}
            keyExtractor={(item) => item.class_id.toString()}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: 'center', }}>
                {/* When cilck in this view, It will be navigate to goups of this class */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Group',
                    { class_id: item.class_id.toString(), class_name: item.class_name, class_speciality: item.class_speciality, class_level: item.class_level })}
                  style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30 }}
                >
                  <Text style={{ flex: 1 }}>{item.class_name} {item.class_speciality} {item.class_level}</Text>
                  {/* EDIT CLASS ICON */}
                  <Icon name="edit" style={{ marginRight: 10, top: 2 }} size={20} color="#05BFDB"
                    onPress={() => {
                      setModalEditVisible(true); // Open the modal
                      getDataEditingClass(item); // Set the class to be edited
                    }} />
                  <Icon name="trash" size={20} color="#05BFDB"
                    onPress={() => {
                      getDataDeleteClass(item);
                    }} />
                </TouchableOpacity>
              </View>
            )}
          />
        }
      </View>

      {/* This model view for edit class,  */}
      <Modal isVisible={isModalEditVisible} onBackdropPress={() => setModalEditVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Edit Class Class</Text>
          {editClassError.trim() ? (
            <Text style={{ color: 'red' }}>{editClassError}</Text>
          ) : null}
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Name Class</Text></View>
          <TextInput style={styles.modalInput}
            value={editClassName}
            onChangeText={(text) => setEditClassName(text)}
          />
          {nameClassErrorEdit.trim() ? (
            <Text style={{ color: 'red' }}>{nameClassErrorEdit}</Text>
          ) : null}
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Speciality</Text></View>
          <TextInput style={styles.modalInput}
            value={editClassSpeciality}
            onChangeText={(text) => setEditClassSpeciality(text)} />
          {specialityErrorEdit.trim() ? (
            <Text style={{ color: 'red' }}>{specialityErrorEdit}</Text>
          ) : null}
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Level</Text></View>
          <TextInput style={styles.modalInput}
            value={editClasslevel}
            onChangeText={(text) => setEditClasslevel(text)} />
          {levelErrorEdit.trim() ? (
            <Text style={{ color: 'red' }}>{levelErrorEdit}</Text>
          ) : null}
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>College Year</Text></View>
          <TextInput style={styles.modalInput}
            value={editClassCollegeYear}
            onChangeText={(text) => setEditClassCollegeYear(text)} />
          {collegeYearErrorEdit.trim() ? (
            <Text style={{ color: 'red' }}>{collegeYearErrorEdit}</Text>
          ) : null}
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
    marginBottom: 5,
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