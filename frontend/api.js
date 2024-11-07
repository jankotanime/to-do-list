import axios from 'axios';
const start = Date.now();


export default function test(id, done, deadline, plot, fetchMessage) {
    const serverUrl = `http://192.168.0.13:3000/api/message`; // Twój adres backendu 
          const data = { id: id, plot: plot, start, done: !done }
          axios.post(serverUrl, data)  // Zmiana na `post` i przekazanie danych
            .then(response => {
              fetchMessage()
            })
            .catch(error => {
              console.error('Błąd połączenia z serwerem:', error);
            });
}