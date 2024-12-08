import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, Alert, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import CheckBox from 'expo-checkbox';
import SideDrawer from './frontend/SideDraw.js';
import { test, checkEventTask } from './frontend/api.js'
import ip from './frontend/variables.js'
import NewTask from './frontend/NewTask.js';
import NewEvent from './frontend/NewEvent.js';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [eventTasks, setEventTasks] = useState([]);
  const [x, setX] = useState(3);
  const addTask = (id, done, deadline, plot, repeat) => {
    const taskDate = new Date(deadline)
    const taskHour = taskDate.getHours()
    const taskMinutes = taskDate.getMinutes()
    const taskTime = `${taskHour.toString().padStart(2, '0')}:${taskMinutes.toString().padStart(2, '0')}`
    const now = new Date();
    const full_task = (<View key={id} style={ (now.getHours() > taskHour || (now.getHours() == taskHour && 
    now.getMinutes() > taskMinutes)) ? styles.titleButRed : styles.title }>
      <CheckBox
        color={done ? 'rgb(80, 120, 80)' : undefined}
        style={styles.checkbox}
        value={done}
        onValueChange={() => {
          changedTasks = tasks.map(elem => {
            if (elem.id == id) {
              return { id: elem.id, done: !elem.done, deadline: elem.deadline, plot: elem.plot, repeat: elem.repeat }
            } else return elem
          })
          setTasks(changedTasks)
          test(id, done, deadline, plot, repeat, fetchMessage)
        }}
      />
    <Text style={styles.deadline}>{taskTime}</Text>
    <View style={styles.text_container}>
      <Text style={styles.text_main}>{plot}</Text>
    </View>
    </View>)
    if (repeat === "wr" && now.getFullYear() == taskDate.getFullYear() && 
    now.getMonth() == taskDate.getMonth() && now.getDay() == taskDate.getDay()) {
      return full_task
    } else if (repeat === "day") {
      return full_task
    } else if (repeat === "week" && now.getDay() == taskDate.getDay()) {
      return full_task
    } else if (repeat === "month" && now.getDate() == taskDate.getDate()) {
      return full_task
    } else if (repeat === "year" && now.getDate() == taskDate.getDate() && now.getMonth() == taskDate.getMonth()) {
      return full_task
    }
  }
  const addEventTask = (id, done, deadline, plot, id_event) => {
    const taskDate = new Date(deadline)
    const taskHour = taskDate.getHours()
    const taskMinutes = taskDate.getMinutes()
    const taskTime = `${taskHour.toString().padStart(2, '0')}:${taskMinutes.toString().padStart(2, '0')}`
    const now = new Date();
    const full_task = (<View key={id} style={ (now.getHours() > taskHour || (now.getHours() == taskHour && 
    now.getMinutes() > taskMinutes)) ? styles.titleButRed : styles.title }>
      <CheckBox
        color={done ? 'rgb(80, 120, 80)' : undefined}
        style={styles.checkbox}
        value={done}
        onValueChange={() => {
          changedTasks = eventTasks.map(elem => {
            console.log(elem)
            if (elem.id == id) {
              return { id: elem.id, done: !elem.done, deadline: elem.deadline, plot: elem.plot, id_event: elem.id_event }
            } else return elem
          })
          setEventTasks(changedTasks)
          checkEventTask(id, done, deadline, plot, id_event, fetchMessage)
        }}
      />
    <Text style={styles.deadline}>{taskTime}</Text>
    <View style={styles.text_container}>
      <Text style={styles.text_main}>{plot}</Text>
    </View>
    </View>)
    return full_task
  }

  const fetchMessage = () => {
    const serverUrl = `http://${ip()}:3000/api/message`; // Wstaw swój adres IP
    // Wykonanie zapytania GET
    axios.get(serverUrl)
      .then(response => {
        if (Array.isArray(response.data)) {
          setTasks((response.data.sort((a, b) => {
            if (new Date(a.deadline).getHours() == new Date(b.deadline).getHours()) {
              return new Date(a.deadline).getMinutes() - new Date(b.deadline).getMinutes()
            }
            return new Date(a.deadline).getHours() - new Date(b.deadline).getHours()
        })))}
      })
      .catch(error => {
        console.error('Błąd połączenia z serwerem:', error);
        setMessage('Błąd połączenia z serwerem');
      });
    const secondServerUrl = `http://${ip()}:3000/api/event/tasks/specific`;
    axios.get(secondServerUrl)
      .then(response => {
        if (Array.isArray(response.data)) {
          setEventTasks((response.data.sort((a, b) => {
            if (new Date(a.deadline).getHours() == new Date(b.deadline).getHours()) {
              if (new Date(a.deadline).getMinutes() == new Date(b.deadline).getMinutes()) {
                return a.id - b.id
              }
              return new Date(a.deadline).getMinutes() - new Date(b.deadline).getMinutes()
            }
            return new Date(a.deadline).getHours() - new Date(b.deadline).getHours()
        })))}
      })
      .catch(error => {
        console.error('Błąd połączenia z serwerem:', error);
        setMessage('Błąd połączenia z serwerem');
      });
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}
  style={styles.scrollView}>
      <View style={styles.mask}>
        <View style={styles.main_container}>
          {tasks.map(task => (
            addTask(task.id, task.done, task.deadline, task.plot, task.repeat)
          ))}
          {eventTasks.map(task => (
            addEventTask(task.id, task.done, task.deadline, task.plot, task.id_event)
          ))}
        </View>
      </View> 
      </ScrollView>
      <SideDrawer fetchMessage={fetchMessage}/>
      <NewTask fetchMessage={fetchMessage}/>
      <NewEvent fetchMessage={fetchMessage}/>
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black'
  },
  scrollViewContent: {
  },
  scrollView: {
    padding: 0,
    marginHorizontal: 0, // Marginesy wokół ScrollView
    width: '100%',
  },
  text_container: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: 'rgb(210, 210, 210)',
    paddingLeft: 10,
    alignItems: 'center', 
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    borderRadius: 10,
    flexDirection: "row",
    flex: 1,
    gap: 10,
    backgroundColor: 'rgb(250, 250, 255)',
    width: '100%',
    // Cień dla iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Cień dla Androida
    elevation: 10,
    padding: 10,
    marginBottom: 10,
  },
  titleButRed: { //TODO
    borderRadius: 10,
    flexDirection: "row",
    flex: 1,
    gap: 10,
    backgroundColor: 'rgb(250, 220, 220)',
    width: '100%',
    // Cień dla iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Cień dla Androida
    elevation: 10,
    padding: 10,
    marginBottom: 10,
  },
  checkbox: {
    borderRadius: 5,
    marginLeft: 0,
    alignSelf: 'center',
    height: 30,
    width: 30,
    borderColor: 'rgb(110, 110, 110)',
  },
  deadline: {
    fontSize: 20,
    alignSelf: 'center',
  },
  screen: {
    margin: 0,
    padding: 0,
    backgroundColor: 'rgb(250, 250, 255)',
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  mask: {
    paddingBottom: 160,
    marginLeft: 30,
    marginTop: 60,
    justifyContent: 'space-between',
    height: '90%',
    width: '90%',
    alignItems: 'center',
  },
  button: {
    height: 40,
    width: '100%',
  },
  main_container: {
    width: '100%',
    height: '92.5%',
  },
  main: {  
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  text_main: {
    width: '100%',
    alignSelf: 'center',
    color: 'rgb(30, 30, 30)',
    fontSize: 20,
    textAlign: 'center'
  }
});

// TODO: Dodać sql do repo
