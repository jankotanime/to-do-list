import axios from 'axios';
import ip from './variables'

export function test(id, done, deadline, plot, repeat, fetchMessage) {
    const serverUrl = `http://${ip()}:3000/api/message`; // Twój adres backendu 
          const data = { id: id, plot: plot, deadline: deadline, done: !done, repeat: repeat }
          axios.post(serverUrl, data)  // Zmiana na `post` i przekazanie danych
            .then(response => {
            console.log(Date.now())
            })
            .catch(error => {
              console.error('Błąd połączenia z serwerem:', error);
            });
}

export function checkEventTask(id, done, deadline, plot, id_event, fetchMessage) {
  const serverUrl = `http://${ip()}:3000/api/event/tasks`; // Twój adres backendu 
        const data = { id: id, plot: plot, deadline: deadline, done: !done, id_event: id_event }
        axios.post(serverUrl, data)  // Zmiana na `post` i przekazanie danych
          .then(response => {
          console.log(Date.now())
          })
          .catch(error => {
            console.error('Błąd połączenia z serwerem:', error);
          });
}

export function eventChanger(id, name, checked, fetchMessage) {
  const serverUrl = `http://${ip()}:3000/api/event`; // Twój adres backendu 
        const data = { id: id, name: name, checked: !checked }
        axios.post(serverUrl, data)  // Zmiana na `post` i przekazanie danych
          .then(response => {
          console.log(Date.now())
            fetchMessage()
          })
          .catch(error => {
            console.error('Błąd połączenia z serwerem:', error);
          });
}

export function deleteEvent(id, name, checked, fetchMessage) {
  const serverUrl = `http://${ip()}:3000/api/event/delete`; // Twój adres backendu 
        const data = { id: id, name: name, checked: checked }
        axios.post(serverUrl, data)  // Zmiana na `post` i przekazanie danych
          .then(response => {
            fetchMessage()
          })
          .catch(error => {
            console.error('Błąd połączenia z serwerem:', error);
          });
}

// export function getTaskEvents() {
//   const serverUrl = `http://${ip()}:3000/api/event/tasks`;
//   result = []
//   axios.get(serverUrl)
//     .then(response => {
//       if (Array.isArray(response.data)) {
//         result = response.data
//       }
//     })
//     .catch(error => {
//       console.log('Błąd połeczenia', error)
//     })
//   return result
// }