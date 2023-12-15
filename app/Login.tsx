import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, TextInput, Alert } from 'react-native';
import Signup from './Signup';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  // State for tracking input validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Password should be at least 6 characters
    return password.length >= 6;
  };


  const signIn = async() => {
    // Reset previous error messages
    setEmailError('');
    setPasswordError('');
    // Check if email is empty
    if (!email.trim()) {
      setEmailError('Email cannot be empty');
      return;
    }

    // Check if password is empty
    if (!password.trim()) {
      setPasswordError('Password cannot be empty');
      return;
    }

    // Validate email and password
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password should be at least 6 characters');
      return;
    }
    try {
      const reponse = await signInWithEmailAndPassword(auth, email, password);
      console.log(reponse);
      // Alert.alert('Welcome back', 'Sign in successful!');
    } catch (error : any) {
      console.log(error);
       Alert.alert('Sign in failed', 'Email or password incorrect');

    }
  }

  return (
    <View style={{ flex: 1, padding: 20, width: '100%', maxWidth: 340, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', }}>


      <Image source={require('../assets/attnlg.jpg')} style={{ width: 128, height: 128, marginBottom: 12, }} />

      <Text style={{ fontSize: 26, color: "#05BFDB", fontWeight: 'bold', paddingVertical: 14, }}>Welcome back.</Text>

      <View style={{ margin: 0, bottom: -25, left: -115 }}><Text>Email</Text></View>
      <TextInput
        style={styles.textInput}
        placeholder='Enter your Email'
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={{ margin: 0, bottom: -25, left: -100 }}><Text>Password</Text></View>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        returnKeyType="done"
        secureTextEntry
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}


      <TouchableOpacity style={styles.button}
        onPress={signIn}
      >
        <Text
          style={styles.text}
        >Login</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account </Text>
        <TouchableOpacity >
          <Text style={styles.link} onPress={() => navigation.navigate(Signup as never)}>Sign up</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.row}>
        <TouchableOpacity>
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

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
});

export default Login;