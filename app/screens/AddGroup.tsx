import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddGroup = () => {
    const [name, setName] = useState('');
    const [Type, setType] = useState('');
    const [Time, setTime] = useState('');
    const [Day, setDay] = useState('');

    const handleAddGroup = () => {
        // Add the class data to the classesData array
        console.log('Added new Group:', { name, Type, Time ,Day });

        // Clear the input fields and reset the states
        setName('');
        setTime('');
        setType('');
        setDay('');
    };

    const handleCancel = () => {
        // Clear the input fields and reset the states
        setName('');
        setTime('');
        setType('');
        setDay('');
    };

    return (
        <View style={styles.container}>
               <View style={styles.header}>
            <Text style={styles.titleText}>Add new Group</Text>
            <Icon name="plus" size={25} color="#fff" style={styles.AddIcon} />
               </View>
               <View style={styles.body}>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Name </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Type </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Type"
                    value={Type}
                    onChangeText={setType}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Time </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Time"
                    value={Time}
                    onChangeText={setTime}
                />
                 
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Day </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Day"
                    value={Day}
                    onChangeText={setDay}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddGroup}>
                    <Text style={styles.buttonText}>Add Group</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#ECE3CE',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#3A4D39',
        height:75,
        borderBottomEndRadius:30,
        borderBottomLeftRadius:30,
        fontSize: 30,
        fontWeight: 'bold',
        color:"#fff",
       
      },  
      body:{
      top:100,
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
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color:"#fff",
        left:40,
        top:5,
 
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
    fontWeight: 'bold',
    width: '30%',

    },
    input: {
        width: 180,
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        left: 5 ,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3A4D39',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '60%',
        margin:2,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    AddIcon: {
        marginRight: 5,
        right:200,
        top:9
      },
});

export default AddGroup;