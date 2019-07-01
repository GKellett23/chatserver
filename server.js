var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 4000);
console.log('Server is running');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client.html');
});

// User connects to the server
io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Online: %s connected', connections.length);

	// User disconnects from server
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Offline: %s connected', connections.length);
	});
	
	// Users' sent messages and username
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	// Recieves new user data
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});
	// Function to update user names
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});