
const sock = io();




const timestamp = () => {
	let dateObj = new Date();
	let hours = dateObj.getHours();
	let minutes = dateObj.getMinutes();
	if (minutes < 10) {
		minutes = `0${minutes}`
	};

	return `${hours}:${minutes}`;
}



// send chat message to the server
const onChatFormSubmitted = (event) => {
	event.preventDefault();
	const input = document.querySelector('#chat-input');
	const text = input.value;
	input.value = '';
	sock.emit('userMessage', text);
};

// receive message information from the server
sock.on('message', (data) => {
	let user = data.username;
	let message = data.message;
	let room = data.userroom;

	const parent = document.querySelector('#events');

	if (data.username === 'Admin') {
		parent.innerHTML += `
		<tr>
    	<td class="time">${timestamp()}</td>
    	<td><span style="color:#ff5c5c">${user}:</span> ${message}</td>
  	</tr>
 	 `
		parent.scrollTop = parent.scrollHeight;﻿
	} else {
		parent.innerHTML += `
		<tr>
    	<td class="time">${timestamp()}</td>
    	<td><span>${user}:</span> ${message}</td>
  	</tr>
 	 `
 	 parent.scrollTop = parent.scrollHeight;﻿
	};
		
});

sock.on('joinRoom', (data) => {
	let user = data.username;
	let message = data.message;
	let room = data.userroom



})





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
			$('#overlay-name-form').hide();
			$('#chat-input').focus();
			document.getElementById('overlay-name-rules').style.display = 'none';
		} else if (res === false) {
			document.getElementById('overlay-name-rules').style.display = 'block';
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
			$('#overlay-room-form').hide();
			$('#chat-input').focus();
			document.getElementById('overlay-room-rules').style.display = 'none';
		} else if (res === false) {
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
	sock.emit('userMessage', '/roll');
})