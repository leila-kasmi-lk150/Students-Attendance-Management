import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Welcome from './app/Welcome';
import Home from './app/screens/Home';
import Login from './app/Login';
import Signup from './app/Signup';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';




const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

function InsideLayout({ user }: { user: User | null }) {
  // Check if the user is logged in and their email is verified
  const isEmailVerified = user?.emailVerified;
  const navigation=useNavigation();

  return (
    <InsideStack.Navigator>
      {isEmailVerified ? (
        // If email is verified, show the Home screen
        <InsideStack.Screen name="Home" component={Home} />
      ) : (
        // If email is not verified, show a screen prompting the user to verify
        <InsideStack.Screen
          name="Verify Email"
          component={() => (
            <View style={styles.verifyEmailContainer}>
              <Image
                source={require('./assets/email.png')}
                style={styles.image}
              />
              <Text style={{
                fontSize: 18,
                marginBottom: 20,
                color: '#000',
                fontWeight: 'bold'
              }}>
                Verify your email
              </Text>
              <Text style={styles.verifyEmailText}>
                Please verify your email to access the Home screen.
              </Text>
              {/* Add a button to trigger email verification */}
             <Pressable
                style={styles.verifyEmailButton}
                onPress={() => navigation.navigate(Login as never )}
              >
                <Text style={styles.verifyEmailButtonText}>Login Now</Text>
              </Pressable> 
            </View>
          )}
        />
      )}
    </InsideStack.Navigator>
  );
}
function LoginLayout() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }} />
      <LoginStack.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <LoginStack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
    </LoginStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {user ? (
          // If user is logged in, pass the user object to InsideLayout
          <Stack.Screen
            name="Home"
            component={() => <InsideLayout user={user} />}
            options={{ headerShown: false }}
          />
        ) : (
          // If user is not logged in, show the LoginLayout
          <Stack.Screen name="Login" component={LoginLayout} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  verifyEmailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain', // Adjust the resizeMode based on your image requirements
    marginBottom: 0,
  },
  verifyEmailText: {
    fontSize: 12,
    marginBottom: 20,
    color: 'gray',
  },
  verifyEmailButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "80%",
    // top: -100,
    backgroundColor: "#05BFDB",
    marginTop: 8,
    borderRadius: 15,
    alignItems: "center",
  },
  verifyEmailButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});