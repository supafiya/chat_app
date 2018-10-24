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
let users = new Users();

io.on('connection', (sock) => {

	connectionCount++;
	sock.conId = connectionCount;
	sock.color = '#ccc';

// add user to the socket room, and room in their user class
	function joinRoom(room) {
		sock.join(room);
		user.room.push(room);
	};

// remove user from socket room and remove room from their user class
	function leaveRoom(room) {
		sock.leave(room);
		let index = user.room.indexOf(room);
		if (index > -1) {
			user.room.splice(index, 1);
		};
	};

// this is the only exception to not use the joinRoom function. Room is already defined for user class.
	users.addUser(sock.id, `(user_${sock.conId})`, ['lobby']);
	sock.join('lobby');

// lets us reference the user in their class
	let user = users.getUser(sock.id);

// reference for the user's IP address
	let address = sock.request.connection.remoteAddress;

//cross reference sockID into users to get their data.
	let printUsers = io.sockets.adapter.rooms['lobby'].sockets;
	let printUsers2 =  io.sockets.adapter.rooms['lobby'];

// new user messages
	function welcomeMessage() {
		sock.emit('message', {userroom: 'lobby', message: 'Welcome, you are (user_' + sock.conId + ')', username: 'Admin'});
		io.to('lobby').emit('message', {userroom: 'lobby' ,username: 'Admin', message: `(user_${sock.conId}) has joined.`});
		io.to('lobby').emit('updateuserlist', users.getUserList('lobby'));
		io.to('lobby').emit('updateroomname', users.getUser(sock.id).room);
		console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} ip: ${address} user connected: ${users.getUser(sock.id).name}`);
	}
		welcomeMessage();

	console.log(users.getUserList('lobby'))









	sock.on('nameChange', (data) => {
		let user = users.getUser(sock.id);
		let userOldRoom = data.currentRoom;
		let oldName = user.name;
		let name = data.newName;

		if (validation.identities(name) === false) {
			sock.emit('nameChangeReturn', false);

		} else if (name === oldName) {
			sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: 'Your name is already ' + user.name + '!'})
			sock.emit('nameChangeReturn', false);

		} else {
			nameLC = name.trim();
			reLCName = nameLC.toLowerCase();
			reLCNameArray = users.getUserList(userOldRoom);


			for(let i = 0, length1 = reLCNameArray.length; i < length1; i++){
				reLCNameArray[i] = reLCNameArray[i].toLowerCase();
			};

			if (reLCNameArray.includes(reLCName)) {	/*

				function addName(newName, names){

fix name duplicate support!

    			let re = new RegExp(`^${newName}(_\\d+)?$`)
    			let matches = names.reduce((count, name) => name.match(re) ? count+1 : count, 0)
    			let NName2 = (matches ? nameLC+'_'+matches : newName);
    			//names.push(NName2);
    			//let addedName = names.slice(-1)[0]

    			if (NName2 === user.name) {
    				sock.emit('message', {username: 'Admin', message: 'Your name is already ' + user.name + '!'});
    				sock.emit('nameChangeReturn', false);

    			} else if (names.includes(NName2)) {
    				console.log('name duplicated')

    			} else {

						user.name = NName2;
						io.to(userOldRoom).emit('updateuserlist', users.getUserList(user.room));
						io.to(userOldRoom).emit('message', {message: oldName + ' has changed their name to ' + user.name + '.', username: 'Admin'});
						sock.emit('nameChangeReturn', true);
						console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${oldName} changed name to ${user.name}`);
    			}

				}

				addName(reLCName, reLCNameArray);
				*/
				console.log('name in use')

			} else {
				user.name = nameLC;
				io.to(userOldRoom).emit('updateuserlist', users.getUserList(userOldRoom));
				io.to(userOldRoom).emit('message', {userroom: userOldRoom, message: oldName + ' has changed their name to ' + user.name + '.', username: 'Admin'});
				sock.emit('nameChangeReturn', true);
				console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${oldName} changed name to ${user.name}`);



			}




		};
	});


	sock.on('roomChange', (data) => {
		let room = data.newRoom;
		let userOldRoom = data.currentRoom;
		if (validation.identities(room) === false) {
			sock.emit('roomChangeReturn', false);
		} else {
			let user = users.getUser(sock.id);
			let oldName = user.name;

			if (userOldRoom === room) {
				sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: ' You are already in that room!'});
				sock.emit('roomChangeReturn', 'alreadyInRoom');
			} else {
					sock.emit('joinRoom', {userroom: room})
					io.to(room).emit('message', {userroom: room, message: user.name + ' has joined the room.', username: 'Admin'});
					user.room.push(room)
					sock.emit('updateroomname', room);
					sock.join(room);
					sock.emit('updateuserlist', users.getUserList(room))

					io.to(userOldRoom).emit('message', {userroom: userOldRoom, username: 'Admin', message: user.name + ' has left the room.'});

					io.emit('updateroomlist', users.getRoomOccupantNumber());

					sock.emit('message', {userroom: room, username: 'Admin', message: 'You are now in room ' + room + '.'})
					sock.emit('roomChangeReturn', true, room);

			}
		}
	});

	sock.on('userMessage', (data) => {
		let user = users.getUser(sock.id);
		let userOldRoom = data.userroom
		let oldName = user.name
		let text = data.message

		if (validation.messageInput(text) === true) {


				if (text.slice(0, 6) === '/join ' || text.slice(0, 6) === '/room ') {
					let len = text.length;
					let joinVar = text.slice(6, len).trim();
					if (validation.identities(joinVar) === true) {
						if (userOldRoom === joinVar) {
							sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: 'You are already in that room!'});
						} else {
							user.room += joinVar;
							sock.emit('updateroomname', joinVar);
							sock.leave(userOldRoom);
							sock.join(joinVar);
							io.to(userOldRoom).emit('message', {userroom: userOldRoom, username: 'Admin', message: user.name + ' has left the room.'});

							sock.emit('message', {username: 'Admin', message: 'You are now in room ', userroom: joinVar})

							sock.broadcast.to(user.room).emit('message', {userroom: joinVar, username: 'Admin', message: user.name + ' has joined the room.'});


							io.emit('updateroomlist', users.getRoomOccupantNumber());
						};

					} else {
						sock.emit('message', {userroom: userOldRoom, message: 'Invalid room name', username: 'Admin'});
						return false;
					}

				} else if (text.slice(0, 6) === '/name ') {
					let len = text.length;
					let joinVar = text.slice(6, len);
					if (validation.identities(joinVar) === true) {
						user.name = joinVar;


						io.to(userOldRoom).emit('message', {userroom: userOldRoom, username: 'Admin', message: oldName + ' has changed their name to ' + user.name + '.'});

						console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${oldName} changed name to ${user.name}`);
					} else {
						sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: 'Invalid name'});
						return false;
					};



				} else if (text.slice(0, 5) === '/roll') {
					let randomNumber = Math.floor(Math.random() * 101)
					io.to(userOldRoom).emit('message', {userroom: userOldRoom, username: 'Admin', message: user.name + ' has rolled ' + randomNumber + '.'});
					console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${userOldRoom}: ${user.name} rolled ${randomNumber} `);

				} else if (text.slice(0, 6) === '/color') {
					let len = text.length;
					let newColor = text.slice(6, len);
					sock.color = newColor;


				}	else {
					let fix1 = text.replace(/</g, "&lt;");
					let fix2 = fix1.replace(/>/g, "&gt;");
					io.to(userOldRoom).emit('message', {userroom: userOldRoom, username: user.name, message: fix2, userColor: sock.color})
					console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} chat message: ${userOldRoom}: ${users.getUser(sock.id).name}: ${text}`);
				};
			// send response returned response from validation module
			} else {
				sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: validation.messageInput(text)});
			};


	});

	io.emit('updateroomlist', users.getRoomOccupantNumber())

	sock.on('disconnect', () => {
		let user = users.getUser(sock.id);
		let userOldRoom = user.room;
		let oldName = user.name
		io.to(user.room).emit('message', {userroom: userOldRoom, username: 'Admin', message: user.name + ' has disconnected.'});

		console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} user disconnected: ${users.getUser(sock.id).name}`);

		let currentroom = users.getUser(sock.id).room
		users.removeUser(sock.id);

		io.emit('updateroomlist', users.getRoomOccupantNumber());

	});


});

server.on('error', (err) => {
	console.error(`${getTime('timeOfDay', 3)}`, err);
});

server.listen(8080, () => {
	console.log('listening for requests on localhost:8080');
	console.log(`connection started on ${serverLogDate} at ${serverLogTime}`);
});