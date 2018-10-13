
const sock = io();




// send chat message to the server
const onChatFormSubmitted = (event) => {
	event.preventDefault();
	const input = document.querySelector('#chat-input');
	const text = input.value;
	input.value = '';
	sock.emit('userMessage', text);
};

// receive message information from the server
sock.on('message', (text) => {
	const parent = document.querySelector('#events');
	const el = document.createElement('li');
	el.innerHTML = text;
	parent.appendChild(el);
	parent.scrollTop = parent.scrollHeight;﻿
	
});



// new name submission
	// send name information
	const onNameFormSubmitted = (event) => {
		event.preventDefault();
		const input = document.querySelector('#name-input');
		const text = input.value;
		input.value = '';
		sock.emit('nameChange', text);
	};
	// receive the information from the server
	sock.on('nameChangeReturn', (res) => {
		if (res === true) {
			console.log('NAME CHANGE FUNCTION RETURNED TRUE');
			$('#overlay-name-form').hide();
			$('#chat-input').focus();
			document.getElementById('overlay-name-rules').style.display = 'none';
		} else if (res === false) {
			document.getElementById('overlay-name-rules').style.display = 'block';
			console.log('NAME CHANGE FUNCTION RETURNED FALSE');
		};
	});

// room change/create submission
	// send the room information
	const onRoomFormSubmitted = (event) => {
		event.preventDefault();
		const input = document.querySelector('#room-input');
		const text = input.value;
		input.value = '';
		sock.emit('roomChange', text);
	};
	// receive the information from the server
	sock.on('roomChangeReturn', (res) => {
		if (res === true) {
			console.log('ROOM CHANGE FUNCTION RETURNED TRUE')
			$('#overlay-room-form').hide();
			$('#chat-input').focus();
			document.getElementById('overlay-room-rules').style.display = 'none';
		} else if (res === false) {
			console.log('ROOM CHANGE FUNCTION RETURNED FALSE')
			document.getElementById('overlay-room-rules').style.display = 'block';
		};
	});




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
});

sock.on('updateroomlist', function (rooms) {
	const parent = document.querySelector('#roomlist');
	parent.innerHTML = '';

	rooms.forEach(function (room) {
		parent.innerHTML += `<li>${room}</li>`
	});
});


document.querySelector('#chat-form').addEventListener('submit', onChatFormSubmitted);

document.querySelector('#name-form').addEventListener('submit', onNameFormSubmitted);

document.querySelector('#room-form').addEventListener('submit', onRoomFormSubmitted);

document.querySelector('#roll-dice-btn').addEventListener('click', () => {
	sock.emit('message', '/roll');
})