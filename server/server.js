const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const clientPath = `${__dirname}/../public`;


let getTime = require('./time-styles')
let serverLogTime = getTime('timeOfDay', 3);
let serverLogDate = getTime('fullDate', 2)


const path = require('path');

const Users = require('./users');
const validation = require('./validation');


app.use(express.static(path.join(clientPath)));



const server = http.createServer(app);
const io = socketio(server);


let connectionCount = 0;
let users = new Users()

io.on('connection', (sock) => {

	connectionCount++
	sock.conId = connectionCount;
	let conId = sock.conId;


	users.addUser(sock.id, `(user_${sock.conId})`, 'lobby');
	sock.join('lobby')

	console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} user connected: ${users.getUser(sock.id).name}`);
	sock.emit('message', {message: 'Welcome, you are (user_' + sock.conId + ')', username: 'Admin'});

	io.to(users.getUser(sock.id).room).emit('message', {username: 'Admin', message: `(user_${sock.conId}) has joined.`});
	io.to(users.getUser(sock.id).room).emit('updateuserlist', users.getUserList(users.getUser(sock.id).room));
	io.to(users.getUser(sock.id).room).emit('updateroomname', users.getUser(sock.id).room);







	sock.on('nameChange', (name) => {
		if (validation.identities(name) === false) {
			sock.emit('nameChangeReturn', false);
		} else {
			let user = users.getUser(sock.id);
			let userOldRoom = user.room;
			let oldName = user.name;
			user.name = name;
			io.to(userOldRoom).emit('updateuserlist', users.getUserList(user.room));
			io.to(userOldRoom).emit('message', {message: oldName + ' has changed their name to ' + user.name + '.', username: 'Admin'});
			sock.emit('nameChangeReturn', true);
			console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${oldName} changed name to ${user.name}`);

		};
	});


	sock.on('roomChange', (room) => {
		if (validation.identities(room) === false) {
			sock.emit('roomChangeReturn', false);
		} else {
		let user = users.getUser(sock.id);
		let userOldRoom = user.room;
		let oldName = user.name;

		io.to(room).emit('message', {message: user.name + ' has joined the room.', username: 'Admin'});
		user.room = room;
		sock.emit('updateroomname', room);
		sock.leave(userOldRoom);
		sock.join(room);

		io.to(userOldRoom).emit('message', {username: 'Admin', message: user.name + ' has left the room.'});
		io.to(user.room).emit('updateuserlist', users.getUserList(user.room));
		io.to(userOldRoom).emit('updateuserlist', users.getUserList(userOldRoom));

		io.emit('updateroomlist', users.getRoomList());

		sock.emit('message', {username: 'Admin', message: 'You are now in room ' + user.room + '.'})
		sock.emit('roomChangeReturn', true);
		}

	});

	sock.on('userMessage', (text) => {
		let user = users.getUser(sock.id);
		let userOldRoom = user.room;
		let oldName = user.name
	

		if (validation.messageInput(text) === true) {
				

				if (text.slice(0, 6) === '/join ' || text.slice(0, 6) === '/room ') {
					let len = text.length;
					let joinVar = text.slice(6, len).trim();
					if (validation.identities(joinVar) === true) {
						if (user.room === joinVar) {
							sock.emit('message', {username: 'Admin', message: 'You are already in that room!'});
						} else {
							user.room = joinVar;
							sock.emit('updateroomname', joinVar);
							sock.leave(userOldRoom);
							sock.join(joinVar);
							io.to(userOldRoom).emit('message', {username: 'Admin', message: user.name + ' has left the room.'});
							//sock.emit('message', `You are now in room '${user.room}'`);

							sock.emit('message', {username: user.name, message: 'You are now in room', userroom: user.room})


							sock.broadcast.to(user.room).emit('message', {username: 'Admin', message: user.name + ' has joined the room.'});
							io.to(user.room).emit('updateuserlist', users.getUserList(user.room));
							io.to(userOldRoom).emit('updateuserlist', users.getUserList(userOldRoom));
							io.emit('updateroomlist', users.getRoomList());
						};
						
					} else {
						sock.emit('message', {message: 'Invalid room name', username: 'Admin'});
						return false;
					}
	
				} else if (text.slice(0, 6) === '/name ') {
					let len = text.length;
					let joinVar = text.slice(6, len);
					if (validation.identities(joinVar) === true) {
						user.name = joinVar;
						
					
						io.to(userOldRoom).emit('message', {username: 'Admin', message: oldName + ' has changed their name to ' + user.name + '.'});

						io.to(userOldRoom).emit('updateuserlist', users.getUserList(user.room));
						console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${oldName} changed name to ${user.name}`);
					} else {
						sock.emit('message', {username: 'Admin', message: 'Invalid name'});
						return false;
					};

				} else if (text.slice(0, 5) === '/roll') {
					let randomNumber = Math.floor(Math.random() * 101)
					io.to(userOldRoom).emit('message', {username: 'Admin', message: user.name + ' has rolled ' + randomNumber + '.'});
					console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${userOldRoom}: ${user.name} rolled ${randomNumber} `);
	
			} else {
				let fix1 = text.replace(/</g, "&lt;");
				let fix2 = fix1.replace(/>/g, "&gt;");
				io.to(user.room).emit('updateroomname', user.room)
				io.to(user.room).emit('message', {username: user.name, message: fix2})
				console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} chat message: ${users.getUser(sock.id).room}: ${users.getUser(sock.id).name}: ${text}`);
				};
		// send response returned response from validation module
		} else {																				// validation.messageInput(text)
			sock.emit('message', {username: 'Admin', message: validation.messageInput(text)});
				// for table renovation export key:value pair object.
		};

	});

	io.emit('updateroomlist', users.getRoomList())

	sock.on('disconnect', () => {
		let user = users.getUser(sock.id);
		let userOldRoom = user.room;
		let oldName = user.name
		io.to(user.room).emit('message', {username: 'Admin', message: user.name + ' has disconnected.'});

		console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} user disconnected: ${users.getUser(sock.id).name}`);

		let currentroom = users.getUser(sock.id).room
		users.removeUser(sock.id);
		io.to(currentroom).emit('updateuserlist', users.getUserList(currentroom))

		io.emit('updateroomlist', users.getRoomList());

	});

console.log(users.getRoomList())

});

server.on('error', (err) => {
	console.error(`${getTime('timeOfDay', 3)}`, err);
});

server.listen(8080, () => {
	console.log('listening for requests on localhost:8080');
	console.log(`connection started on ${serverLogDate} at ${serverLogTime}`);
});