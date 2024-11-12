import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, Alert, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import CheckBox from 'expo-checkbox';
import SideDrawer from './frontend/SideDraw.js';
import test from './frontend/api.js'
import ip from './frontend/variables.js'

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [x, setX] = useState(3);
  const addTask = (id, done, deadline, plot) => {
    const full_task = (<View key={id} style={styles.title}>
      <CheckBox
        color={done ? 'rgb(80, 120, 80)' : undefined}
        style={styles.checkbox}
        value={done}
        onValueChange={() => {
          console.log(Date.now());
          changedTasks = tasks.map(elem => {
            if (elem.id == id) {
              console.log(elem)
              return { id: elem.id, done: !elem.done, deadline: elem.deadline, plot: elem.plot }
            } else return elem
          })
          console.log(changedTasks)
          setTasks(changedTasks)
          test(id, done, deadline, plot, fetchMessage)
        }}
      />
    <Text style={styles.deadline}>{deadline}</Text>
    <View style={styles.text_container}>
      <Text style={styles.text_main}>{plot}</Text>
    </View>
    </View>)
    return full_task
  }

  const fetchMessage = () => {
    // Twój lokalny adres IP oraz port backendu
    // const serverUrl = `http://192.168.0.13:3000/api/message?x=${x}`; // Wstaw swój adres IP
    const serverUrl = `http://${ip()}:3000/api/message`; // Wstaw swój adres IP
    // Wykonanie zapytania GET
    axios.get(serverUrl)
      .then(response => {
        setTasks(response.data.sort((a, b) => a.id - b.id))
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
          {tasks.map((task) => (
            addTask(task.id, task.done, "20:00", task.plot)
          ))}
        </View>
      </View> 
      </ScrollView>
      <SideDrawer fetchMessage={fetchMessage}/>
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
  checkbox: {
    borderRadius: 5,
    marginLeft: 0,
    alignSelf: 'center',
    height: 20,
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
    fontSize: 16,
    textAlign: 'center'
  }
});

// TODO: Dodać sql do repo
