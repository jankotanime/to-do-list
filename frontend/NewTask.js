import React, { useRef, useState } from 'react';
import { Button, TextInput, Alert, TouchableOpacity, Image, Animated, View, Text, StyleSheet, Dimensions, PanResponder, ScrollView } from 'react-native';
import axios from 'axios';
import ip from './variables'

let setOpenedExternal;

export default function NewTask({fetchMessage}) {
    const [isOpened, setOpened] = useState(false);
    const [inputText, setInputText] = useState('');
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
            </View>
        );
    } else {
        return (
            <View style={styles.main}>
                <Text>aaaa</Text>
            </View>
        )
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
    },
    main : {
        position: 'absolute',
        height: 600,
        width: 300,
        backgroundColor: 'rgb(240, 240, 250)',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 40,
    },
    inputText: {
        height: 120,
        justifyContent: 'flex-start',
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        marginBottom: 20,
    }
})