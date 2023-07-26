import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LogoSvg from '../components/LogoSvg';
import { fetchUserData, fetchUserBlocs } from '../components/api';

const UserHomeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const isFocused = useIsFocused();
  const [blocs, setBlocs] = useState([]);

  const handleCreateBloc = () => {
    if (blocs.length >= 2) {
      setErrorMessage('Maximum blocs made. Upgrade for more');
    } else {
      setErrorMessage('');
      navigation.navigate('ScheduleSetup');
    }
  };

  const handleStartBloc = (blocId) => {
    navigation.navigate('ScheduleStart', { blocId });
  };

  const displayBuiltBlocs = () => {
    return blocs.map((bloc) => (
      <TouchableOpacity style={styles.btn2} onPress={() => handleStartBloc(bloc._id)} key={bloc._id}>
        <Text style={styles.btnText2}>{bloc.blocName}</Text>
      </TouchableOpacity>
    ));
  };

  const handleLogout = async () => {
    // Show a confirmation dialog
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            navigation.navigate('Home');
            console.log('Logged out');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleProfile = () => {
    navigation.navigate('UserProfile');
  };

  const handleCommunity = () => {
    navigation.navigate('Community');
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <LogoSvg style={styles.logo} width={40} height={40} />
        <Text style={styles.h1}>Lava</Text>
      </View>
      <View style={styles.nav2}>
        <TouchableOpacity style={styles.navBtn} onPress={handleLogout}>
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={handleCommunity}>
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={handleProfile}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        {user && <Text style={styles.hi}>Hi, {user.username}</Text>}
        <Text style={styles.hi1}>What's the plan for today?</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.btn1} onPress={handleCreateBloc}>
          <Text style={styles.btnText1}>Create Schedule</Text>
        </TouchableOpacity>
        <ScrollView style={styles.blocList}>
          {displayBuiltBlocs()}
        </ScrollView>
      </View>

      {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  nav: {
    marginTop: 100,
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginLeft: 40,
  },
  nav2: {
    marginTop: 15,
    paddingHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navBtn: {
    borderWidth: 1,
    borderColor: '#393939',
    padding: 5,
    width: 90,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },
  navText: {
    color: '#393939',
    textAlign: 'center',
  },
  h1: {
    fontSize: 25,
    marginLeft: 5,
    marginTop: 2,
    color: '#393939',
  },
  hero: {
    marginLeft: 55,
    marginTop: 50,
  },
  hi: {
    fontSize: 25,
    marginBottom: 10,
    color: '#393939',
  },
  hi1: {
    fontSize: 25,
    color: '#393939',
  },
  content: {
    justifyContent: 'center',
    marginHorizontal: 55,
    height: 400,
    marginTop: 45,
  },
  btn1: {
    borderWidth: 1,
    borderColor: '#393939',
    backgroundColor: '#393939',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 25,
  },
  btnText1: {
    textAlign: 'center',
    color: '#f1f1f1',
    fontSize: 20,
    margin: 10,
  },
  btn2: {
    borderWidth: 1,
    borderColor: '#393939',
    backgroundColor: '#f1f1f1',
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  btnText2: {
    textAlign: 'center',
    color: '#393939',
    fontSize: 20,
    margin: 10,
  },
  blocList: {
    flexGrow: 1,
    maxHeight: 380,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default UserHomeScreen;
