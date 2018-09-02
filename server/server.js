const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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

    socket.on('createMessage', message => {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });
});
io.on('disconnect', socket => {
    console.log('User was disconnected');
});
