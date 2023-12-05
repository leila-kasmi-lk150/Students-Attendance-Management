import {View, Text, StyleSheet, TextInput, ActivityIndicator, Button, Pressable} from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () =>{
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [loading, setLoading]=useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try{
            const reponse = await signInWithEmailAndPassword(auth,email,password);
            console.log(reponse);
        }catch (error: any){
            console.log(error);
            alert('Sign In failed: ' + error.message)
        }finally{
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try{
            const reponse = await createUserWithEmailAndPassword(auth, email,password);
            console.log(reponse);
            alert('Check your email!');
        }catch (error: any){
            console.log(error);
            alert('Sign In failed: ' + error.message)
        }finally{
            setLoading(false);
        }
    }
    return (
        <View style={styles.container}>
            <keyboardAvoidingView behavior="padding"> 
            <Text style={{ 
                fontWeight: "bold",
                color: "yourDesiredColor",
                fontSize: 30, // Adjust the size as needed
                textAlign: "center",
                top: -70,
                }} >
                    Sign In
            </Text>

            <Text style={{
                color: "#000000",
                top: -60,
                }} >
                    Not a member ?  <Text style={[styles.text, styles.registerTextLink]} > Sign Up Now</Text>
            </Text>

            <Text style={[styles.textsE]}>Email</Text>
            <TextInput
                style={styles.textInput1}
                value={email}
                placeholder="Type email"
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}
            />
            
            <Text style={styles.texts}>Password</Text>
            <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Type password"
                secureTextEntry
            />
            <Text style={[styles.text, styles.ForgetTextLink]} >forget password ?</Text>
            <View style={styles.separator} />
            { loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                <Pressable onPress={signUp} style={styles.button}>
                    <Text style={styles.text}>Login</Text>
                </Pressable>
                </>
            )}
            </keyboardAvoidingView>
        </View>
    );
};

export default Login


// Styles 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    separator: {
      marginTop: 1,
    },
    
    textInput1: {
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: "grey",
      marginTop: 40,
      width: "80%",
      height:50,
      borderRadius: 32,
      top:-50,
    },
    textInput: {
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: "grey",
      marginTop: 40,
      width: "80%",
      height:50,
      borderRadius: 32,
      top:-110,
    },
    text: {
      color: "white",
    },   
    texts: {
      color: "#05BFDB",
      left:-90,
      marginTop:30,
      top:-70,
    },
    textsE: {
      color: "#05BFDB",
      left:-100,
      marginTop:30,
      top:-10,
    },  
    registerTextLink: {
      color: "#05BFDB", // Change "yourDesiredColor" to the color you want
      marginTop: 8,
      textDecorationLine: "underline",
      marginLeft :150,
    },
    registerText: {
      color: "#05BFDB", // Change "yourDesiredColor" to the color you want
    },
    ForgetTextLink:{
      color: "#05BFDB",
      marginTop:10,
      marginLeft:160,
      top:-110,
    },
    button: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      width: "80%",
      top:-100,
      backgroundColor: "#05BFDB",
      marginTop: 8,
      borderRadius: 32,
      alignItems: "center",
      
    },
    lineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      margin:30,
      top:-100,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: 'grey', // لون الخط، يمكن تعديله
    },
    orText: {
      marginHorizontal: 10,
      color: 'grey', // لون النص "OR"، يمكن تعديله
    },
  });

function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
  