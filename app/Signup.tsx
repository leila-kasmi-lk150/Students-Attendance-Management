
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import Login from './Login';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// import createUserWithEmailAndPassword from 'firebase/auth';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  // State for tracking input validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Password should be at least 6 characters
    return password.length >= 6;
  };

  // sign up finction 
  const signUp = async () => {
    // Reset previous error messages
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    // Check if email is empty
    if (!email.trim()) {
      setEmailError('Email cannot be empty');
      return;
    }
    // Validate email and password
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }

    // Check if password is empty
    if (!password.trim()) {
      setPasswordError('Password cannot be empty');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password should be at least 6 characters');
      return;
    }

    // Check if confirm password is empty
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm Password cannot be empty');
      return;
    }



    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Password and Confirm Password do not match');
      return;
    }
    try {
      const reponse = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(reponse.user);
      console.log(reponse);
      alert('Welcome! Please check your email for verification.');
    } catch (error) {
      console.log(error);
      alert('Signup in failed');
    }
  }
  return (

    <View style={{ flex: 1, padding: 20, width: '100%', maxWidth: 340, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', }}>


      <Image source={require('../assets/attnlg.jpg')} style={{ width: 128, height: 128, marginBottom: 12, }} />

      <Text style={{ fontSize: 26, color: "#05BFDB", fontWeight: 'bold', paddingVertical: 14, }}>Create Account</Text>

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
      <View style={{ margin: 0, bottom: -25, left: -70 }}><Text>Confirm password</Text></View>
      <TextInput
        style={styles.textInput}
        placeholder="Confirm your password"
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
        returnKeyType="done"
        secureTextEntry
      />
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}


      <TouchableOpacity style={styles.button}>
        <Text
          style={styles.text}
          onPress={() => signUp()}
        >Sign up</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account?  </Text>
        <TouchableOpacity >
          <Text style={styles.link} onPress={() => navigation.navigate(Login as never)}>Login</Text>
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

export default Signup;