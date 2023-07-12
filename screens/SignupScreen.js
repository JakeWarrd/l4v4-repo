import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [signupError, setSignupError] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { token } = responseData;
        await AsyncStorage.setItem('token', token);

        console.log('User logged in successfully');
        navigation.navigate('UserHome');
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.log('Signup error:', errorData);
        setSignupError(errorData.message);
      } else {
        const errorData = await response.json();
        console.log('Signup error:', errorData.message);
        setSignupError(errorData.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleBack = async () => {
    navigation.navigate('Home');
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
      <SvgXml style={styles.logo} xml={logoSvg} width={150} height={150} />
        {signupError !== '' && <Text style={styles.error}>{signupError}</Text>}
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#fff9"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#fff9"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#fff9"
          />
        </View>
        <View style={styles.links}>
          <TouchableOpacity style={styles.btn1} onPress={handleSignup}>
            <Text style={styles.btnText1}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={handleBack}>
            <Text style={styles.btnText2}>Back</Text>
          </TouchableOpacity>
      </View>
      </View>
  </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: '#191919'
  },
  input: {
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 18,
    textAlign: 'center',
    color: '#fff'
  },
  logo: {
    alignSelf: 'center',
    bottom: 170
  },
  error: {
    color: 'red',
    marginBottom: 25,
    fontSize: 16,
    textAlign: 'center',
    position: 'absolute',
    bottom: 543,
    left: 0,
    right: 0,
  },
  header: {
    marginTop: -160,
    marginBottom: 10,
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

export default SignupScreen;
