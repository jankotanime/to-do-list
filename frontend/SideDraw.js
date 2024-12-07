import React, { useRef, useState } from 'react';
import { Button, TextInput, Alert, TouchableOpacity, Image, Animated, View, Text, StyleSheet, Dimensions, PanResponder, ScrollView, FlatList } from 'react-native';
import { setNewTask } from './NewTask';
import { setNewEvent } from './NewEvent';
import axios from 'axios';
import ip from './variables';
import CheckBox from 'expo-checkbox';
import { eventChanger, deleteEvent } from './api';

const SCREEN_WIDTH = Dimensions.get('window').width;


export default function SideDrawer({fetchMessage}) {
  const serverUrl = `http://${ip()}:3000/api/event`;
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH * 0.9)).current; // Start panelu poza ekranem
  const [isSettings, setSettings] = useState(false);
  const [addEvent, setEvent] = useState(false);
  const [events, setEvents] = useState([]);

  const deleteAlert = (id, name, checked, fetchMessage) => {
    Alert.alert(
      "Confirm delete",
      `Are you sure you want to delete task ${name}?`,
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => deleteEvent(id, name, checked, fetchMessage),
        },
      ],
      { cancelable: true }
    );
  };
  

  const addEventTitle = (id, name, checked, fetchMessage) => {
    const full_event = (
      <View key={id} style={styles.title}>
      <CheckBox
        color={checked ? 'rgb(80, 120, 80)' : undefined}
        style={styles.checkbox}
        value={checked}
        onValueChange={() => {
          changedEvents = events.map(elem => {
            if (elem.id == id) {
              return { id: elem.id, name: elem.name, checked: !elem.checked }
            } else return elem
          })
          setEvents(changedEvents)
          eventChanger(id, name, checked, fetchMessage)
        }}
        />
      <View style={styles.text_container}>
        <Text style={styles.text_main}>{name}</Text>
      </View>
      <View style={styles.right}>
          <TouchableOpacity onPress={() => setNewEvent(id, name)}>
            <Image source={require('./../images/edit.png')} style={styles.imageTitle}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {deleteAlert(id, name, checked, fetchMessage)}}>
            <Image source={require('./../images/bin.png')} style={styles.imageTitle}/>
          </TouchableOpacity>
      </View>
      </View>
    )
    return full_event
  }

  // PanResponder do obsługi gestów przesuwania
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)+20;
      },
      onPanResponderMove: (event, gestureState) => {
        axios.get(serverUrl).then(response => {
        if (Array.isArray(response.data)) {
          setEvents((response.data.sort((a, b) => a.id - b.id)))
        }})
        if (gestureState.dx > 0) {
          Animated.timing(translateX, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx < 0) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH * 0.9,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const settings = () => {
    Alert.alert('ustawienia');
  }

  isSettings ? settings() : undefined

  return (
    <Animated.View
      style={[styles.drawer, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers} // Gesty przesuwania dla całego panelu
    >
      <View style={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity onPress={setSettings}>
            <Image source={require('./../images/settings.png')} style={styles.image}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={setNewTask}>
        <View style={styles.container}>
            <Text style={styles.text}>Add new task</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setNewEvent(0, '')}>
        <View style={styles.container}>
            <Text style={styles.text}>Add new event</Text>
        </View>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}>
        <View style={styles.events}>
          {events.map(event => (
            addEventTitle(event.id, event.name, event.checked, fetchMessage)
          ))}
        </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  right: {
    flexDirection: 'column',
    gap: '15%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    width: 30,
    height: 30,
    marginLeft: 10
  },
  squarePicker: {
    width: 50,
    height: 70,
    position: 'absolute',
    left: '90%',
    top: -5,
    backgroundColor: 'rgb(250, 250, 250)',
    borderColor: "rgb(0, 0, 0)",
    borderWidth: 1,
  },
  dots: {
    justifyContent: 'center',
    width: 30
  },
  title: {
    position: 'relative',
    overflow: 'visible',
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
    height: 30,
    width: 30,
    borderColor: 'rgb(110, 110, 110)',
  },
  text_main: {
    width: '100%',
    alignSelf: 'center',
    color: 'rgb(30, 30, 30)',
    fontSize: 20,
    textAlign: 'center'
  },
  scrollViewContent: {
  },
  scrollView: {
    padding: 0,
    marginHorizontal: 0, // Marginesy wokół ScrollView
    width: '100%',
    height: '50%',
    marginTop: 20,
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
  },
  text_container: {
    marginBottom: 10,
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: 'rgb(210, 210, 210)',
    paddingLeft: 10,
    alignItems: 'center', 
    justifyContent: 'center',
    height: '100%',
  },
  inputText: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  text: {
    fontSize: 16
  },
  drawer: {
    height: '100%',
    position: 'absolute',
    left: 20,
    top: 0,
    width: SCREEN_WIDTH * 0.9, // Panel zajmuje 75% szerokości ekranu
    backgroundColor: 'rgb(240, 240, 250)',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 10,
    elevation: 10,
  },
  events: {
    paddingTop: 10,
    width: '100%',
    backgroundColor: 'rgb(240, 240, 250)',
    overflow: 'visible',
  },
  event: {
    width: '100%',
    height: 40,
    marginTop: 40,
    marginBottom: 80,
    justifyContent: 'center',
    paddingLeft: 20,
    borderRadius: 10,
    backgroundColor: 'rgb(240, 240, 250)',
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
  },
  container: {
    width: '100%',
    height: 80,
    marginTop: 40,
    justifyContent: 'center',
    paddingLeft: 20,
    borderRadius: 10,
    backgroundColor: 'rgb(240, 240, 250)',
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
  },
  image: {
    width: 40,
    height: 40,
  },
  main: {
    marginTop: 60,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
});
