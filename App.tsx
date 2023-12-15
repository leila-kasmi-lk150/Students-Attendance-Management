import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Welcome from './app/Welcome';
import Home from './app/screens/Home';
import Login from './app/Login';
import Signup from './app/Signup';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';




const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator(); 

function InsideLayout(){
  return(
    <InsideStack.Navigator>
      <InsideStack.Screen name='Home' component={Home} />
    </InsideStack.Navigator>
  );
}
function LoginLayout(){
  return(
    <LoginStack.Navigator>
      <LoginStack.Screen name='Welcome' component={Welcome} options={{ headerShown: false}}/>
      <LoginStack.Screen name='Login'component={Login} options={{ headerShown: false}}/>
      <LoginStack.Screen name='Signup'component={Signup} options={{ headerShown: false}}/>
    </LoginStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(()=>{
    onAuthStateChanged(FIREBASE_AUTH, (user) =>{
      console.log('user', user);
      setUser(user);
    });
  },[])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        {user ? (
          // if user login 
          <Stack.Screen name='Home'component={InsideLayout} options={{headerShown: false}}/>
        ) : (
          // else 
          <Stack.Screen name='Login'component={LoginLayout} options={{headerShown: false}}/>
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

