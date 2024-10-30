// backend/server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Endpoint GET na "/api/message"
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the serv' });
});

// Start serwera
app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
});
