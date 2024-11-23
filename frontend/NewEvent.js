import React, { useRef, useState } from 'react';
import { Button, TextInput, Alert, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, Keyboard, View, Text, StyleSheet, Dimensions, Platform, PanResponder, ScrollView } from 'react-native';
import axios from 'axios';
import ip from './variables'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

let setOpenedExternal;

export default function NewEvent({fetchMessage}) {
    const xImage = (
    <TouchableOpacity onPress={() => setOpenedExternal(false)}>
        <Image source={require('./../images/close.png')} style={styles.image}/>
    </TouchableOpacity>)
    const [isNewEvent, setNewEvent] = useState(false);
    const [inputText, setInputText] = useState('');

    setOpenedExternal = setNewEvent;
    if (isNewEvent) {
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