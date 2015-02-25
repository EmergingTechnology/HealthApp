var express = require('express');
var app = express();

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/patients/views/index.html');
});

app.use(express.static(__dirname + '/public/patients'));
//app.use('/js', express.static(__dirname + '/scripts/js'));

app.listen(3000, function(){
  console.log('Server is Running at http://localhost:3000/');
});
