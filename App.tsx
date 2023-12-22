import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import AddClass from './app/screens/AddClass';
import EditClass from './app/screens/EditClass';
import Group from './app/screens/Group';
import Welcome from './app/Welcome';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen  name="Welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen  name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name='AddClass' component={AddClass} options={{ headerShown: false }} />
          <Stack.Screen name='EditClass' component={EditClass} options={{ headerShown: false }} />
          <Stack.Screen name='Group' component={Group} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

