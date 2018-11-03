
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
	let room = document.querySelector('#room-name').innerHTML;
	let roomfix = room.replace(/ /gi, "_SPACE_");
	let aur = $('.active-user-room')[0].classList;
	let pmRoomNum;

	if (aur[1]) {
		for(let i = 0, length1 = aur.length; i < length1; i++){
			if (aur[i].slice(0, 6) === 'roomID') {
				pmRoomNum = aur[i].replace(/roomID_/gi, "pm-")
			}
		}
		sock.emit('userMessage', {message: text, userroom: pmRoomNum});
	} else {
		sock.emit('userMessage', {message: text, userroom: roomfix});
	}
};

// receive message information from the server
sock.on('message', (data) => {
	let user = data.username;
	let message = data.message;
	let room = data.userroom;
	let userColor = data.userColor;
	let userbgColor = data.userColorBG;

	const parent = document.querySelector(`.events-table-${room}`);

	if (data.username === 'Admin') {
		parent.innerHTML += `
		<tr>
    	<td class="time">${timestamp()}</td>
    	<td style="font-style:italic;"><span style="color:#ff5c5c; font-weight:bold; font-style:italic;">${user}:</span> ${message}</td>
  	</tr>
 	 `
		parent.scrollTop = parent.scrollHeight;﻿
	} else {	//  style="color:${userColor}; background-color:#ff5c5c; font-weight:bold;" add background color option
		parent.innerHTML += `
		<tr>
    	<td class="time">${timestamp()}</td>
    	<td><span style="color:${userColor}; background-color:${userbgColor};">${user}:</span> ${message}</td>
  	</tr>
 	 `
 	 parent.scrollTop = parent.scrollHeight;﻿
	};

});


sock.on('joinRoom', (data) => {
	let user = data.username;
	let message = data.message;
	let room = data.userroom;
	let userColor = data.userColor;
	$('.user-room-list').children().removeClass('active-user-room')
	let parent = document.querySelector('.events-tables');

	for (let i = 0; i < parent.children.length; i++) {
		parent.children[i].style.display = 'none';
	}

	parent.innerHTML +=`
	<table id="events" class="events-table-${room}">
	</table>`;

	const parentLi = document.querySelector('.user-room-list');
	room = room.replace(/_SPACE_/gi, " ");

	parentLi.innerHTML +=`
	<li class="active-user-room">${room}<a href="javascript:void(0)" id="user-room-list-close-btn">&times;</a></li>`

});


sock.on('privateMessage', (data) => {
	let user = data.username;
	let userid = data.userid;
	let roomid = data.roomid
	let roomName = data.userroom;
	let parent = document.querySelector('.events-tables');
	$('.user-room-list').children().removeClass('active-user-room')

	for (let i = 0; i < parent.children.length; i++) {
		parent.children[i].style.display = 'none';
	}

	parent.innerHTML +=`
	<table id="events" class="events-table-${roomName} ${roomid}">
	</table>`;


	// THIS selects the actual rooms ID, use this to update jquery client file for events related to changing room views
	//let tester = $('.' + roomid)[0].classList[1];
	//console.log('roomid class: ' + tester)
	const parentLi = document.querySelector('.user-room-list');
	parentLi.innerHTML +=`
	<li class="active-user-room ${roomid}">${user}<a href="javascript:void(0)" id="user-room-list-close-btn">&times;</a></li>`

});




sock.on('requestPrivate', (data) => {
	let room = data.userroom;
	sock.emit('requestPrivateResponse', {userroom: room})
})






// new name submission
	// send name information
	const onNameFormSubmitted = (event) => {
		event.preventDefault();
		const input = document.querySelector('#name-input');
		const text = input.value;
		input.value = '';
		const roomName = document.querySelector('#room-name').innerHTML;
		sock.emit('nameChange', {newName: text, currentRoom: roomName, origin: 'overlay'});
	};
	// receive the information from the server
	sock.on('nameChangeReturn', (res) => {
		let invNameAnim = document.getElementById('overlay-name-rules-invalid')
		function invalidNameFunc() {
			invNameAnim.classList.remove('invalidNameAnim')
			void invNameAnim.offsetWidth;
			invNameAnim.classList.add('invalidNameAnim');
			console.log('name invalid')
		}

		if (res === true) {
			$('#overlay-name-form').hide();
			$('#chat-input').focus();
			document.getElementById('overlay-name-rules').style.display = 'none';

		}	else if (res === false) {
			document.getElementById('overlay-name-rules').style.display = 'block';
			invalidNameFunc();
		}

	});

// room change/create submission
	// send the room information
	const onRoomFormSubmitted = (event) => {
		event.preventDefault();
		const input = document.querySelector('#room-input');
		const roomName = document.querySelector('#room-name').innerHTML;
		const text = input.value;
		input.value = '';
		sock.emit('roomChange', {newRoom: text, currentRoom: roomName, origin: 'overlay'});
	};
	// receive the information from the server
	sock.on('roomChangeReturn', (res, room) => {
		let invalidRoomName = document.getElementById('overlay-room-invalid')

		if (res === true) {
			$('#overlay-room-form').hide();
			$('#chat-input').focus();
			document.getElementById('overlay-room-rules').style.display = 'none';





		} else if (res === 'alreadyInRoom'){
				invalidRoomName.classList.remove('invalidNameAnim');
				void invalidRoomName.offsetWidth;
				invalidRoomName.classList.add('invalidNameAnim')

		} else if (res === false) {
			document.getElementById('overlay-room-rules').style.display = 'block';
		};
	});

sock.on('needsUsersList', () => {
	const roomName = document.querySelector('#room-name');
	let userOldRoom = roomName.innerHTML;

	sock.emit('updateuserslist', {userroom: userOldRoom})
})

sock.on('updateuserlist', function (data) {
	const parent = document.querySelector('#userlist');
	const roomName = document.querySelector('#room-name');
	let userOldRoom = roomName.innerHTML;
	let users = data.userlist;
	let userroom = data.userroom;

	if (userOldRoom.replace(/ /g, '_SPACE_') === userroom) {
		parent.innerHTML = '';
		users.forEach(function (user) {
			parent.innerHTML += `<li>${user}</li>`
		});

	};

});


sock.on('updateroomname', function (room) {
	const roomName = document.querySelector('#room-name');
	let roomfix = room;
	if(roomfix.length > 1) {
		let fixroomname = roomfix.replace(/_SPACE_/gi, " ");
		roomName.innerHTML = fixroomname;
	} else {
		roomName.innerHTML = roomfix;
	}

});



sock.on('updateroomlist', function (data) {
	const parent = document.querySelector('#roomlist');
	parent.innerHTML = '';
	let roomList = data;
	for(let i = 0, length1 = roomList.length; i < length1; i++){
		let currentObj = roomList[i]
		let listName = currentObj.i_room.replace(/_SPACE_/gi, " ");
		let listNum = currentObj.i_num;
		parent.innerHTML += `<li>${listName} - [<span style="color:#ffa8a8">${listNum}</span>]</li>`;
	}
});





document.querySelector('#chat-form').addEventListener('submit', onChatFormSubmitted);

document.querySelector('#name-form').addEventListener('submit', onNameFormSubmitted);

document.querySelector('#room-form').addEventListener('submit', onRoomFormSubmitted);

document.querySelector('#roll-dice-btn').addEventListener('click', () => {
	const roomName = document.querySelector('#room-name');
	sock.emit('userRoll', {userroom: roomName.innerHTML});
})