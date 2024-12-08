import React, { useRef, useState } from 'react';
import { Button, TextInput, Alert, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, Keyboard, View, Text, StyleSheet, Dimensions, Platform, PanResponder, ScrollView, ScrollViewComponent } from 'react-native';
import axios from 'axios';
import ip from './variables'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTaskEvents } from './api';

let setOpenedExternal;
let setNewEventExported;

export default function NewEvent({fetchMessage}) {
    const xImage = (
    <TouchableOpacity onPress={() => {
        setNewTask([])
        setTasks([])
        setOpenedExternal(-1)
        }}>
        <Image source={require('./../images/close.png')} style={styles.image}/>
    </TouchableOpacity>)
    const [isNewEvent, setNewEvent] = useState(-1);
    const [actEvent, setActEvent] = useState(0)
    const [inputText, setInputText] = useState('');
    const [tasks, setTasks] = useState([])
    const [newOpen, setOpened] = useState(false)
    const [newTask, setNewTask] = useState([])
    const [show, setShow] = useState(false);

    const dateChange = (event, selectedDate, id) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        const actTask = tasks.length != 0 ? tasks.map(task => {
            if (task.id === id) {
                return {id: task.id, plot: task.plot, done: task.done, deadline: currentDate, id_event: task.id_event}
            }
            else {
                return task
            }
        }) : null
        setTasks(actTask)
    };

    const dateChangeNewTasks = (event, selectedDate, id) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        const actTask = newTask.length != 0 ? newTask.map(task => {
            if (task.id === id) {
                return {id: task.id, plot: task.plot, deadline: currentDate, id_event: task.id_event}
            }
            else {
                return task
            }
        }) : null
        setNewTask(actTask)
    };
    
    const getTaskEvents = () => {
        const serverUrl = `http://${ip()}:3000/api/event/tasks`;
        const result = []
        axios.get(serverUrl)
          .then(response => {
            if (Array.isArray(response.data)) {
                response.data.map(task => {
                    if (task.id_event === isNewEvent) {
                        result.push(task)
                    }
                })
                setTasks(result)
            }
          })
          .catch(error => {
            console.log('Błąd połeczenia', error)
          })
        return result
      }

    const taskTitle = (id, plot, done, deadline, id_event) => {
        result = (<View style = {styles.title} key = {id}>
            <TextInput
                value={plot}
                style={styles.inputText}
                onChangeText={(text) => {
                    const actTask = tasks.length != 0 ? tasks.map(task => {
                        if (task.id === id) {
                            return {id: id, plot: text, done: done, deadline: deadline, id_event: id_event}
                        }
                        else {
                            return task
                        }
                    }) : null
                    setTasks(actTask)
                }}>
            </TextInput>
            <DateTimePicker
                value={new Date(deadline)}
                mode={'time'}
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => dateChange(event, selectedDate, id)}
            />
        </View>)
        return result
    }

    const newTaskTitle = (id, plot, deadline) => {
        result = (<View style = {styles.title} key = {id}>
            <TextInput
                value={plot}
                style={styles.inputText}
                onChangeText={(text) => {
                    const actNewTask = newTask.length != 0 ? newTask.map(task => {
                        if (task.id === id) {
                            return {id: id, plot: text, deadline: deadline}
                        }
                        else {
                            return task
                        }
                    }) : null
                    setNewTask(actNewTask)
                }}>
            </TextInput>
            <DateTimePicker
                value={new Date(deadline)}
                mode={'time'}
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => dateChangeNewTasks(event, selectedDate, id)}
            />
        </View>)
        return result
    }

    const newTaskLogic = () => {
        x = (<View>
                {newTask.length != 0 ? 
                    newTask.map(task => (
                    newTaskTitle(task.id, task.plot, task.deadline)
                )) : null}
                <TouchableOpacity onPress={() => {
                    const newNewTask = {id: newTask.length, plot: '', deadline: Date.now()}
                    setNewTask([...newTask, newNewTask])
                }}>
                    <View style={styles.title}>
                        <Image source={require('./../images/add.png')} style={styles.image}/>
                    </View>
                </TouchableOpacity>
            </View>)
        return x
    }

    const resultScreen = () => {
        x = (
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
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
                    persistentScrollbar={true}
                    keyboardShouldPersistTaps="handled"
                        style={styles.scrollView}>
                            <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                        <View style= {styles.tasks}>
                        {tasks.length != 0 ? tasks.map(task => (
                            taskTitle(task.id, task.plot, task.done, task.deadline, task.id_event)
                        )) : null}
                    {newTaskLogic()}
                    </View>
                    </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
                <Button title="Dodaj" onPress={() => {
                    const newEvent = (inputText) => {
                        console.log(isNewEvent)
                        const data = { id: isNewEvent, name: inputText }
                        const serverUrl = `http://${ip()}:3000/api/newevent`
                        axios.post(serverUrl, data)
                        .then(response => {
                            fetchMessage()
                        })
                        .catch(error => {
                            console.error('Błąd połączenia z serwerem:', error);
                        });
                    }
                    newEvent(inputText)
                    const serverUrl = `http://${ip()}:3000/api/eventtasks`
                    const data = [tasks, newTask]
                    axios.post(serverUrl, data)
                    .then(response => {
                        fetchMessage()
                    })
                    .catch(error => {
                        console.error('Błąd połączenia z serwerem:', error);
                    });
                    setInputText('')
                    setNewEvent(-1)
                }} />
            </View>
            </TouchableWithoutFeedback>
        );
        return x
    }

    setOpenedExternal = setNewEvent;
    setNewEventExported = setInputText;
    if (isNewEvent !== -1) {
        {tasks.length === 0 ? getTaskEvents(isNewEvent) : null}
        return resultScreen()
    }
}

export const setNewEvent = (event, title) => {
    if (setOpenedExternal) {
        setOpenedExternal(event)
        setNewEventExported(title)
    }
};

const styles = StyleSheet.create({
    scrollViewContent: {
    },
    tasks: {
        height: '100%',
        paddingTop: 10,
        width: '100%',
        backgroundColor: 'rgb(240, 240, 250)',
    },
    addImage: {
        flex: 1
    },
    scrollView: {
        flex: 1,
        padding: 0,
        marginHorizontal: 0, // Marginesy wokół ScrollView
        width: '100%',
        height: '100%',
        marginTop: 20,
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
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
        width: '70%'
    }
})