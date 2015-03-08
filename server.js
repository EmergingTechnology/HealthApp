var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/patients/views/index.html');
});

app.use(express.static(__dirname + '/public/patients'));
//app.use('/js', express.static(__dirname + '/scripts/js'));

server.listen(3000, function() {
    console.log('Server is Running at http://localhost:3000/');
});
