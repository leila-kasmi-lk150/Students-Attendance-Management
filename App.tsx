import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import home from './app/home/home';
import clas from './app/class/clas';
import setting from './app/settings/setting';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={home}/>
        <Stack.Screen name="classes" component={clas}/>
        <Stack.Screen name="Settings" component={setting}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

