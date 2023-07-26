import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import LogoSvg from '../components/LogoSvg';

const LoginScreen = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Access the navigation object
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { token } = responseData;

        // Store the token in AsyncStorage
        await AsyncStorage.setItem('token', token);

        console.log('User logged in successfully');
        // Redirect to UserHomeScreen
        navigation.navigate('UserHome');
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.log('Login error:', errorData.message);
        // Handle validation errors, e.g., display error messages to the user
        setLoginError(errorData.message);
      } else {
        const errorData = await response.json();
        console.log('Login error:', errorData.message);
        // Handle login error, e.g., display an error message to the user
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle network or server errors
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
        {loginError !== '' && <Text style={styles.error}>{loginError}</Text>}
          <View style={styles.header}>
              <TextInput
                style={styles.input}
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChangeText={setUsernameOrEmail}
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
          <TouchableOpacity style={styles.btn1} onPress={handleLogin}>
            <Text style={styles.btnText1}>Login</Text>
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
    bottom: 280
  },
  error: {
    color: 'red',
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
    position: 'absolute',
    bottom: 543,
    left: 0,
    right: 0,
  },
  header: {
    marginTop: -250,
    marginBottom: 10,
  },
    links: {
      marginBottom: -150
    },
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

export default LoginScreen;

