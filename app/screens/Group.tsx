import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet,TextInput, ScrollView, FlatList } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { clas, colors } from '../component/Constant'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AddClass from './AddClass';
import EditClass from './EditClass';
import Home from './Home';

const Group = () => {
  const navigation=useNavigation();
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
        <TouchableOpacity style={styles.addNewClassButton} onPress={() => navigation.navigate(AddClass as never )}>
          <Icon name="plus" size={15} color="white" style={styles.plusIcon} />
          <Text style={styles.buttonText}>Add New Group</Text>
        </TouchableOpacity>
      </View>


      {/* classes */}
      <View style={{marginTop: 22}}>
       
        <Text style={{fontSize: 22, fontWeight: 'bold',}}>Groups</Text>
        <View>
          <FlatList data={clas} renderItem={({item })=>
              <View style={{backgroundColor: colors.light, shadowColor: "#000", shadowOffset:{width: 0, height:4},shadowOpacity:0.1, shadowRadius:7,borderRadius:16, marginVertical: 16, alignItems: 'center', }}>
                <TouchableOpacity style={{flexDirection: 'row', paddingLeft: 20,paddingRight: 20, paddingTop:30, paddingBottom:30 }}>
                  <Text style={{flex: 1}}>{item.nameClass} {item.speciality} {item.Level}</Text>
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
});