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
const chatcmd = require('./chatcommands');


app.use(express.static(path.join(clientPath)));



const server = http.createServer(app);
const io = socketio(server);


let connectionCount = 0;
let users = new Users();

io.on('connection', (sock) => {

	connectionCount++;
	sock.conId = connectionCount;
	sock.color = '#ccc';


// this is the only exception to not use the joinRoom function. Room is already defined for user class.
	users.addUser(sock.id, `(user_${sock.conId})`, ['lobby']);
	sock.join('lobby');

// lets us reference the user in their class
	let user = users.getUser(sock.id);

// reference for the user's IP address
	let address = sock.request.connection.remoteAddress;

// new user messages
	function welcomeMessage() {
		sock.emit('message', {userroom: 'lobby', message: 'Welcome, you are (user_' + sock.conId + ')', username: 'Admin'});
		io.to('lobby').emit('message', {userroom: 'lobby' ,username: 'Admin', message: `(user_${sock.conId}) has joined.`});
		sock.emit('updateroomname', users.getUser(sock.id).room);
		io.to('lobby').emit('needsUsersList');
		console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} ip: ${address} user connected: ${users.getUser(sock.id).name}`);
	}
		welcomeMessage();

// emit message to user if they try to join a room they're already in.
	sock.on('AlreadyInRoom', (data) => {
		room = data.userroom
		sock.emit('message', {userroom: room, message: 'You are already in that room!', username: 'Admin'});
	});

	sock.on('userRoll', (data) => {
		rollDice(data);
	});

	function rollDice(data) {
		let userOldRoom = data.userroom.replace(/ /gi, "_SPACE_");
		let randomNumber = Math.floor(Math.random() * 101);
		io.to(userOldRoom).emit('message', {userroom: userOldRoom, username: 'Admin', message: user.name + ' has rolled ' + randomNumber + '.'});
		console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${userOldRoom}: ${user.name} rolled ${randomNumber} `);
	};

// changes a users name color.
	sock.on('changeUserColor', (data) => {
		color = data.colorCode
		sock.color = color
	})

// emits a list of users in a certain room to the user that requested it.
	sock.on('getRoomsUsers', (data) => {
		let room = data.userroom;
		sock.emit('updateuserlist', {userlist: users.getUserList(room), userroom: room});
	})

// emits an object with room list information to all users to update their list (ie: someone disconnects or joins, update their list).
	sock.on('getRoomList', () => {
		io.emit('updateroomlist', users.getRoomOccupantNumber());
	});

// client sends a function to the server looking for the userlist of a certain room, then the callback sends the information back.
	sock.on('getSoftRoomList', function(data, callback) {
		let room = data;
		let userName = user.name
		let userList = users.getUserList(room);

		if (userList.includes(userName)) {
			callback('callback true', true);
		} else {
			callback('callback false', false);
		}
	});


// what to do when a client leaves a room.
	sock.on('leaveRoom', (data) => {
		let room = data.userroom;
		let index = user.room.indexOf(room);
		sock.leave(room);

		if (index > -1) {
			user.room.splice(index, 1);
		};
		io.to(room).emit('updateuserlist', {userlist: users.getUserList(room), userroom: room});
		io.to(room).emit('message', {userroom: room, message: user.name + ' has left the room.', username: 'Admin'});
		console.log(user.name + ' left room: ' + room )
	});

// client name change functionality. ##### regExp needs to be utilized #####
	sock.on('nameChange', (data) => {
		changeName(data);
	});

	function changeName(data) {
		let user = users.getUser(sock.id);
		let userOldRoom = data.currentRoom;
		let oldName = user.name;
		let name = data.newName;
		let origin = data.origin;


		if (validation.identities(name) === false && origin === 'overlay') {
			sock.emit('nameChangeReturn', false);

		} else if (validation.identities(name) === false && origin === 'chatcmd') {
			sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: 'Invalid name.'});

		} else if (name === oldName && origin === 'overlay') {
			sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: 'Your name is already ' + user.name + '!'});
			sock.emit('nameChangeReturn', false);

		} else if (name === oldName && origin === 'chatcmd') {
			sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: 'Your name is already ' + user.name + '!'});

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
				io.to(userOldRoom).emit('updateuserlist', {userlist: users.getUserList(userOldRoom), userroom: userOldRoom});
				io.to(userOldRoom).emit('message', {userroom: userOldRoom, message: oldName + ' has changed their name to ' + user.name + '.', username: 'Admin'});
				sock.emit('nameChangeReturn', true);
				console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${oldName} changed name to ${user.name}`);
			}
		};
	};

// room enter functionality. this isn't them leaving one room an joining another, this is the client simply joining another room in addition to their current rooms.
	sock.on('roomChange', (data) => {
		joinRoom(data);
	});

	function joinRoom(data) {
		let room = data.newRoom.trim().replace(/ /g, '_SPACE_');
		let userOldRoom = data.currentRoom;
		let userRooms = user.room;
		let origin = data.origin;

		function checkRooms() {
			for(let i = 0, length1 = userRooms.length; i < length1; i++){
				if(userRooms[i].toLowerCase() === room.toLowerCase()) {
					return false;
				}
			};
		};

		if (checkRooms() === false) {
			sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: ' You are already in that room!'});
		} else {

			if (validation.identities(room) === false && origin === 'overlay') {
				sock.emit('roomChangeReturn', false);

			} else if (validation.identities(room) === false && origin === chatcmd) {
				sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: ' Invalid room name.'});

			} else {
				let user = users.getUser(sock.id);
				let oldName = user.name;

				if (user.room.includes(room)) {
					sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: ' You are already in that room!'});
					sock.emit('roomChangeReturn', 'alreadyInRoom');

				} else {
					sock.emit('joinRoom', {userroom: room});
					io.to(room).emit('message', {userroom: room, message: user.name + ' has joined the room.', username: 'Admin'});
					user.room.push(room);
					sock.emit('updateroomname', room);
					sock.join(room);
					io.emit('updateroomlist', users.getRoomOccupantNumber());
					sock.emit('message', {userroom: room, username: 'Admin', message: 'You are now in room ' + room.replace(/_SPACE_/gi, " ") + '.'})
					sock.emit('roomChangeReturn', true, room);
					console.log(user.name + ' has entered room: ' + room);
					io.to(room).emit('updateuserlist', {userlist: users.getUserList(room), userroom: room});
				};
			};
		};
	};

// message functionality.
	sock.on('userMessage', (data) => {
		let user = users.getUser(sock.id);
		let userOldRoom = data.userroom;
		let oldName = user.name;
		let text = data.message;

		if (validation.messageInput(text) === true) {

			// change sock.on to functions and the sock.on sends data to function

				if (text.slice(0, 6) === '/join ' || text.slice(0, 6) === '/room ') {
					let len = text.length;
					let newRoom = text.slice(6, len);
					joinRoom({newRoom: newRoom, currentRoom: userOldRoom, origin: 'chatcmd'});

				} else if (text.slice(0, 6) === '/name ') {
					let len = text.length;
					let newName = text.slice(6, len);
					changeName({newName: newName, currentRoom: userOldRoom, origin: 'chatcmd'});

				} else if (text.slice(0, 5) === '/roll') {
					console.log(text.length)
					// if length = 5, send rollDice(data), if longer check for number use roll number for high end roll variable
					rollDice(data)

				} else if (text.slice(0, 6) === '/color') {
					let len = text.length;
					let newColor = text.slice(6, len);
					sock.color = newColor;

				}	else {

		// this is where the message is sent back to the clients in the room it originated from.
					let fix1 = text.replace(/</g, "&lt;");
					let fix2 = fix1.replace(/>/g, "&gt;");
					io.to(userOldRoom).emit('message', {userroom: userOldRoom, username: user.name, message: fix2, userColor: sock.color})
					console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} chat message: ${userOldRoom}: ${users.getUser(sock.id).name}: ${text}`);
				};

		// sends response returned response from validation module if it failed.
			} else {
				sock.emit('message', {userroom: userOldRoom, username: 'Admin', message: validation.messageInput(text)});
			};


	});

// updates the clients room list when a user connects.
	io.emit('updateroomlist', users.getRoomOccupantNumber())

// emit user list for which room the user is in.
	sock.on('updateuserslist', (data) => {
		room = data.userroom.replace(/ /gi, "_SPACE_");
		sock.emit('updateuserlist', {userlist: users.getUserList(room), userroom: room})
	});

// what to do when a client disconnects.
	sock.on('disconnect', () => {
		let user = users.getUser(sock.id);
		let userOldRoom = user.room;
		let oldName = user.name;
		let userRooms = user.room;
		console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} user disconnected: ${users.getUser(sock.id).name}`);
		users.removeUser(sock.id);
		userRooms.forEach(function (i) {
			io.to(i).emit('needsUsersList').emit('message', {userroom: i, username: 'Admin', message: user.name + ' has disconnected.'});
		});
		io.emit('updateroomlist', users.getRoomOccupantNumber());

	});
}); // end of the socket function

server.on('error', (err) => {
	console.error(`${getTime('timeOfDay', 3)}`, err);
});

server.listen(8080, () => {
	console.log('listening for requests on localhost:8080');
	console.log(`connection started on ${serverLogDate} at ${serverLogTime}`);
});