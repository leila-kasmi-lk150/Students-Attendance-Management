import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Welcome from './app/Welcome';
import Home from './app/screens/Home';




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='Welcome'
      >
        <Stack.Screen 
        name='Welcome'
        component={Welcome}
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen 
        name='Home'
        component={Home}
        options={{
          headerShown: false
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

