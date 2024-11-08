import axios from 'axios';
const start = Date.now();


export default function test(id, done, deadline, plot, fetchMessage) {
    const serverUrl = `http://10.10.4.144:3000/api/message`; // Twój adres backendu 
          const data = { id: id, plot: plot, start, done: !done }
          axios.post(serverUrl, data)  // Zmiana na `post` i przekazanie danych
            .then(response => {
            console.log(Date.now())
              fetchMessage()
            })
            .catch(error => {
              console.error('Błąd połączenia z serwerem:', error);
            });
}