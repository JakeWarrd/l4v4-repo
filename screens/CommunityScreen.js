import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const CommunityScreen = () => {
  const navigation = useNavigation(); // Access the navigation object
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

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

  const handleHome = async () => {
    navigation.navigate('UserHome');   
  }

  return (
    <View style={styles.container}>
        <View style={styles.nav}>
            <SvgXml style={styles.logo} xml={logoSvg} width={40} height={40} />
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
    backgroundColor: '#191919',
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
  btn: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    paddingTop: 6,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#191919',
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  btnText: {
    color: '#191919',
    textAlign: 'center',
  },
  fake: {
    opacity: 0
  },
  hello: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#d4d4d4',
    marginLeft: -10
  },
  infoContainer: {
    marginTop: 50,
    width: '100%',
    padding: 20,
    alignSelf: 'center',
    backgroundColor: '#202020',
    borderRadius: 10
  },
  infoText: {
      color: '#d4d4d4',
      textAlign: 'center'
  }
});

export default CommunityScreen;
