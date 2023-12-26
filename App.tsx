import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import Group from './app/screens/Group';
import Welcome from './app/Welcome';
import Membre from './app/screens/Membre';
import Presence from './app/screens/Presence';
import Statistics from './app/screens/Statistics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavigateMember from './app/screens/NavigateMember';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='Group' component={Group} options={{ headerShown: false }} />
        <Stack.Screen name='NavigateMember' component={NavigateMember} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}