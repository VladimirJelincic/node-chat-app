const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(publicPath));
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});

const io = socketIO(server);
io.on('connection', socket => {
    console.log('New user connected!');
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    socket.on('createMessage', message => {
        console.log('createMessage', message);
    });
});
io.on('disconnect', socket => {
    console.log('User was disconnected');
});
