import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Membre from './Membre';
import Presence from './Presence';
import Statistics from './Statistics';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// This stack for all screens of Member
const MemberStack = createNativeStackNavigator();
const MemberScreens = ({ route }: { route: any }) => (
  <MemberStack.Navigator>
    <MemberStack.Screen name='MembreScreens' component={Membre} initialParams={route.params}  options={{ headerShown: false }} />
  </MemberStack.Navigator>
);

// This stack for all screens of Presence
const PresenceStack = createNativeStackNavigator();
const PresenceScreens = ({ route }: { route: any }) => (
  <PresenceStack.Navigator>
    <PresenceStack.Screen name='PresenceScreens' component={Presence} initialParams={route.params}  options={{ headerShown: false }} />
  </PresenceStack.Navigator>
);

// This stack for all screens of Statistics
const StatisticsStack = createNativeStackNavigator();
const StatisticsScreens = ({ route }: { route: any }) => (
  <StatisticsStack.Navigator>
    <StatisticsStack.Screen name='StatisticsScreens' component={Statistics} initialParams={route.params} options={{ headerShown: false }} />
  </StatisticsStack.Navigator>
);
type TabIconName = 'ios-people' | 'ios-people-outline' | 'ios-checkmark-circle' | 'ios-checkmark-circle-outline' | 'ios-stats-chart' | 'ios-stats-chart-outline';

const Tab = createBottomTabNavigator();
const NavigateMember = ({ route }: { route: any }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route : any }) => ({
        tabBarIcon: ({ focused , color, size }: { focused: boolean, color: string, size: number }) => {
          let iconName: TabIconName | undefined;

          if (route.name === 'Students') {
            iconName = focused ? 'ios-people' : 'ios-people-outline';
          } else if (route.name === 'Presence') {
            iconName = focused ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline';
          } else if (route.name === 'Statistics') {
            iconName = focused ? 'ios-stats-chart' : 'ios-stats-chart-outline';
          }

          // Return the icon component with an explicit type assertion
          return <Ionicons name={iconName as TabIconName} size={size} color={color} />;
        },
        tabBarActiveTintColor:"#05BFDB",
        tabBarInactiveTintColor: "gray"
      })}
    >
    <Tab.Screen name="Students" component={MemberScreens} initialParams={route.params} options={{ headerShown: false }} />
    <Tab.Screen name="Presence" component={PresenceScreens} initialParams={route.params} options={{ headerShown: false }}/>
    <Tab.Screen name="Statistics" component={StatisticsScreens} initialParams={route.params}  options={{ headerShown: false }}/>
  </Tab.Navigator>
  )
}

export default NavigateMember

const styles = StyleSheet.create({})