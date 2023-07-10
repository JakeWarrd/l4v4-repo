import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

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

const ScheduleStartScreen = ({ route }) => {
  const navigation = useNavigation();
  const { blocId } = route.params;
  const [user, setUser] = useState(null);
  const [bloc, setBloc] = useState(null);
  const [nextTaskSet, setNextTaskSet] = useState(null);
  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    // Fetch the bloc details based on the blocId
    const fetchBlocDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('Token not found');
          return;
        }
        const response = await fetch(`http://localhost:4000/user/blocs/${blocId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const blocDetails = await response.json();
          setBloc(blocDetails); // Update the state with the fetched bloc details

            // Find the next task set based on the current time
            const currentTime = moment().format('h A');
            const nextTaskSet = blocDetails.taskSets.find((taskSet) =>
              moment(currentTime, 'h A').isBefore(moment(taskSet.startTime, 'h A'))
            );
            setNextTaskSet(nextTaskSet);

        } else {
          const errorData = await response.json();
          console.log('Failed to fetch bloc details:', errorData.message);
        }
      } catch (error) {
        console.error('Error fetching bloc details:', error);
      }
    };

    fetchBlocDetails();
  }, [blocId, refresh]);

  const handleBack = async () => {
    navigation.navigate('UserHome');
  };

  const handleEditBloc = () => {
    navigation.navigate('ScheduleEdit', { blocId: blocId, blocData: bloc });
  };

  const handleDeleteBloc = async () => {
    // Display confirmation prompt before deleting the bloc
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this bloc?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDeleteBloc },
      ]
    );
  };

  const confirmDeleteBloc = async () => {
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token not found');
        return;
      }
  
      const response = await fetch(`http://localhost:4000/user/blocs/${blocId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        console.log('Bloc deleted successfully');
        navigation.navigate('UserHome'); // Navigate to the home screen or any other desired screen
      } else {
        const errorData = await response.json();
        console.log('Failed to delete bloc:', errorData.message);
      }
    } catch (error) {
      console.error('Error deleting bloc:', error);
    }
  };
  
const isWithinTimeRange = (startTime, endTime) => {
  const currentTime = moment(); // Get the current time
  const formattedStartTime = moment(startTime, 'h A'); // Parse the start time
  const formattedEndTime = moment(endTime, 'h A'); // Parse the end time
  
    // Check if the end time is before the start time, indicating a range that spans across two days
    if (formattedEndTime.isBefore(formattedStartTime)) {
      return currentTime.isSameOrAfter(formattedStartTime) || currentTime.isBefore(formattedEndTime);
    }
    
    // Handle other cases where the start and end time are within the same day
    return currentTime.isAfter(formattedStartTime) && currentTime.isBefore(formattedEndTime);
};

const handleTaskClick = async (taskIndex, taskSetIndex, isChecked) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.log('Token not found');
      return;
    }

    const checked = Boolean(!isChecked); // Convert to boolean

    console.log('=== ' + checked)

    const response = await fetch('http://localhost:4000/user/tasks/update', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        blocId: blocId,
        taskSetIndex: taskSetIndex,
        taskIndex: taskIndex,
        checked: checked,
      })
    });

    if (response.ok) {
      console.log('Task updated successfully');
      setRefresh(prevRefresh => !prevRefresh); // Toggle the value to trigger a refresh
    } else {
      const errorData = await response.json();
      console.log('Failed to update task:', errorData.message);
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

  const convertTo12HourFormat = (hour) => {
    if (hour === 0) {
      return '12 AM'; // Special case for midnight
    } else if (hour < 12) {
      return `${hour}am`; // Morning hours (1 AM - 11 AM)
    } else if (hour === 12) {
      return '12 PM'; // Special case for noon
    } else {
      return `${hour - 12}pm`; // Afternoon/evening hours (1 PM - 11 PM)
    }
  };
  
  const areAllTasksCompleted = () => {
    if (!bloc) {
      return false; // Bloc details are not available yet
    }
  
    for (const taskSet of bloc.taskSets) {
      for (const task of taskSet.tasks) {
        if (!task.checked) {
          return false; // At least one task is not checked
        }
      }
    }
  
    return true; // All tasks are checked
  };

  const isAllTasksCompleted = areAllTasksCompleted();

  
  if (!bloc) {
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
            <SvgXml style={styles.logo} xml={logoSvg} width={40} height={40} />
            <Text style={styles.h1}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
            <SvgXml style={styles.logo} xml={logoSvg} width={40} height={40} />
            <Text style={styles.h1}>{bloc.blocName}</Text>
        </View>
        <View style={styles.nav2}>
            <TouchableOpacity style={styles.navBtn} onPress={handleBack}>
              <Text style={styles.navText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={handleEditBloc}>
              <Text style={styles.navText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={handleDeleteBloc}>
              <Text style={styles.navText}>Delete</Text>
            </TouchableOpacity>
        </View>

      <View style={styles.bloc}>
        {bloc.taskSets
          .filter((taskSet) => isWithinTimeRange(taskSet.startTime, taskSet.endTime))
          .map((taskSet, index) => {
            return (
              <View key={index} style={styles.blocInfo}>
                <Text style={styles.blocBio}>{taskSet.setName}</Text>
                <View style={styles.time}>
                  <Text style={styles.time}>{convertTo12HourFormat(taskSet.startTime)}</Text>
                  <Text style={styles.time}> - </Text>
                  <Text style={styles.time}>{convertTo12HourFormat(taskSet.endTime)}</Text>
                </View>
                {/* <TimeDisplay/> */}
                <View style={styles.taskBox}>
                {taskSet.tasks.map((task, taskIndex) => (
                  <Text
                    style={[
                      styles.task,
                      task.checked ? styles.crossedOutTask : null,
                    ]}
                    key={taskIndex}
                    onPress={() => handleTaskClick(taskIndex, index, task.checked)}
                  >
                    {task.taskName}
                  </Text>
                ))}
                </View>
                {isAllTasksCompleted && <View style={styles.completedBox}><Text style={styles.completedTxt}>All tasks completed!</Text></View>}
              </View>
            );
          })}
        {!bloc.taskSets.some((taskSet) => isWithinTimeRange(taskSet.startTime, taskSet.endTime)) && (
          <View>
            <Text style={styles.errorMessage}>No task sets within the current time range</Text>
          </View>
        )}
      </View>
      <View style={styles.nextTaskContainer}>
        <Text style={styles.nextTaskTitle}>Next Task Set:</Text>
        {nextTaskSet ? (
          <>
            <Text style={styles.nextTaskSetName}>{nextTaskSet.setName}</Text>
            <Text style={styles.nextTaskTime}>
              Starts at {convertTo12HourFormat(nextTaskSet.startTime)}
            </Text>
          </>
        ) : (
          <Text style={styles.noNextTask}>No task set scheduled</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#191919',
  },
  nav: {
    marginTop: 90,
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginLeft: 40
  },
  nav2: {
    marginTop: 15,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  navBtn: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    padding: 5,
    width: 90,
    borderRadius: 5,
    backgroundColor: '#191919',
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
  logo: {
    marginLeft: -10,
  },
  bloc: {
    alignItems: 'center',
    marginTop: 30
  },
  blocInfo: {
    
  },
  blocName: {
    fontSize: 28,
    fontWeight: '500',
    color: '#d4d4d4',
  },
  blocBio: {
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#d4d4d4',
    marginBottom: 5,
    opacity: 0.8
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 19,
    color: '#d4d4d4',
    opacity: 0.9
  },
  taskBox: {
    backgroundColor: '#202020',
    borderRadius: 10,
    padding: 30,
    width: 285,
    marginTop: 30,
  },
  task: {
    textAlign: 'center',
    margin: 15,
    fontSize: 18,
    color: '#d4d4d4',
  },
  crossedOutTask: {
    textDecorationLine: 'line-through',
    opacity: 0.2
  },
  completedBox: {
    color: '#d4d4d4',
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#202020',
    backgroundColor: '#202020',
    marginTop: 20
  },
  completedTxt: {
    color: '#d4d4d4',
    textAlign: 'center',
    fontSize: 18,

  },
  nextTaskContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginBottom: 50
  },
  nextTaskTitle: {
    fontSize: 16,
    color: '#d4d4d4',
    opacity: 0.8
  },
  nextTaskSetName: {
    fontSize: 14,
    color: '#d4d4d4',
    marginTop: 5,
    opacity: 0.6
  },
  nextTaskTime: {
    fontSize: 14,
    marginTop: 5,
    color: '#d4d4d4',
    opacity: 0.6
  },
  noNextTask: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
    color: '#d4d4d4',
  },
  errorMessage: {
    fontSize: 18,
    marginHorizontal: 80,
    textAlign: 'center',
    color: '#d4d4d4',
  }
});

export default ScheduleStartScreen;
