import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';

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


const ScheduleSetupScreen = () => {
  const navigation = useNavigation();
  const [blocName, setBlocName] = useState('');
  const [taskSets, setTaskSets] = useState([]);

  const handleBack = async () => {
    navigation.navigate('UserHome');
  };

  const handleCreateTaskSet = () => {
      const newTaskSet = {
        setName: '',
        tasks: [],
        startTime: '',
        startTimePeriod: 'AM', // Set the initial start time period to 'AM'
        endTime: '',
        endTimePeriod: 'AM', // Set the initial end time period to 'AM'
  };
  setTaskSets([...taskSets, newTaskSet]);
  };

  const handleDeleteTaskSet = (setIndex) => {
      const updatedTaskSets = [...taskSets];
      updatedTaskSets.splice(setIndex, 1);
      setTaskSets(updatedTaskSets);
  };

  const handleTaskSetNameChange = (setIndex, value) => {
      const updatedTaskSets = [...taskSets];
      updatedTaskSets[setIndex].setName = value;
      setTaskSets(updatedTaskSets);
  };

  const handleCreateTask = (setIndex) => {
    const updatedTaskSets = [...taskSets];
    const currentTasks = updatedTaskSets[setIndex].tasks;
  
    if (currentTasks.length < 5) { // Check if the current number of tasks is less than 5
      updatedTaskSets[setIndex].tasks.push({ taskName: '' });
      setTaskSets(updatedTaskSets);
    } else {
      console.log('Maximum number of tasks reached.');
    }
  };

  const handleDeleteTask = (setIndex, taskIndex) => {
      const updatedTaskSets = [...taskSets];
      updatedTaskSets[setIndex].tasks.splice(taskIndex, 1);
      setTaskSets(updatedTaskSets);
  };

  const handleTaskNameChange = (setIndex, taskIndex, value) => {
    const updatedTaskSets = [...taskSets];
    const taskName = value.substring(0, 80); // Truncate the input value to the first 100 characters
  
    updatedTaskSets[setIndex].tasks[taskIndex].taskName = taskName;
    setTaskSets(updatedTaskSets);
  };
  

  const handleStartTimeChange = (setIndex, value) => {
      const updatedTaskSets = [...taskSets];
      const militaryHours = value.trim() !== '' ? parseInt(value, 10) : '';
    
      if (militaryHours === '' || (!isNaN(militaryHours) && militaryHours >= 1 && militaryHours <= 12)) {
        updatedTaskSets[setIndex].startTime = militaryHours;
        console.log('START TIME!: ' + updatedTaskSets[setIndex].startTime);
        setTaskSets(updatedTaskSets);
      }
  };

  const handleStartTimePeriodChange = (setIndex, value) => {
      const updatedTaskSets = [...taskSets];
      updatedTaskSets[setIndex].startTimePeriod = value;
      setTaskSets(updatedTaskSets);
    
      console.log('Selected start time period:', value);
  };

  const handleEndTimeChange = (setIndex, value) => {
      const updatedTaskSets = [...taskSets];
      const militaryHours = value.trim() !== '' ? parseInt(value, 10) : '';
    
      if (militaryHours === '' || (!isNaN(militaryHours) && militaryHours >= 1 && militaryHours <= 12)) {
        updatedTaskSets[setIndex].endTime = militaryHours;
        console.log('END TIME!: ' + updatedTaskSets[setIndex].endTime);
        setTaskSets(updatedTaskSets);
      }
  };
    
  const handleEndTimePeriodChange = (setIndex, value) => {
      const updatedTaskSets = [...taskSets];
      updatedTaskSets[setIndex].endTimePeriod = value;
      setTaskSets(updatedTaskSets);
    
      console.log('Selected end time period:', value);
  };

  const handleSaveData = async () => {
     // Validation check for empty task set names
      const isTaskSetNameEmpty = taskSets.some((taskSet) => taskSet.setName.trim() === '');
      if (isTaskSetNameEmpty) {console.log('Task Set Name is required for each task set.'); return;}
      
       // Validation check for empty task names
      const isTaskNameEmpty = taskSets.some((taskSet) => taskSet.tasks.some((task) => task.taskName.trim() === ''));
      if (isTaskNameEmpty) { console.log('Task Name is required for each task.'); return;}

      // Validation check for empty start time
      const isStartTimeEmpty = taskSets.some((taskSet) => taskSet.startTime === '');
      if (isStartTimeEmpty) {console.log('Start Time is required for each task set.'); return;}

      // Validation check for empty end time
      const isEndTimeEmpty = taskSets.some((taskSet) => taskSet.endTime === '');
      if (isEndTimeEmpty) {console.log('End Time is required for each task set.'); return;}

        const updatedTaskSets = taskSets.map((taskSet) => {
          const startTime = taskSet.startTimePeriod === 'AM' ? taskSet.startTime : taskSet.startTime + 12;
          const endTime = taskSet.endTimePeriod === 'AM' ? taskSet.endTime : taskSet.endTime + 12;
      
   
        return {
          setName: taskSet.setName,
          tasks: taskSet.tasks.map((task) => ({ taskName: task.taskName })),
          startTime: startTime,
          endTime: endTime,
        };
      });
    
      const blocData = {
        blocName,
        taskSets: updatedTaskSets,
      };
    
      console.log('Converted startTime:', blocData.taskSets[0].startTime);
      console.log('Converted endTime:', blocData.taskSets[0].endTime);
    
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://localhost:4000/user/saveBloc', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blocData),
        });
    
        if (response.ok) {
          console.log('Data saved successfully');
          navigation.navigate('UserHome');
        } else {
          console.log('Failed to save data');
        }
      } catch (error) {
        console.log('Error:', error);
      }
  };

  const renderTaskSets = () => {
    return (
      <KeyboardAwareScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >
        {taskSets.map((taskSet, setIndex) => (
          <View key={setIndex} style={styles.taskSetContainer}>
            <Text style={styles.h2}>Task Set {setIndex + 1}</Text>
            <KeyboardAvoidingView style={styles.scrollContainer} behavior="padding">
              <TextInput
                style={styles.taskSetInput}
                placeholder="Task Set Name"
                value={taskSet.setName}
                onChangeText={(value) => handleTaskSetNameChange(setIndex, value)}
                placeholderTextColor="gray"
              />
            </KeyboardAvoidingView>
        <View style={styles.timeInputContainer}>
          <View style={styles.timePickerContainer}>

          <TextInput
            style={styles.timeInput}
            placeholder="Start Time (hr)"
            keyboardType="number-pad"
            maxLength={2}
            value={taskSets[setIndex].startTime.toString()}
            onChangeText={(value) => handleStartTimeChange(setIndex, value)}
            placeholderTextColor="gray"
          />

          <Picker
            style={styles.timePicker}
            selectedValue={taskSets[setIndex].startTimePeriod}
            onValueChange={(value) => handleStartTimePeriodChange(setIndex, value)}
            itemStyle={{ color: '#d4d4d4', fontSize: 16 }}
          >
            <Picker.Item label="AM" value="AM" />
            <Picker.Item label="PM" value="PM" />
          </Picker>

          <TextInput
            style={styles.timeInput}
            placeholder="End Time (hr)"
            keyboardType="number-pad"
            maxLength={2}
            value={taskSets[setIndex].endTime.toString()}
            onChangeText={(value) => handleEndTimeChange(setIndex, value)}
            placeholderTextColor="gray"
          />
          <Picker
            style={styles.timePickerR}
            selectedValue={taskSets[setIndex].endTimePeriod}
            onValueChange={(value) => handleEndTimePeriodChange(setIndex, value)}
            itemStyle={{ color: '#d4d4d4', fontSize: 16 }}
          >
            <Picker.Item label="AM" value="AM" />
            <Picker.Item label="PM" value="PM" />
          </Picker>

          </View>
        </View>
        <View style={styles.tasksContainer}>
          {taskSet.tasks.map((task, taskIndex) => (
            <View key={taskIndex} style={styles.taskContainer}>
              <TextInput
                style={styles.taskInput}
                placeholder="Task Name"
                value={task.taskName}
                onChangeText={(value) => handleTaskNameChange(setIndex, taskIndex, value)}
                placeholderTextColor="gray"
              />
              <TouchableOpacity style={styles.delBtn} onPress={() => handleDeleteTask(setIndex, taskIndex)}>
                <Text style={styles.delText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
         <TouchableOpacity style={styles.btn} onPress={() => handleCreateTask(setIndex)}>
          <Text style={styles.btnTxt}>Add Task</Text>
         </TouchableOpacity>

        {setIndex > 0 && (
          <TouchableOpacity style={styles.btnx} onPress={() => handleDeleteTaskSet(setIndex)}>
            <Text style={styles.btnTxtx}>Delete Set</Text>
          </TouchableOpacity>
        )}
      </View>
    ))}
   </KeyboardAwareScrollView>
  );
};

return (
  <View style={styles.container}>
    <View style={styles.nav}>
            <SvgXml style={styles.logo} xml={logoSvg} width={40} height={40} />
            <Text style={styles.h1}>Schedule Setup</Text>
        </View>
        <View style={styles.nav2}>
            <TouchableOpacity style={styles.navBtn} onPress={handleBack}>
              <Text style={styles.navText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn2} onPress={handleCreateTaskSet}>
              <Text style={styles.navText2}>Create Set</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={handleSaveData}>
              <Text style={styles.navText}>Save</Text>
            </TouchableOpacity>
      </View>

    <TextInput
      style={styles.blocNameInput}
      placeholder="Schedule Name"
      value={blocName}
      onChangeText={setBlocName}
      placeholderTextColor="gray"
    />
    {renderTaskSets()}
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 55,
  backgroundColor: '#191919'
},
nav: {
  marginTop: 50,
  paddingHorizontal: 10,
  flexDirection: 'row',
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
navBtn2: {
  borderWidth: 1,
  borderColor: '#d4d4d4',
  padding: 5,
  width: 90,
  borderRadius: 5,
  backgroundColor: '#d4d4d4'
},
navText2: {
  color: '#191919',
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
h2: {
  alignSelf: 'center',
  fontSize: 18,
  marginBottom: 10,
  color: '#d4d4d4',
},
blocNameInput: {
  marginTop: 50,
  borderWidth: 1,
  height: 40,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  fontSize: 18,
  textAlign: 'center',
  color: '#d4d4d4',
},
taskSetContainer: {
  marginBottom: 60,
  marginHorizontal: -50,
  marginTop: -35,
  backgroundColor: '#202020',
  padding: 20,
  borderRadius: 10
},
taskSetInput: {
  borderWidth: 1,
  height: 40,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  fontSize: 18,
  textAlign: 'center',
  color: '#d4d4d4',
},
timeInputContainer: {
  flexDirection: 'row',
  marginBottom: 8,
},
timeInput: {
  flex: 1,
  marginRight: 8,
  padding: 8,
  borderWidth: 1,
  borderColor: 'red',
  color: '#d4d4d4',
},
tasksContainer: {
  marginTop: -38
},
taskContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},
taskInput: {
  flex: 1,
  marginRight: 8,
  padding: 8,
  borderWidth: 1,
  borderColor: 'grey',
  borderRadius: 5,
  color: '#d4d4d4',
},
timeInputContainer: {
  flexDirection: 'row',
  marginBottom: 20,
  marginTop: -15,
  height: 140
},
timePickerContainer: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  overflow: 'hidden',
  marginVertical: 0,
  height: 120
},
timeInput: {
  flex: 1,
  padding: 8,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  color: '#d4d4d4',
},
timePicker: {
  width: 83,
  color: '#191919',
},
timePickerR: {
  width: 83,
  color: '#191919',
  marginRight: -10
},
scrollContainer: {
  flex: 1,
  marginTop: 10
},
scrollContent: {
  padding: 50,
},
btn1: {
  borderWidth: 1,
  borderColor: '#d4d4d4',
  backgroundColor: '#d4d4d4',
  paddingHorizontal: 15,
  borderRadius: 5,
  marginBottom: 25,
  marginTop: 20
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
  backgroundColor: '#d4d4d4',
  marginBottom: 25,
  paddingHorizontal: 15,
  borderRadius: 5,
},
btnText2: {
  textAlign: 'center',
  color: 'black',
  fontSize: 20,
  margin: 10,
},
delBtn: {
  borderWidth: 1,
  borderColor: '#d4d4d4',
  paddingTop: 6,
  paddingHorizontal: 10,
  height: 30,
  borderRadius: 5,
  backgroundColor: '#202020',
},
delText: {
  color: '#d4d4d4',
  textAlign: 'center',
},
btn: {
  borderWidth: 1,
  borderColor: '#d4d4d4',
  backgroundColor: '#d4d4d4',
  width: '38%',
  marginLeft: '31%',
  borderRadius: 5,
  marginTop: 10
},
btnTxt: {
  textAlign: 'center',
  color: '#191919',
  fontSize: 15,
  margin: 8,
},
btnx: {
  borderWidth: 1,
  borderColor: '#d4d4d4',
  backgroundColor: '#202020',
  width: '38%',
    marginLeft: '31%',
  borderRadius: 5,
  marginTop: 20
},
btnTxtx: {
  textAlign: 'center',
  color: '#d4d4d4',
  fontSize: 15,
  margin: 8,
}
});

export default ScheduleSetupScreen;