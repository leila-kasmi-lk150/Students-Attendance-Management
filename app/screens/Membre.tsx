import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput,ImageBackground  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AddMember from './AddMember';

const Member = () => {
  const [classesData, setClassesData] = useState([
    { id: '1', name: 'Marwa ben ' },
    { id: '2', name: ' aymen bou' },
    { id: '3', name: 'sara Ik ' },
   
  ]);
  const navigation = useNavigation();

 
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState({ id: '', name: '' });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSortButtonPress = () => {
    // Sort the classes alphabetically based on the 'name' property
    const sortedClasses = [...classesData].sort((a, b) => a.name.localeCompare(b.name));
    setClassesData(sortedClasses);
  };

  const handleSaveEdit = () => {
    // Implement your logic to save the edited class
    const updatedClasses = classesData.map((item) =>
      item.id === editingGroup.id ? { ...item, name: editingGroup.name } : item
    );
    setClassesData(updatedClasses);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      {/* Header with logo */}
      
      <View style={styles.header}>
        <Text style={styles.logo}>MEMBERS</Text>
        <FontAwesomeIcon name="users" size={30} color="#f2f2f2" style={styles.membersIcon} />
      </View>
      <View><Text style={styles.title}>Management ISI M1 </Text>
      <Text style={styles.title}>          GROUP 1</Text></View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search member" />
        <FontAwesomeIcon name="search" size={20} color="#3A4D39" style={styles.searchIcon} />
      
      </View>

    
      
      {/* Body with classes and add new class button */}
      <View style={styles.body}>
      <View style={styles.classesOrder}>
        <Text style={styles.text}>Members</Text>

        {/* Sort button with icon */}
        <TouchableOpacity style={styles.sortButton} onPress={handleSortButtonPress}>
          <Icon name="sort-alpha-asc" size={20} color="#fff" />
        </TouchableOpacity>
       </View>
        {/* Add new class button */}
        <TouchableOpacity style={styles.addNewClassButton}onPress={() => navigation.navigate(AddMember as never )}>
          <Icon name="plus" size={15} color="#3A4D39" style={styles.plusIcon} />
          <Text style={styles.buttonText}>Add  Member</Text>
        </TouchableOpacity>

        {/* List of classes */}
        <FlatList
          data={classesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
           
            <View style={styles.class}>
              <Text style={styles.textclass}>{item.name}</Text>
              <View style={styles.iconContainer}>
              <FontAwesomeIcon name="user" size={23} color="#454545" style={styles.userIcon} />
              <TouchableOpacity onPress={() => {
    setEditingGroup(item); // Set the class to be edited
    setModalVisible(true); // Open the modal
}}   >
                <Icon name="edit" size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="trash" size={20} color="#333" />
              </TouchableOpacity>
              </View>
            </View>
           
          )}
        />
      </View>

      {/* Edit Class Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} >
        <View style={styles.modalContent}>
          <Text>Edit Group</Text>
          <TextInput
            style={styles.modalInput}
            value={editingGroup.name}
            onChangeText={(text) => setEditingGroup((prev) => ({ ...prev, name: text }))}
          />
          <TouchableOpacity onPress={handleSaveEdit} style={styles.modalButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bottomButton}>
        <FontAwesomeIcon name="hand-paper-o" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.bottomText}>Presence</Text>
        </TouchableOpacity>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 40,
    backgroundColor:'#ECE3CE',
  }, 
  buttonIcon: {
    marginRight: 5,
    left:110,
    
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3A4D39',
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    height:100,
    
  },
  bottomButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
  bottomText:{
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    top:-28,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3A4D39',
    height:75,
    borderBottomEndRadius:30,
    borderBottomLeftRadius:30,
  },
  title:{
    flexDirection: 'row', // Use flexDirection to align icon and text horizontally
    alignItems: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#3A4D39',
    left:70,
    top:20,
  },
  logo: {
    flexDirection: 'row', // Use flexDirection to align icon and text horizontally
    alignItems: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f2f2f2',
    left:40,
  },
  homeIcon: {
    marginRight: 5,
    
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    top:-100,
    
 },
 searchInput: {
  backgroundColor: '#fff',
  padding: 10,
  borderRadius: 10,
  marginTop: 5,
  width: '95%',
  paddingRight: 35, // add padding to the right to prevent text overlap with search icon
  position: 'absolute',
  borderBottomWidth:2,
 },
 searchIcon: {
  position: 'absolute',
  right: 30,
  
 },
  body: {
   
    top: -150,
    padding: 20,
    backgroundColor: '#fff',
    borderLeftColor:"#3A4D39",
    borderLeftWidth:3,
    borderLeftHeight:50,
    width:"80%",
    left:40,
    borderRadius:20,
    alignContent:"center",
  },
  addClassButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#3A4D39',
    left:30,
    fontSize:15,
    fontWeight: 'bold',
  },
  class: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  textclass:{
    fontSize:15,
    left:20,
  },
  text:{
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    left:95,
  },
  classesOrder:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A4D39',
    top:-20,
    left:-20,
    width:287,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  sortButton: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    left:140,
    top:5,
    backgroundColor: 'transparent', // Transparent background
  },
  addNewClassButton: {
    backgroundColor: '#ECE3CE',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    width:200,
    left:30,
  },
 
  plusIcon: {
    marginRight: 5,
    left:30,
    top:2,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  membersIcon: {
    marginRight: 5,
   left:-140,
    
  },
  userIcon:{
    marginRight: 5,
   right: 170,
   top:-2,
     
  },
});

export default Member;