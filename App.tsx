import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import home from './app/home/home';
import clas from './app/class/clas';
import setting from './app/settings/setting';
import { Constants } from 'expo-constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text } from 'react-native'



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={{headerShown: false}}
        >
          <Tab.Screen
          name='Home'
          component={home}
          options={{
            tabBarIcon:({color, size})=>(
              <Ionicons name='home' size={size} color={color}/>
            )
          }}>
          
          </Tab.Screen>
    
          <Tab.Screen
          name='Class'
          component={clas}
          options={{
            tabBarIcon:({color, size})=>(
              <Ionicons name='people' size={size} color={color}/>
            )
          }}>
          
          </Tab.Screen>
        
          <Tab.Screen
          name='Settings'
          component={setting}
          options={{
            tabBarIcon:({color, size})=>(
              <Ionicons name='settings' size={size} color={color}/>
            )
          }}>
          
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    // marginTop: Constants.statusBarHeight,
    // tabBarShowLabel: false,
    // headerShown: false,
  },
});