const socket = io();
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
socket.on('newMessage', message => {
    console.log('New message', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});
socket.on('newLocationMessage', function(message) {
    console.log('location', message);
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location </a>');
    li.text(`${message.from}`);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});
socket.emit(
    'createMessage',
    {
        from: 'Frank',
        text: 'Hi'
    },
    message => console.log('got it', { message })
);

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit(
        'createMessage',
        {
            from: 'User',
            text: jQuery('[name=message]').val()
        },
        function() {}
    );
});
var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported  by your browser');
    } else {
        navigator.geolocation.getCurrentPosition(
            position => {
                socket.emit('createLocationMessage', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            () => {
                alert('Unable to fetch location.');
            }
        );
    }
});
