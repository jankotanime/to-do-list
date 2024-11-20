import React, { useRef, useState } from 'react';
import { Button, TextInput, Alert, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, Keyboard, View, Text, StyleSheet, Dimensions, Platform, PanResponder, ScrollView } from 'react-native';
import axios from 'axios';
import ip from './variables'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

let setOpenedExternal;

export default function NewTask({fetchMessage}) {
    const xImage = (
    <TouchableOpacity onPress={() => setOpenedExternal(false)}>
        <Image source={require('./../images/close.png')} style={styles.image}/>
    </TouchableOpacity>)
    const [isNewTask, setNewTask] = useState(false);
    const [inputText, setInputText] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [repeat, setRepeat] = useState('wr');



    const dateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    setOpenedExternal = setNewTask;
    if (isNewTask) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.main}>
                <View style = {styles.header}>
                {xImage}
                </View>
                <View style = {styles.center}>
                    <TextInput
                        multiline={true}
                        maxLength={400}
                        style={styles.inputText}
                        placeholder="Wprowadź treśc zadania"
                        value={inputText}
                        onChangeText={text => setInputText(text)}
                    />
                    <View style = {styles.dates}>
                        <DateTimePicker
                        value={date}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={dateChange}
                        style={styles.time}
                        />
                        <DateTimePicker
                        style={styles.time}
                        value={date}
                        mode={'time'}
                        is24Hour={true}
                        display="default"
                        onChange={dateChange}
                        />
                    </View>
                    <Picker
                        selectedValue={repeat}
                        onValueChange={(itemValue) => setRepeat(itemValue)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item label="Bez powtarzania" value="wr" />
                        <Picker.Item label="Codziennie" value="day" />
                        <Picker.Item label="Co tydzień" value="week" />
                        <Picker.Item label="Co miesiąc" value="month" />
                        <Picker.Item label="Co rok" value="year" />
                    </Picker>
                </View>
                <Button title="Dodaj" onPress={() => {
                    const serverUrl = `http://${ip()}:3000/api/message`; // Twój adres backendu 
                    const data = { id: -1, plot: inputText, deadline: date, done: false, repeat: repeat }
                    setRepeat('wr')
                    setNewTask(false)
                    setDate(new Date())
                    setInputText('')
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

export const setNewTask = () => {
    if (setOpenedExternal) {
        setOpenedExternal(true)
    }
};

const styles = StyleSheet.create({
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
        height: 120,
        justifyContent: 'flex-start',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        width: '90%'
    }
})