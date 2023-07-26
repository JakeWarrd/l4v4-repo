import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LogoSvg from '../components/LogoSvg';
import { fetchUserData } from '../components/api';

const CommunityScreen = () => {
  const navigation = useNavigation(); // Access the navigation object
  const [user, setUser] = useState(null);
  const isFocused = useIsFocused();

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

      } catch (error) {
        console.error('Error fetching user data or blocs:', error);
      }
    };

    fetchData();
  }, [isFocused]);

  const handleHome = async () => {
    navigation.navigate('UserHome');   
  }

  return (
    <View style={styles.container}>
        <View style={styles.nav}>
            <LogoSvg style={styles.logo} width={40} height={40} />
            <Text  style={styles.h1}>Community</Text>
        </View>
        <View style={styles.nav2}>
            <TouchableOpacity style={styles.navBtn} onPress={handleHome}>
              <Text style={styles.navText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={handleHome}>
              <Text style={styles.navText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={handleHome}>
              <Text style={styles.navText}>Delete</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Nothing here yet :/</Text>
        </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    flex: 1,
    padding: 55,
  },
  nav: {
    marginTop: 45,
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginLeft: -15
  },
  nav2: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around'
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
  h1: {
    fontSize: 25,
    marginLeft: 5,
    marginTop: 2,
    color: '#393939'
  },
  btn: {
    borderWidth: 1,
    borderColor: '#393939',
    paddingTop: 6,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  fake: {
    opacity: 0
  },
  hello: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#393939',
    marginLeft: -10
  },
  infoContainer: {
    marginTop: 50,
    width: '100%',
    padding: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#393939',
    borderRadius: 10
  },
  infoText: {
      color: '#393939',
      textAlign: 'center'
  }
});

export default CommunityScreen;
