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


app.use('/', express.static(clientPath));


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
	sock.emit('message', `Welcome, you are (user_${conId})`);
	io.to(users.getUser(sock.id).room).emit('message', `(user_${conId}) has joined the chat.`);
	io.to(users.getUser(sock.id).room).emit('updateuserlist', users.getUserList(users.getUser(sock.id).room))

	io.to(users.getUser(sock.id).room).emit('updateroomname', users.getUser(sock.id).room)


	sock.on('nameChange', (name) => {
		let user = users.getUser(sock.id);
		let userOldRoom = user.room
		let oldName = user.name

		user.name = name;
		io.to(userOldRoom).emit('updateuserlist', users.getUserList(user.room));
		io.to(userOldRoom).emit('message', `${oldName} has changed their name to ${user.name} `);
	});


	sock.on('roomChange', (room) => {
		let user = users.getUser(sock.id);
		let userOldRoom = user.room;
		let oldName = user.name;

		io.to(room).emit('message', `${user.name} has joined the room.`)
		user.room = room;
		sock.emit('updateroomname', room);
		sock.leave(userOldRoom);
		sock.join(room);

		io.to(userOldRoom).emit('message', `${user.name} has left to join the '${user.room}' chat-room.`);

		io.to(user.room).emit('updateuserlist', users.getUserList(user.room));
		io.to(userOldRoom).emit('updateuserlist', users.getUserList(userOldRoom));

		io.emit('updateroomlist', users.getRoomList());
		sock.emit('message', `You are now in the '${user.room}' room.`)
	});










	sock.on('message', (text) => {
		let user = users.getUser(sock.id);
		let userOldRoom = user.room;
		let oldName = user.name

		if (text.slice(0, 6) === '/join ') {
			
			let len = text.length;
			let joinVar = text.slice(6, len);

			user.room = joinVar;
			sock.emit('updateroomname', joinVar);
			sock.leave(userOldRoom);
			sock.join(joinVar);

			io.to(userOldRoom).emit('message', `${user.name} has left to join the '${user.room}' chat-room.`);
			sock.emit('message', `You are now in room '${user.room}'`);
			sock.broadcast.to(user.room).emit('message', `${user.name} has joined the room.`);


			io.to(user.room).emit('updateuserlist', users.getUserList(user.room));
			io.to(userOldRoom).emit('updateuserlist', users.getUserList(userOldRoom));

			io.emit('updateroomlist', users.getRoomList());


		} else if (text.slice(0, 6) === '/name ') {

			let len = text.length;
			let joinVar = text.slice(6, len);

			user.name = joinVar;
			io.to(userOldRoom).emit('message', `${oldName} has changed their name to ${user.name} `);
			io.to(userOldRoom).emit('updateuserlist', users.getUserList(user.room));
			console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${oldName} changed name to ${user.name}`);

		} else if (text.slice(0, 5) === '/roll') {
			let randomNumber = Math.floor(Math.random() * 101)
			io.to(userOldRoom).emit('message', `${user.name} has rolled ${randomNumber}.`);
			console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)}: ${userOldRoom}: ${user.name} rolled ${randomNumber} `);

		} else {


		io.to(user.room).emit('updateroomname', user.room)
		io.to(user.room).emit('message', `${user.name}: ${text}`)


		console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} chat message: ${users.getUser(sock.id).room}: ${users.getUser(sock.id).name}: ${text}`);

		
	}
	// console.log(`room list objects. ${users.getRoomList()} `)



	}); // end on message event



	io.emit('updateroomlist', users.getRoomList())

	sock.on('disconnect', () => {
		io.to(users.getUser(sock.id).room).emit('message', `${users.getUser(sock.id).name} has disconnected.`);
		console.log(`${getTime('fullDate', 2)} ${getTime('timeOfDay', 3)} user disconnected: ${users.getUser(sock.id).name}`);

		let currentroom = users.getUser(sock.id).room
		users.removeUser(sock.id);
		io.to(currentroom).emit('updateuserlist', users.getUserList(currentroom))

		io.emit('updateroomlist', users.getRoomList());

	});






console.log(users.getRoomList())



});



app.get('/', function(req, res) {
	res.render('index');
})




server.on('error', (err) => {
	console.error(`${getTime('timeOfDay', 3)}`, err);
});

server.listen(8080, () => {
	console.log('listening for requests on localhost:8080');
	console.log(`connection started on ${serverLogDate} at ${serverLogTime}`);
});