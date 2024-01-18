import React, { Component, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { DataTable } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../component/Constant';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
const Session = ({ route, navigation }: { route: any, navigation: any }) => {

  const screenWidth = Dimensions.get('window').width;
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;

  // Model for add new session 
  const [isModalVisible, setModalVisible] = useState(false);
  // Toggle model for add new session
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleSave = async () => {
    // this alert just for test , replace with the name of function that add new session
    Alert.alert('Session added successfully!');

    // and this for close the modal ^^
    toggleModal();
  };
  // Model for edit session
  const [isModalEditVisible, setModalEditVisible] = useState(false);
  // Toggle model for edit session
  const toggleEditModal = () => {
    setModalEditVisible(!isModalEditVisible);
  };
  const handleSaveEdit = async () => {
      toggleEditModal();
  };
  interface SessionItem {
    session_id: string;
    session_date: string;
    session_time: string;
    class_id: number;
    group_id: number;
  }
  const [sessionList, setSessionList] = useState<SessionItem[]>([]);

  // later, delete this code (useEffect) when you work on database
  // when you fill sessionList from there
  // delete just useEffect, because you need sessionList and setSessionList variables ⚠
  useEffect(() => {
    const initialSessionList: SessionItem[] = [
      {
        session_id: '1',
        session_date: '06/09/2024',
        session_time: '10:15',
        class_id: 6,
        group_id: 9,
      },
      {
        session_id: '2',
        session_date: '18/01/2024',
        session_time: '08:30',
        class_id: 6,
        group_id: 9,
      },
      {
        session_id: '3',
        session_date: '19/01/2024',
        session_time: '13:30',
        class_id: 6,
        group_id: 9,
      },
      {
        session_id: '4',
        session_date: '20/01/2024',
        session_time: '15:30',
        class_id: 6,
        group_id: 9,
      },
    ];
    setSessionList(initialSessionList);
  }, []);

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

      {/* Export  */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, width: (screenWidth * 0.3), padding: 15, marginVertical: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, }}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.gray, fontWeight: 'bold', fontSize: 14 }}>
                <Ionicons name="calendar" size={14} color="#05BFDB" />
                <Text> From </Text>
              </Text>
            </View>
            <Text style={{ color: colors.gray, fontSize: 10 }}> __/__/____</Text>
          </View>
        </View>
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 10, width: (screenWidth * 0.3), padding: 15, marginVertical: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7,
        }}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.gray, fontWeight: 'bold', fontSize: 14 }}>
                <Ionicons name="calendar" size={14} color="#05BFDB" />
                <Text> To </Text>
              </Text>
            </View>
            <Text style={{ color: colors.gray, fontSize: 10 }}> __/__/____</Text>
          </View>
        </View>
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          marginVertical: 25,
          padding: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1, shadowRadius: 7,
          width: screenWidth * 0.2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <Ionicons name='download' size={20} color="#05BFDB" />
            <View><Text style={{ color: colors.gray, fontWeight: 'bold', fontSize: 10 }}>Export</Text></View>

          </View>
        </View>
      </View>


      {/* Add new session */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.addNewClassButton} onPress={() => {
          setModalVisible(true); // Open add session modal
        }}>
          <Icon name="plus" size={15} color="white" style={styles.plusIcon} />
          <Text style={styles.buttonText}>Add New Session</Text>
        </TouchableOpacity>
      </View>
      {/* Add New Session Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Add New Session</Text>
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Date:</Text></View>
          <TextInput style={[styles.modalInput, { width: '100%' }]}
            placeholder='Enter Date'
            // value={}
            // onChangeText={}
          />
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Time:</Text></View>
          <TextInput style={[styles.modalInput, { width: '100%' }]}
            placeholder='Enter Time'
            // value={}
            // onChangeText={}
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
      {/* List of Session */}
      <View style={{ marginTop: 22, flex: 1 }}>

        <Text style={{ fontSize: 22, fontWeight: 'bold', }}>List of Sessions</Text>
        <View style={{ flex: 1 }}>
          <FlatList data={sessionList} renderItem={({ item }) =>
            <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: 'center', }}>
              <TouchableOpacity

                onPress={() => navigation.navigate('PresenceScreens',
                  { session_id: item.session_id, group_id: group_id, group_name: group_name, group_type: group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}

                style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30 }}
              >
                <Text style={{ flex: 1 }}>{item.session_date} - {item.session_time}</Text>
                <Icon name="edit"
                  onPress={() => {
                    setModalEditVisible(true); // Open the modal
                  }}
                  style={{ marginRight: 10, top: 2 }} size={20} color="#05BFDB" />
                <Icon name="trash" size={20} color="#05BFDB"
                  onPress={() => {
                    // getDataDeleteStudent(item);
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
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Date</Text></View>
          <TextInput style={styles.modalInput}
            // value={}
            // onChangeText={}
          />
          <View><Text style={{ marginTop: 5, marginBottom: 5, fontWeight: '600' }}>Time</Text></View>
          <TextInput style={styles.modalInput}
            // value={}
            // onChangeText={}
          />
          
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