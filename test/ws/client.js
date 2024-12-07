const { io } = require('socket.io-client');

const socket = io('ws://localhost:4001/chat', {
  transports: ['websocket'],
  extraHeaders: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImNYdm8rMThLc1FkOXJ4NDgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FqaWFjcmJxd3JocXhnc3VpeW12LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzMGM3YjZhNC1lZDhlLTQ4OGItYWQzNi02ZjEzOWNiZWI0NWEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMzNzE0MjA3LCJpYXQiOjE3MzMxMDk0MDcsImVtYWlsIjoic3ByaW5nZGF5OTNAbmF2ZXIuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJkaXNjb3JkIiwicHJvdmlkZXJzIjpbImRpc2NvcmQiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vY2RuLmRpc2NvcmRhcHAuY29tL2VtYmVkL2F2YXRhcnMvMC5wbmciLCJjdXN0b21fY2xhaW1zIjp7Imdsb2JhbF9uYW1lIjoiU3ByaW5nZGF5In0sImVtYWlsIjoic3ByaW5nZGF5OTNAbmF2ZXIuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmdWxsX25hbWUiOiJzcHJpbmdkYXk5MyIsImlzcyI6Imh0dHBzOi8vZGlzY29yZC5jb20vYXBpIiwibmFtZSI6InNwcmluZ2RheTkzIzAiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2Nkbi5kaXNjb3JkYXBwLmNvbS9lbWJlZC9hdmF0YXJzLzAucG5nIiwicHJvdmlkZXJfaWQiOiIxMjcyMzk4NzIzNDM1MjA0NjgxIiwic3ViIjoiMTI3MjM5ODcyMzQzNTIwNDY4MSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzMzMTA5NDA3fV0sInNlc3Npb25faWQiOiIwZGFhMTVjZi1jODZlLTQ3NDMtYjM5My1lZWEyZDkzYjg2MTciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.41YbATB90wEWkjv-sNL0EdzYZcAkH7IwgvEbO2Uy1zU`,
  },
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
  room: 0,
});
