import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import UserHomeScreen from './screens/UserHomeScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import ScheduleSetupScreen from './screens/ScheduleSetupScreen';
import ScheduleStartScreen from './screens/ScheduleStartScreen';
import CommunityScreen from './screens/CommunityScreen';
import ScheduleEditScreen from './screens/ScheduleEditScreen';

import LogoSvg from './components/LogoSvg';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserHome" component={UserHomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScheduleSetup" component={ScheduleSetupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScheduleStart" component={ScheduleStartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Community" component={CommunityScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScheduleEdit" component={ScheduleEditScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserHome' }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
        <LogoSvg style={styles.logo} width={150} height={150} />
          <Text style={styles.h1}>Lava</Text>
        </View>
        <View style={styles.links}>
          <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText1}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.btnText2}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 55,
    backgroundColor: '#f1f1f1',
  },
  content: {
    padding: 25,
    borderRadius: 10,
  },
  header: {
    marginTop: -130,
    marginBottom: 50,
  },
  logo: {
    alignSelf: 'center',
  },
  h1: {
    fontSize: 40,
    textAlign: 'center',
    color: '#393939'
  },
  h2: {
    fontSize: 25,
    color: '#d4d4d4',
    textAlign: 'center',
    opacity: 0.8
  },
  h4: {
    fontSize: 150,
    textAlign: 'center',
  },
  links: {},
  btn1: {
    borderWidth: 1,
    borderColor: '#3E3E3E',
    backgroundColor: '#3E3E3E',
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  btn2: {
    borderWidth: 1,
    borderColor: '#3E3E3E',
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  btnText1: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    margin: 10,
  },
  btnText2: {
    textAlign: 'center',
    color: '#3E3E3E',
    fontSize: 20,
    margin: 10,
  },
});

export default App;
