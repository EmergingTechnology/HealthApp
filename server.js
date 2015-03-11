var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mongoose = require('mongoose');
nicknames = [];

server.listen(3000);

//Connecting Mongo DB via Mongoose
mongoose.connect('mongodb://localhost/chat', function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Connected to Database!!')
    };
});

//Ceating Schema where MongoDB will store data in reference to its variable
var chatSchema = mongoose.Schema({

    nick: String,
    msg: String,
    created: {
        type: Date,
        default: Date.now
    }
});

//Creating a model for MongoDB
// name should be in singular as MogoDb would change it to Prurel
var Chat = mongoose.model('Message', chatSchema);


//Directing to difrent URLs
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/patients/views/index.html');
});

app.get('/chat', function(request, response) {
    response.sendFile(__dirname + '/public/patients/views/chat.html');
});

app.use(express.static(__dirname + '/public/patients'));
//app.use('/js', express.static(__dirname + '/scripts/js'));


//Connecting to MongoDB along with its diffrent Functions
io.sockets.on('connection', function(socket) {

    var query = Chat.find({});
    query.sort('-created').limit(10).exec(function(err, docs) {
        if (err) throw err;
        socket.emit('load old msgs', docs);
    });

    //adding new user 
    socket.on('new user', function(data, callback) {
        if (nicknames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            updateNicknames();
        }
    });

    // Showing User name when new user comes in to use server
    function updateNicknames() {
        io.sockets.emit('usernames', nicknames);
    }

    //Sending the data in form of message and saving on server 
    socket.on('send message', function(data) {
        var newMsg = new Chat({
            msg: data,
            nick: socket.nickname
        });
        newMsg.save(function(err) {
            if (err) throw err;
        })
        io.sockets.emit('new message', {
            msg: data,
            nick: socket.nickname
        });
    });

    //if a user goesout of the chat then other users will not see him as he is not currently in application
    socket.on('disconnect', function(data) {
        if (!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNicknames();
    });
});