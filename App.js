import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, Alert, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const task = (done, deadline, plot) => {
  const full_task = (<View style={styles.title}>
  <Text style={styles.deadline}>{deadline}</Text>
  <Text style={styles.text_main}>{plot}</Text>
  </View>)
  return full_task
}

export default function App() {
  const [message, setMessage] = useState('');
  const [x, setX] = useState(3);
  const settingsButton = () => {
    Alert.alert('ustawienia');
  }
  useEffect(() => {
    const fetchMessage = () => {
      // Twój lokalny adres IP oraz port backendu
      const serverUrl = `http://192.168.1.117:3000/api/message?x=${x}`; // Wstaw swój adres IP
      // Wykonanie zapytania GET
      axios.get(serverUrl)
        .then(response => {
          setMessage(response.data.message);
        })
        .catch(error => {
          console.error('Błąd połączenia z serwerem:', error);
          setMessage('Błąd połączenia z serwerem');
        });
    };

    fetchMessage();
  }, [x]);

  return (
    <View style={styles.screen}>
      <View style={styles.mask}>
        <TouchableOpacity style={styles.button} onPress={settingsButton}>
          <Image
            source={require('./images/test.jpg')}
            style={styles.image}
          />
        </TouchableOpacity>
        <View style={styles.main_container}>
          {task("false", "20:00", "Sigma")}
          <View style={styles.title}>
            <Text style={styles.text_main}>AAAAA</Text>
          </View>
          <View style={styles.title}>
            <Text style={styles.text_main}>AAAAA</Text>
          </View>
          <View style={styles.title}>
            <Text style={styles.text_main}>AAAAA</Text>
          </View>
          <Text style={styles.text_main}>{message ? message : 'Ładowanie...'}</Text>
          <Button title="button" onPress={() => {setX(x + 1);}} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    backgroundColor: 'rgb(250, 230, 210)',
    width: '100%',
    height: 80,
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
  deadline: {
    flex: 1,
    height: '100%',
    width: 40,
  },
  screen: {
    backgroundColor: 'rgb(250, 230, 210)',
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  mask: {
    justifyContent: 'space-between',
    height: '90%',
    width: '95%',
    alignItems: 'center',
  },
  button: {
    height: 40,
    width: '100%',
  },
  image: {
    height: 40,
    width: 40,
    alignSelf: 'flex-end'
  },
  main_container: {
    backgroundColor: 'rgb(250, 230, 210)',
    width: '100%',
    height: '92.5%',
  },
  main: {  
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  text_main: {
    flex: 1,
    height: '100%',
    color: 'rgb(30, 30, 30)',
    fontSize: '25%',
  }
});
