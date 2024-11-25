import React, { useRef, useState } from 'react';
import { Button, TextInput, Alert, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, Keyboard, View, Text, StyleSheet, Dimensions, Platform, PanResponder, ScrollView } from 'react-native';
import axios from 'axios';
import ip from './variables'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTaskEvents } from './api';

let setOpenedExternal;

export default function NewEvent({fetchMessage}, actEvent) {

    const xImage = (
    <TouchableOpacity onPress={() => setOpenedExternal(false)}>
        <Image source={require('./../images/close.png')} style={styles.image}/>
    </TouchableOpacity>)
    const [isNewEvent, setNewEvent] = useState(false);
    const [inputText, setInputText] = useState('');
    const [tasks, setTasks] = useState([])

    const getTaskEvents = () => {
        const serverUrl = `http://${ip()}:3000/api/event/tasks`;
        result = []
        axios.get(serverUrl)
          .then(response => {
            if (Array.isArray(response.data)) {
              setTasks(response.data)
            }
          })
          .catch(error => {
            console.log('Błąd połeczenia', error)
          })
        return result
      }

    const taskTitle = (id, plot, done, deadline, id_event) => {
        result = (
        <View style = {styles.title} key = {id}>
            <Text>
                {plot}
            </Text>
        </View>
        )
        return (result)
    }

    setOpenedExternal = setNewEvent;
    if (isNewEvent) {
        {getTaskEvents()}
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.main}>
                <View style = {styles.header}>
                {xImage}
                </View>
                <View style = {styles.center}>
                    <TextInput
                        multiline={true}
                        maxLength={100}
                        style={styles.inputText}
                        placeholder="Wprowadź nazwę wydarzenia"
                        value={inputText}
                        onChangeText={text => setInputText(text)}
                    />
                    <ScrollView contentContainerStyle={styles.scrollViewContent}
                        style={styles.scrollView}>
                        {tasks.map(task => (
                            task.id_event === actEvent ? taskTitle(task.id, task.plot, task.done, task.deadline, task.id_event) : null
                        ))}
                        
                    </ScrollView>
                </View>
                <Button title="Dodaj" onPress={() => {
                    const serverUrl = `http://${ip()}:3000/api/event`; // Twój adres backendu 
                    const data = { id: -1, name: inputText, checked: false }
                    setInputText('')
                    setNewEvent(false)
                    axios.post(serverUrl, data)  // Zmiana na `post` i przekazanie danych
                        .then(response => {
                        fetchMessage()
                        })
                        .catch(error => {
                        console.error('Błąd połączenia z serwerem:', error);
                        });
                }} />
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

export const setNewEvent = () => {
    if (setOpenedExternal) {
        setOpenedExternal(true)
    }
};

const styles = StyleSheet.create({
    scrollView: {
        padding: 0,
        marginHorizontal: 0, // Marginesy wokół ScrollView
        width: '100%',
        height: '50%',
        marginTop: 20,
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
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
    pickerItem: {
            height: 120
        },
      picker: {
        width: 250,
        height: 120,
      },
      selectedValue: {
        marginTop: 20,
        fontSize: 16,
      },
    dates: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },
    time: {
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
    },
    center: {
        height: '60%',
        width: '100%',
        alignItems: 'center'
    },
    image: {
        width: 40,
        height: 40,
    },
    header: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    main : {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgb(240, 240, 250)',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 20,
        paddingTop: 80,
    },
    inputText: {
        marginTop: 40,
        marginBottom: 40,
        fontSize: 20,
        height: 40,
        textAlign: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        width: '90%'
    }
})