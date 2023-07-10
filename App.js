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

import { SvgXml } from 'react-native-svg';

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="208.702" height="290.36" viewBox="0 0 208.702 290.36">
  <g id="Group_5" data-name="Group 5" transform="translate(616.351 609.18) rotate(180)">
    <g id="Group_2" data-name="Group 2" transform="translate(1024.005 999.084) rotate(180)">
      <g id="Path_2" data-name="Path 2" transform="translate(616.346 474.564) rotate(90)" fill="none">
        <path d="M-32.419,0H101.35l58.181,104.179L101.35,208.692H-32.419L-84.66,104.179Z" stroke="none"/>
        <path d="M -13.90213012695312 30.00001525878906 L -51.11007690429688 104.200927734375 L -13.87562561035156 178.6922454833984 L 83.71556854248047 178.6922454833984 L 125.1829986572266 104.2027816772461 L 83.74301147460938 30.00001525878906 L -13.90213012695312 30.00001525878906 M -32.41912841796875 1.52587890625e-05 L 101.350227355957 1.52587890625e-05 L 159.5312805175781 104.1794815063477 L 101.350227355957 208.6922454833984 L -32.41912841796875 208.6922454833984 L -84.65976715087891 104.1794815063477 L -32.41912841796875 1.52587890625e-05 Z" stroke="none" fill="#d4d4d4"/>
      </g>
      <path id="Path_3" data-name="Path 3" d="M109.949,109.744l23.162-81.777L166.8,19.214,134.26,134.021,19.214,166.776,27.943,133.1Z" transform="translate(512 444.394) rotate(45)" opacity="0.333"/>
    </g>
  </g>
</svg>
`;


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
      <View style={styles.header}>
      <SvgXml style={styles.logo} xml={logoSvg} width={200} height={200} />
        <Text style={styles.h1}>L4V4</Text>
        <Text style={styles.h2}>daily task flow</Text>
        <Text style={styles.h2}>managment</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: '#191919'
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
    color: '#d4d4d4'
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
    borderColor: '#d4d4d4',
    backgroundColor: '#d4d4d4',
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  btn2: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  btnText1: {
    textAlign: 'center',
    color: '#191919',
    fontSize: 20,
    margin: 10,
  },
  btnText2: {
    textAlign: 'center',
    color: '#d4d4d4',
    fontSize: 20,
    margin: 10,
  },
});

export default App;
