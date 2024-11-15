import axios from 'axios';
import ip from './variables'

export default function test(id, done, deadline, plot, fetchMessage) {
    const serverUrl = `http://${ip()}:3000/api/message`; // Twój adres backendu 
          const data = { id: id, plot: plot, deadline: deadline, done: !done }
          axios.post(serverUrl, data)  // Zmiana na `post` i przekazanie danych
            .then(response => {
            console.log(Date.now())
              fetchMessage()
            })
            .catch(error => {
              console.error('Błąd połączenia z serwerem:', error);
            });
}