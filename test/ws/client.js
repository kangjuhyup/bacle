const { io } = require('socket.io-client');

const socket = io('ws://localhost:4001/chat', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.emit('joinRoom', {
  room: 'abc',
});
