
const sock = io();

sock.on('message', (text) => {
	writeEvent(text);
});


const writeEvent = (text) => {
	const parent = document.querySelector('#events');
	const el = document.createElement('li');
	el.innerHTML = text;
	parent.appendChild(el);
	parent.scrollTop = parent.scrollHeight;﻿
};

const onChatFormSubmitted = (event) => {
	event.preventDefault();
	const input = document.querySelector('#chat-input');
	const text = input.value;
	input.value = '';
	sock.emit('message', text);
};

const onNameFormSubmitted = (event) => {
	event.preventDefault();
	const input = document.querySelector('#name-input');
	const text = input.value;
	input.value = '';
	sock.emit('nameChange', text)
	$('#overlay-name-form').hide();
	$('#chat-input').focus();
};


const onRoomFormSubmitted = (event) => {
	event.preventDefault();
	const input = document.querySelector('#room-input');
	const text = input.value;
	input.value = '';
	sock.emit('roomChange', text)
	$('#overlay-room-form').hide();
	$('#chat-input').focus();
};


sock.on('updateuserlist', function (users) {
	const parent = document.querySelector('#userlist')
	parent.innerHTML = '';

	users.forEach(function (user) {
		parent.innerHTML += `<li>${user}</li>`

	});
});

sock.on('updateroomname', function (room) {
	const roomName = document.querySelector('#room-name');
	roomName.innerHTML = room;

	
})

sock.on('updateroomlist', function (rooms) {
	const parent = document.querySelector('#roomlist');
	parent.innerHTML = '';

	rooms.forEach(function (room) {
		parent.innerHTML += `<li>${room}</li>`
	})
})



document.querySelector('#chat-form').addEventListener('submit', onChatFormSubmitted);

document.querySelector('#name-form').addEventListener('submit', onNameFormSubmitted);

document.querySelector('#room-form').addEventListener('submit', onRoomFormSubmitted);

document.querySelector('#roll-dice-btn').addEventListener('click', () => {
	sock.emit('message', '/roll');
})