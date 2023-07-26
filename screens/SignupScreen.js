import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import LogoSvg from '../components/LogoSvg';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [signupError, setSignupError] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
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
      <LogoSvg style={styles.logo} width={150} height={150} />
        {signupError !== '' && <Text style={styles.error}>{signupError}</Text>}
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#393939"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#393939"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#393939"
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
    backgroundColor: '#f1f1f1'
  },
  input: {
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#393939',
    borderRadius: 5,
    fontSize: 18,
    textAlign: 'center',
    color: '#393939'
  },
  logo: {
    alignSelf: 'center',
    bottom: 170
  },
  error: {
    color: 'red',
    marginBottom: 62,
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
    borderColor: '#393939',
    backgroundColor: '#393939',
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
    },
    btn2: {
    borderWidth: 1,
    borderColor: '#393939',
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
    },
    btnText1: {
    textAlign: 'center',
    color: '#f1f1f1',
    fontSize: 20,
    margin: 10,
    },
    btnText2: {
    textAlign: 'center',
    color: '#393939',
    fontSize: 20,
    margin: 10,
    },
});

export default SignupScreen;
