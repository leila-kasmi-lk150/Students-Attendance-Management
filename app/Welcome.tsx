import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Home from './screens/Home';
import Login from './Login';
import Signup from './Signup';

const Welcome = () => {
  const navigation=useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img.png')}
        style={styles.image}
      />
      <View style={styles.title}>
        <Text style={styles.title1}> Students Attendance </Text>
        <Text style={styles.title2}> Leiknach</Text>
      </View>
      <Pressable style={styles.button}>
        <Text style={styles.text} onPress={() => navigation.navigate(Login as never )}>Login</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.text} onPress={() => navigation.navigate(Signup as never )}>SignUp</Text>
      </Pressable>
      {/* <Pressable style={styles.button}>
        <Text style={styles.text} onPress={() => navigation.navigate(Home as never )}>Nafiss</Text>
      </Pressable> */}


    </View>
  )


}

export default Welcome


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // separator: {
  //   marginTop: 1,
  // },

  text: {
    color: "white",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "80%",
    // top: -100,
    backgroundColor: "#05BFDB",
    marginTop: 8,
    borderRadius: 32,
    alignItems: "center",

  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain', // Adjust the resizeMode based on your image requirements
    marginBottom: 0,
  },
  title:{
    marginBottom: 40,
    alignItems: 'center',
  },
  title1:{
    fontWeight: 'bold',
    fontSize: 25
  },
  title2:{
    fontWeight: 'bold',
  }
});