import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import Login from './Login';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

  // ... (validateEmail, validatePassword, and signUp functions)

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
    >
      <View style={styles.contentContainer}>



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
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ... (other styles)
});

export default Signup;
