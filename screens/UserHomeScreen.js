import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

const UserHomeScreen = () => {
  const navigation = useNavigation(); // Access the navigation object
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const isFocused = useIsFocused(); // Check if the screen is currently focused
  const [blocs, setBlocs] = useState([]);


  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token not found');
        return;
      }
      console.log(token)
      // Send a request to the server to retrieve user data
      const response = await fetch('http://localhost:4000/user', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
        const userData = await response.json();
        
        setUser(userData);
      } else {
        // Handle error response
        const errorData = await response.json();
        console.log('Failed to fetch user data:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  

  };

  const handleCreateBloc = () => {
    if (blocs.length >= 2) {
      setErrorMessage('Maximum blocs made. Upgrade for more');
    } else {
      setErrorMessage(''); // Clear the error message if it was previously set
      navigation.navigate('ScheduleSetup'); // Navigate to the bloc setup screen
    }
  
  };

  const handleStartBloc = (blocId) => {
    navigation.navigate('ScheduleStart', { blocId });
  };

  const fetchUserBlocs = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token not found');
        return;
      }

      const response = await fetch('http://localhost:4000/user/blocs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userBlocs = await response.json();
        setBlocs(userBlocs); // Update the state with the fetched blocs
      } else {
        const errorData = await response.json();
        console.log('Failed to fetch user blocs:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching user blocs:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchUserBlocs();
  }, [fetchUserBlocs, isFocused]);

  const displayBuiltBlocs = () => {
    return blocs.map((bloc) => (
      <TouchableOpacity style={styles.btn2} onPress={() => handleStartBloc(bloc._id)} key={bloc._id}>
        <Text style={styles.btnText2}>{bloc.blocName}</Text>
      </TouchableOpacity>
    ));
  };

  const handleLogout = async () => {
    // Delete token from local storage
    await AsyncStorage.removeItem('token');
    // Redirect to login/signup homepage
    navigation.navigate('Home');
    console.log('Logged out');
  };

  const handleProfile = async () => {
    navigation.navigate('UserProfile');
  }

  const handleCommunity = async () => {
    navigation.navigate('Community');
  }


  return (
    <View style={styles.back}>
        <View style={styles.nav}>
            <SvgXml style={styles.logo} xml={logoSvg} width={40} height={40} />
            <Text style={styles.h1}>L4V4</Text>
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
          <Text style={styles.hi1}>Whats the plan for today?</Text>
        </View>

        <View style={styles.container}>
            <TouchableOpacity style={styles.btn1} onPress={handleCreateBloc}>
              <Text style={styles.btnText1}>Create Schedule</Text>
            </TouchableOpacity>
            <ScrollView style={styles.blocList}>
               <View>{displayBuiltBlocs()}</View>
            </ScrollView>
        </View>
        {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    backgroundColor: '#191919',
    flex: 1
  },
  container: {
    justifyContent: 'center',
    marginHorizontal: 55,
    height: 400,
    marginTop: 45
  },
  nav: {
    marginTop: 100,
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginLeft: 40
  },
  nav2: {
    marginTop: 15,
    paddingHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  navBtn: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    padding: 5,
    width: 90,
    borderRadius: 5,
    backgroundColor: '#191919'
  },
  navText: {
    color: '#d4d4d4',
    textAlign: 'center',
  },
  h1: {
    fontSize: 25,
    marginLeft: 5,
    marginTop: 2,
    color: '#d4d4d4'
  },
  hero: {
    marginLeft: 55,
    marginTop: 50,
  },
  hi: {
    fontSize: 25,
    marginBottom: 10,
    color: '#d4d4d4',
  },
  hi1: {
    fontSize: 25,
    color: '#d4d4d4',
  },   
  infoContainer: {
    marginTop: 120,
  },
  logo: {
    width: 10,
    height: 10
  },
  blocList: {
    flexGrow: 1,
    maxHeight: 380,
    marginBottom: 20,
  },
  btn1: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    backgroundColor: '#d4d4d4',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 25
  },
  btnText1: {
    textAlign: 'center',
    color: '#191919',
    fontSize: 20,
    margin: 10,
  },
  btn2: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    backgroundColor: '#191919',
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  btnText2: {
    textAlign: 'center',
    color: '#d4d4d4',
    fontSize: 20,
    margin: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10
  }
});

export default UserHomeScreen;
