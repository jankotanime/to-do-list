import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import axios from 'axios';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Twój lokalny adres IP oraz port backendu
    const serverUrl = 'http://192.168.0.13:3000/api/message'; // Wstaw swój adres IP

    // Wykonanie zapytania GET
    axios.get(serverUrl)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Błąd połączenia z serwerem:', error);
        setMessage('Błąd połączenia z serwerem');
      });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{message ? message : 'Ładowanie...'}</Text>
    </View>
  );
}
