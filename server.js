const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
});

// Serve static files
app.use(express.static('public'));

// In-memory logs store { room: [ { user, text, timestamp } ] }
const logs = [];

// Socket handlers
io.on('connection', socket => {
  console.log('User connected');

  socket.emit('chat history', logs);

  socket.on('chat message', msg => {
    logs.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('add log', entry => {
    io.emit('new log', entry);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
