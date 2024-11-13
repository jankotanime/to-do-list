import React, { useRef, useState } from 'react';
import { Button, TextInput, Alert, TouchableOpacity, Image, Animated, View, Text, StyleSheet, Dimensions, Platform, PanResponder, ScrollView } from 'react-native';
import axios from 'axios';
import ip from './variables'
import DateTimePicker from '@react-native-community/datetimepicker';

let setOpenedExternal;

export default function NewTask({fetchMessage}) {
    const [isOpened, setOpened] = useState(false);
    const [inputText, setInputText] = useState('');
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date'); // Tryb: 'date' lub 'time'
    const [show, setShow] = useState(false); // Kontrola widoczności pickera

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios'); // Ukrywa picker po wyborze, jeśli to nie iOS
        setDate(currentDate); // Ustawia wybraną datę lub godzinę
    };

    const showMode = (currentMode) => {
        setShow(true); // Pokazuje picker
        setMode(currentMode); // Ustawia tryb ('date' lub 'time')
    };
    setOpenedExternal = setOpened;
    if (isOpened) {
        return (
            <View style={styles.main}>
                <View style = {styles.header}>
                <TouchableOpacity onPress={() => setOpenedExternal(false)}>
                    <Image source={require('./../images/close.png')} style={styles.image}/>
                </TouchableOpacity>
                </View>
                <TextInput
                    multiline={true}
                    maxLength={400}
                    style={styles.inputText}
                    placeholder="Wprowadź treśc zadania"
                    value={inputText}
                    onChangeText={text => setInputText(text)}
                />
                <Button title="Select Date" onPress={() => showMode('date')} />
                <Button title="Select Time" onPress={() => showMode('time')} style={{ marginTop: 10 }} />
                <Text style={{ marginTop: 20 }}>Selected Date: {date.toLocaleDateString()}</Text>
                <Text style={{ marginTop: 10 }}>Selected Time: {date.toLocaleTimeString()}</Text>

                {show && (
                    <DateTimePicker
                    value={date}
                    mode={mode} // Tryb: 'date' lub 'time'
                    is24Hour={true} // Dla 24-godzinnego formatu
                    display="default" // Wygląd pickera
                    onChange={onChange} // Obsługa zmiany
                    />
                )}
            </View>
        );
    }
}

export const setOpened = () => {
    if (setOpenedExternal) {
        setOpenedExternal(true)
    }
};

const styles = StyleSheet.create({
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
        height: 600,
        width: 300,
        backgroundColor: 'rgb(240, 240, 250)',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 20,
    },
    inputText: {
        height: 120,
        justifyContent: 'flex-start',
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        margin: 20,
    }
})