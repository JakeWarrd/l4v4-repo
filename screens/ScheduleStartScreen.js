import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import LogoSvg from '../components/LogoSvg';

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
    const response = await fetch('http://localhost:3000/user', {
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
        const response = await fetch(`http://localhost:3000/user/blocs/${blocId}`, {
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
    // navigation.navigate('ScheduleEdit', { blocId: blocId, blocData: bloc });
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
  
      const response = await fetch(`http://localhost:3000/user/blocs/${blocId}`, {
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

    const response = await fetch('http://localhost:3000/user/tasks/update', {
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
            <LogoSvg width={40} height={40} />
            <Text style={styles.h1}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
            <LogoSvg style={styles.logo} width={40} height={40} />
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
    backgroundColor: '#f1f1f1',
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
    color: '#393939'
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
    color: '#393939',
  },
  blocBio: {
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#393939',
    marginBottom: 5,
    opacity: 1
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 19,
    color: '#393939',
    opacity: 0.9
  },
  taskBox: {
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    padding: 30,
    width: 285,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#393939',
  },
  task: {
    textAlign: 'center',
    margin: 15,
    fontSize: 18,
    color: '#393939',
  },
  crossedOutTask: {
    textDecorationLine: 'line-through',
    opacity: 0.2
  },
  completedBox: {
    color: '#393939',
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#EFEFEF',
    marginTop: 20
  },
  completedTxt: {
    color: '#393939',
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
    color: '#393939',
    opacity: 0.9
  },
  nextTaskSetName: {
    fontSize: 14,
    color: '#393939',
    marginTop: 5,
    opacity: 0.8
  },
  nextTaskTime: {
    fontSize: 14,
    marginTop: 5,
    color: '#393939',
    opacity: 0.8
  },
  noNextTask: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
    color: '#393939',
  },
  errorMessage: {
    fontSize: 18,
    marginHorizontal: 80,
    textAlign: 'center',
    color: '#393939',
  }
});

export default ScheduleStartScreen;
