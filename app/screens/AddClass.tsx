import { View, Text, SafeAreaView, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../component/Constant'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Home from './Home'
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const AddClass = () => {

  const [nameClass, setNameClass] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [level, setLevel] = useState('');
  const [collegeYear, setCollegeYear] = useState('');

  // const addClassFunction = async () => {
  //   try {
  //     const classCollection = collection(FIRESTORE_DB, 'clas');
  //     await addDoc(classCollection, {
  //       nameClass: nameClass,
  //       speciality: speciality,
  //       level: level,
  //       collegeYear: collegeYear,
  //     });
  //     console.log('Class added successfully!');
  //     Alert.alert('Class added successfully!');
  //     navigation.navigate(Home as never )
  //   } catch (error) {
  //     console.error('Error adding class:', error);
  //     Alert.alert('Error adding class:');
  //   }
  // };

  const navigation=useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 45 }}>

      {/* header  */}
      <View style={{ flexDirection: 'row',marginBottom:75, backgroundColor: colors.light, padding: 15 }}>
        <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }} onPress={() => navigation.navigate(Home as never )} />
        <Text style={{ flex: 1, fontSize: 25, fontWeight: '700' }}>Add New Class</Text>
      </View>

      <ScrollView >
        <View style={{ margin: 0, bottom: -25, left: 9 }}><Text>Name Class</Text></View>
        <TextInput
          style={styles.textInput}
          placeholder='Enter name of class'
          onChangeText={(text) => setNameClass(text)}
          value={nameClass}
        />
        <View style={{ margin: 0, bottom: -25, left: 9 }}><Text>Speciality</Text></View>
        <TextInput
          style={styles.textInput}
          placeholder='Enter speciality'
          onChangeText={(text) => setSpeciality(text)}
          value={speciality}
        />
        <View style={{ margin: 0, bottom: -25, left: 9 }}><Text>Level</Text></View>
        <TextInput
          style={styles.textInput}
          placeholder='Enter Level'
          onChangeText={(text) => setLevel(text)}
          value={level}
        />
        <View style={{ margin: 0, bottom: -25, left: 9 }}><Text>College Year</Text></View>
        <TextInput
          style={styles.textInput}
          placeholder='Enter college year'
          onChangeText={(text) => setCollegeYear(text)}
          value={collegeYear}
        />
        <View style={{flexDirection: 'row', justifyContent:'center'}}>
        <TouchableOpacity style={styles.addNewClassButton} 
        // onPress={addClassFunction}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>






    </SafeAreaView>
  )
}

export default AddClass

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 15,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
    // top: -100,
    backgroundColor: "#05BFDB",
    marginTop: 35,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10
  },
  texts: {
    color: "#05BFDB",
    // left: -90,
    // marginTop: 30,
    // top: -70,
    margin: 0,
  },
  textInput: {
    paddingHorizontal: 12,
    // paddingVertical: 16,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 40,
    width: "100%",
    height: 50,
    borderRadius: 10,
    // top: -50,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: '#414757',
  },
  link: {
    fontWeight: 'bold',
    color: "#05BFDB",
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 8, // Adjust the left margin for better alignment
  },
  addNewClassButton: {
    backgroundColor: '#05BFDB',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 50,
    marginLeft:20,
    marginRight: 20,
    borderRadius: 10,
    width: 150,
    // left: 30,
    justifyContent:'center'
  },
  buttonText: {
    color: 'white',
    // left: 30,
    fontSize: 15,
    fontWeight: 'bold',
  },
});