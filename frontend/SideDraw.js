import React, { useRef, useState } from 'react';
import { Button, TextInput, Alert, TouchableOpacity, Image, Animated, View, Text, StyleSheet, Dimensions, PanResponder, ScrollView } from 'react-native';
import { setNewTask } from './NewTask';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SideDrawer({fetchMessage}) {
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current; // Start panelu poza ekranem
  const [isSettings, setSettings] = useState(false);
  const [addTask, setTask] = useState(false);

  // PanResponder do obsługi gestów przesuwania
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 0;
      },
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dx > 0) {
          Animated.timing(translateX, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx < 0) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH * 0.75,
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

  const task = () => {
    Alert.alert('zadanie');
  }

  isSettings ? settings() : undefined
  addTask ? task() : undefined

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
        <TouchableOpacity>
        <View style={styles.container}>
            <Text style={styles.text}>Add new event</Text>
        </View>
        </TouchableOpacity>
        <View style={styles.events}>
          <TouchableOpacity>
          <View style={styles.event}>
              <Text style={styles.text}>Event1</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity>
          <View style={styles.event}>
              <Text style={styles.text}>Event2</Text>
          </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    width: SCREEN_WIDTH * 0.75, // Panel zajmuje 75% szerokości ekranu
    backgroundColor: 'rgb(240, 240, 250)',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 10,
    elevation: 10,
  },
  events: {
    marginTop: 50,
    height: 200,
    width: '100%',
    borderTopColor: 'gray',
    borderTopWidth: 1,
    backgroundColor: 'rgb(240, 240, 250)',
  },
  event: {
    width: '100%',
    height: 40,
    marginTop: 20,
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
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
