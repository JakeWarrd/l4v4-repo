import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LogoSvg from '../components/LogoSvg';
import { fetchUserData, fetchUserBlocs } from '../components/api';

const UserProfileScreen = () => {
  const navigation = useNavigation(); // Access the navigation object
  const isFocused = useIsFocused(); // Check if the screen is currently focused

  const [user, setUser] = useState(null);
  const [blocs, setBlocs] = useState([]);
  const [newUsername, setNewUsername] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('Token not found');
          return;
        }

        const userData = await fetchUserData(token);
        setUser(userData);

        const userBlocs = await fetchUserBlocs(token);
        setBlocs(userBlocs);
      } catch (error) {
        console.error('Error fetching user data or blocs:', error);
      }
    };

    fetchData();
  }, [isFocused]);

  const handleChangeUsername = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
    
      const response = await fetch(`http://localhost:3000/user/change-username`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newUsername })
      });

      if (response.ok) {
        console.log('Success', 'Username changed successfully');
        setNewUsername('');
      } else {
        const errorData = await response.json();
        console.log('Error', errorData.message);
      }
    } catch (error) {
      console.error('Error changing username:', error);
      console.log('Error', 'Failed to change username');
    }
  };

  const handleHome = () => {
    navigation.navigate('UserHome');
  };

  const getCompletedTaskCount = useCallback((bloc) => {
    let completedTasks = 0;
    let totalTasks = 0;

    bloc.taskSets.forEach((taskSet) => {
      taskSet.tasks.forEach((task) => {
        if (task.checked) {
          completedTasks++;
        }
        totalTasks++;
      });
    });

    return `${completedTasks}/${totalTasks}`;
  }, []);

  const blocData = useMemo(() => {
    return blocs.map((bloc) => {
      const completedTaskCount = getCompletedTaskCount(bloc);
      const [completedTasks, totalTasks] = completedTaskCount.split('/'); // Split the completedTasks string to get the values

      const isAllTasksCompleted = completedTasks === totalTasks;

      return (
        <View key={bloc._id} style={styles.blocDataContainer}>
          <Text style={[styles.bloc, isAllTasksCompleted && styles.crossedOut]}>{bloc.blocName}: </Text>
          <Text style={[styles.taskCount, isAllTasksCompleted && styles.crossedOut]}>{completedTaskCount} </Text>
          <Text style={[styles.taskTxt, isAllTasksCompleted && styles.crossedOut]}>tasks completed</Text>
        </View>
      );
    });
  }, [blocs, getCompletedTaskCount]);

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.nav}>
        <LogoSvg style={styles.logo} width={40} height={40} />
        {user && <Text style={styles.hello}>{user.username}'s Profile</Text>}
      </View>
      <View style={styles.nav2}>
        <TouchableOpacity style={styles.navBtn} onPress={handleHome}>
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Profile </Text>
        {user && <Text style={styles.name}>Username: {user.username}</Text>}
        <TextInput
          style={styles.input}
          placeholder="New Username"
          value={newUsername}
          onChangeText={setNewUsername}
          placeholderTextColor='gray'
        />
        <TouchableOpacity style={styles.btn} onPress={handleChangeUsername}>
          <Text style={styles.btnText}>Change Username</Text>
        </TouchableOpacity>
        {user && <Text style={styles.email}>Email: {user.email}</Text>}
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.title}>Todays Data</Text>
        <View>{blocData}</View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    flex: 1,
    padding: 55,
  },
  nav: {
    marginTop: 46,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  nav2: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  navBtn: {
    borderWidth: 1,
    borderColor: '#393939',
    padding: 5,
    width: 90,
    borderRadius: 5,
    backgroundColor: '#f1f1f1'
  },
  navText: {
    color: '#393939',
    textAlign: 'center',
  },
  logo: {
    width: 10,
    height: 10,
    marginLeft: -15
  },
  btn: {
    borderWidth: 1,
    borderColor: '#393939',
    paddingTop: 6,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#393939',
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  btnText: {
    color: '#f1f1f1',
    textAlign: 'center',
  },
  fake: {
    opacity: 0
  },
  hello: {
    fontSize: 25,
    marginLeft: 5,
    marginTop: 2,
    color: '#393939'
  },
  infoContainer: {
    marginTop: 50,
    width: '100%',
    padding: 20,
    alignSelf: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#393939',
  },
  title: {
    color: '#393939',
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: '#393939',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#393939',
    borderRadius: 5,
    textAlign: 'center'
  },
  name: {
    color: '#393939',
    marginBottom: 20,
    marginTop: 20
  },
  email: {
    color: '#393939',
    marginTop: 20
  },
  dataContainer: {
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#393939',
    borderRadius: 10,
    padding: 20,
    marginTop: 20
  },
  blocDataContainer: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#393939',
    borderRadius: 5,
    padding: 10,
    marginTop: 20
  },
  bloc: {
    color: '#393939',
    fontWeight: 600
  },
  taskCount: {
    color: '#393939'
  },
  taskTxt: {
    color: '#393939',
    opacity: 0.8
  },
  crossedOut: {
    textDecorationLine: 'line-through'
  },
});

export default UserProfileScreen;
