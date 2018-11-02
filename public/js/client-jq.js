
$(document).ready(function() {

const timestamp = () => {
	let dateObj = new Date();
	let hours = dateObj.getHours();
	let minutes = dateObj.getMinutes();
	if (minutes < 10) {
		minutes = `0${minutes}`
	};

	return `${hours}:${minutes}`;
}


$('.controls').hide();


$('#overlay-name-form-closebtn').on('click', () => {
	$('#overlay-name-form').hide();
	$('#chat-input').focus();
});

$('#openNameChangeOverlay').on('click', () => {
	$('#overlay-name-form').show();
	$('#overlay-name-rules-invalid').removeClass('invalidNameAnim');
	$('#name-input').focus();
});


$('#overlay-room-form-closebtn').on('click', () => {
	$('#overlay-room-form').hide();
	$('#chat-input').focus();
});

$('#openRoomChangeOverlay').on('click', () => {
	$('#overlay-room-form').show();
	$('#overlay-room-invalid').removeClass('invalidNameAnim');
	$('#room-input').focus();
});

let onOff = 0;
$('#timestamp-button').on('click', () => {
	onOff++
	let sheet = document.styleSheets[0];
	let rules = sheet.cssRules || sheet.rules;

	if (onOff % 2 === 0) {
		$('.time').attr('style', 'user-select: auto; left: 0px;');
		rules[1].style.opacity = '1';
		rules[1].style.color = '#ffa8a8';
		rules[1].style.width = '50px';
	} else {
		$('.time').attr('style', 'user-select: none; left: 50px;');
		rules[1].style.opacity = '0';
		rules[1].style.color = 'red';
		rules[1].style.width = '0px';
	}

});

$('#userlist').on('click', (event) => {
	let val = $(event.target).text();
	//const valPersist = val;
	sock.emit('sendPrivateMessage', {username: val, roomname: val})

})




$('ul.user-room-list').on('click', (event) => {
	let val = $(event.target).text().slice(0, -1)
	const valPersist = val;
	let tar = $(event.target).parent();
	let tartext = tar.text().slice(0, -1)
	const roomName = document.querySelector('#room-name');
	let ulClassLi = event.target.classList;
	console.log(ulClassLi)
	let classFix;

	for(let i = 0, length1 = ulClassLi.length; i < length1; i++){
		console.log(': class loop: ' + ulClassLi[i])
		if (ulClassLi[i].slice(0, 6) === 'roomID') {
			classFix = ulClassLi[i]
		}
	}



	if (classFix && event.target.tagName === 'LI') {
		$('.events-tables').children().hide();
		$('.' + classFix).show();
		$('.user-room-list').children().removeClass('active-user-room')
		$(event.target).addClass('active-user-room');
		//sock.emit('getRoomsUsers', {userroom: classFix}) NEEDS ACTUAL ROOM NAME
		roomName.innerHTML = val;




	} else {

		if (event.target.tagName === 'LI') {
			$('.events-tables').children().hide();
			$('.events-table-' + val.replace(/ /gi, "_SPACE_")).show();
			$('.user-room-list').children().removeClass('active-user-room')
			$(event.target).addClass('active-user-room');
			sock.emit('getRoomsUsers', {userroom: val.replace(/ /gi, "_SPACE_")})
			roomName.innerHTML = val;

		} else if (event.target.tagName === 'A') {
				let roomListFirst = $('.user-room-list li').first();
				let roomFirst = roomListFirst.text().slice(0, -1).replace(/ /gi, "_SPACE_");
				let roomListLast = $('.user-room-list li').last();
				let roomLast = roomListLast.text().slice(0, -1).replace(/ /gi, "_SPACE_");
				let parentRoom = tar.text().slice(0, -1).replace(/ /gi, "_SPACE_");

				if (roomFirst != roomLast) {
					sock.emit('leaveRoom', {userroom: tartext.replace(/ /gi, "_SPACE_")});
					sock.emit('getRoomList');
					tar.remove();
					$('.events-table-' + tartext.replace(/ /gi, "_SPACE_")).remove();

					if (tar.hasClass('active-user-room') === true) {
						$('.events-tables').children().hide();

						if (parentRoom === roomFirst) {
							$('.events-table-' + roomLast).show();
							roomListLast.addClass('active-user-room');
							roomName.innerHTML = roomLast.replace(/_SPACE_/gi, " ");
							sock.emit('updateuserslist', {userroom: roomLast});
						} else {
							$('.events-table-' + roomFirst).show();
							roomListFirst.addClass('active-user-room');
							roomName.innerHTML = roomFirst.replace(/_SPACE_/gi, " ");
							sock.emit('updateuserslist', {userroom: roomFirst});
						}
					}
				} else {
					console.log('Cannot leave only open room.') // this prevents from closing a room if only one is open.
				}
		}
	}
});




$('#roomlist').on('click', (event) => {


	const roomNameTitle = document.querySelector('#room-name');
	let roomName = roomNameTitle.innerHTML

	let val = $(event.target).text();
	let ele = $('#room-name')
	let text = ele.text();
	let join = val.slice(0, -6);

	if (val.slice(-3, -2) !== '[') {
		join = val.slice(0, -7);
	};

	if (join === text) {
		const parent = document.querySelector('#events');
		sock.emit('AlreadyInRoom', {userroom: roomName.replace(/ /gi, "_SPACE_")});
		parent.scrollTop = parent.scrollHeight;﻿

	} else {
			sock.emit('getSoftRoomList', join.replace(/ /gi, "_SPACE_"), function(req, res) {
				if (res === true) {
					sock.emit('AlreadyInRoom', {userroom: roomName.replace(/ /gi, "_SPACE_")});
				} else if (res === false) {
						sock.emit('roomChange', {newRoom: join.replace(/ /gi, "_SPACE_"), currentRoom: roomName.replace(/ /gi, "_SPACE_")});
					}
			});
	};
});



$('#name-color-button').on('click', (event) => {
	$('#overlay-name-color').show();
	$('.controls').hide();
});




	$('#overlay-color-form-accept').on('click', () => {
		$('#overlay-name-color').hide();
	});

	$('#overlay-color-form-close').on('click', () => {
		$('#overlay-name-color').hide();
		sock.emit('changeUserColor', {colorCodeBG: '#ff00', colorCode: '#cccccc'});
	});


// background colors
	$('#cpno').on('click', () => {
		$('#name-color-preview').css({'background-color': 'black'});
		sock.emit('changeUserColor', {colorCodeBG: 'black'});
	});

	$('#cpno1').on('click', () => {
		$('#name-color-preview').css({'background-color': '#112135'});
		sock.emit('changeUserColor', {colorCodeBG: '#112135'});
	});

	$('#cpno2').on('click', () => {
		$('#name-color-preview').css({'background-color': '#152b49'});
		sock.emit('changeUserColor', {colorCodeBG: '#152b49'});
	});

	$('#cpno3').on('click', () => {
		$('#name-color-preview').css({'background-color': '#1c1b39'});
		sock.emit('changeUserColor', {colorCodeBG: '#1c1b39'});
	});

	$('#cpno4').on('click', () => {
		$('#name-color-preview').css({'background-color': '#222248'});
		sock.emit('changeUserColor', {colorCodeBG: '#222248'});
	});

	$('#cpno5').on('click', () => {
		$('#name-color-preview').css({'background-color': '#231931'});
		sock.emit('changeUserColor', {colorCodeBG: '#231931'});
	});

	$('#cpno6').on('click', () => {
		$('#name-color-preview').css({'background-color': '#2c213d'});
		sock.emit('changeUserColor', {colorCodeBG: '#2c213d'});
	});

	$('#cpno7').on('click', () => {
		$('#name-color-preview').css({'background-color': '#2f1630'});
		sock.emit('changeUserColor', {colorCodeBG: '#2f1630'});
	});

	$('#cpno8').on('click', () => {
		$('#name-color-preview').css({'background-color': '#431d41'});
		sock.emit('changeUserColor', {colorCodeBG: '#431d41'});
	});

	$('#cpno9').on('click', () => {
		$('#name-color-preview').css({'background-color': '#551b29'});
		sock.emit('changeUserColor', {colorCodeBG: '#551b29'});
	});

	$('#cpno10').on('click', () => {
		$('#name-color-preview').css({'background-color': '#651f2c'});
		sock.emit('changeUserColor', {colorCodeBG: '#651f2c'});
	});

	$('#cpno11').on('click', () => {
		$('#name-color-preview').css({'background-color': '#572b23'});
		sock.emit('changeUserColor', {colorCodeBG: '#572b23'});
	});

	$('#cpno12').on('click', () => {
		$('#name-color-preview').css({'background-color': '#6d392b'});
		sock.emit('changeUserColor', {colorCodeBG: '#6d392b'});
	});

	$('#cpno13').on('click', () => {
		$('#name-color-preview').css({'background-color': '#593925'});
		sock.emit('changeUserColor', {colorCodeBG: '#593925'});
	});

	$('#cpno14').on('click', () => {
		$('#name-color-preview').css({'background-color': '#6c462a'});
		sock.emit('changeUserColor', {colorCodeBG: '#6c462a'});
	});

	$('#cpno15').on('click', () => {
		$('#name-color-preview').css({'background-color': '#5d4625'});
		sock.emit('changeUserColor', {colorCodeBG: '#5d4625'});
	});

	$('#cpno16').on('click', () => {
		$('#name-color-preview').css({'background-color': '#73582d'});
		sock.emit('changeUserColor', {colorCodeBG: '#73582d'});
	});

	$('#cpno17').on('click', () => {
		$('#name-color-preview').css({'background-color': '#5d5527'});
		sock.emit('changeUserColor', {colorCodeBG: '#5d5527'});
	});

	$('#cpno18').on('click', () => {
		$('#name-color-preview').css({'background-color': '#72692e'});
		sock.emit('changeUserColor', {colorCodeBG: '#72692e'});
	});

	$('#cpno19').on('click', () => {
		$('#name-color-preview').css({'background-color': '#3a3c18'});
		sock.emit('changeUserColor', {colorCodeBG: '#3a3c18'});
	});

	$('#cpno20').on('click', () => {
		$('#name-color-preview').css({'background-color': '#4c5420'});
		sock.emit('changeUserColor', {colorCodeBG: '#4c5420'});
	});

	$('#cpno21').on('click', () => {
		$('#name-color-preview').css({'background-color': '#123414'});
		sock.emit('changeUserColor', {colorCodeBG: '#123414'});
	});

	$('#cpno22').on('click', () => {
		$('#name-color-preview').css({'background-color': '#16481d'});
		sock.emit('changeUserColor', {colorCodeBG: '#16481d'});
	});

	$('#cpno23').on('click', () => {
		$('#name-color-preview').css({'background-color': '#0c2220'});
		sock.emit('changeUserColor', {colorCodeBG: '#0c2220'});
	});

	$('#cpno24').on('click', () => {
		$('#name-color-preview').css({'background-color': '#123431'});
		sock.emit('changeUserColor', {colorCodeBG: '#123431'});
	});


// font colors
	$('#cpni').on('click', () => {
		$('#name-color-preview').css({'color': 'white'});
		sock.emit('changeUserColor', {colorCode: 'white'});
	});

	$('#cpni1').on('click', () => {
		$('#name-color-preview').css({'color': '#5e90b6'});
		sock.emit('changeUserColor', {colorCode: '#5e90b6'});
	});

	$('#cpni2').on('click', () => {
		$('#name-color-preview').css({'color': '#83a1c7'});
		sock.emit('changeUserColor', {colorCode: '#83a1c7'});
	});

	$('#cpni3').on('click', () => {
		$('#name-color-preview').css({'color': '#6c7fae'});
		sock.emit('changeUserColor', {colorCode: '#6c7fae'});
	});

	$('#cpni4').on('click', () => {
		$('#name-color-preview').css({'color': '#8896ba'});
		sock.emit('changeUserColor', {colorCode: '#8896ba'});
	});

	$('#cpni5').on('click', () => {
		$('#name-color-preview').css({'color': '#8c76aa'});
		sock.emit('changeUserColor', {colorCode: '#8c76aa'});
	});

	$('#cpni6').on('click', () => {
		$('#name-color-preview').css({'color': '#9a8bb9'});
		sock.emit('changeUserColor', {colorCode: '#9a8bb9'});
	});

	$('#cpni7').on('click', () => {
		$('#name-color-preview').css({'color': '#ac74a9'});
		sock.emit('changeUserColor', {colorCode: '#ac74a9'});
	});

	$('#cpni8').on('click', () => {
		$('#name-color-preview').css({'color': '#b991b5'});
		sock.emit('changeUserColor', {colorCode: '#b991b5'});
	});

	$('#cpni9').on('click', () => {
		$('#name-color-preview').css({'color': '#d26262'});
		sock.emit('changeUserColor', {colorCode: '#d26262'});
	});

	$('#cpni10').on('click', () => {
		$('#name-color-preview').css({'color': '#e18a73'});
		sock.emit('changeUserColor', {colorCode: '#e18a73'});
	});

	$('#cpni11').on('click', () => {
		$('#name-color-preview').css({'color': '#d58b59'});
		sock.emit('changeUserColor', {colorCode: '#d58b59'});
	});

	$('#cpni12').on('click', () => {
		$('#name-color-preview').css({'color': '#e4a770'});
		sock.emit('changeUserColor', {colorCode: '#e4a770'});
	});

	$('#cpni13').on('click', () => {
		$('#name-color-preview').css({'color': '#df9a57'});
		sock.emit('changeUserColor', {colorCode: '#df9a57'});
	});

	$('#cpni14').on('click', () => {
		$('#name-color-preview').css({'color': '#e3b771'});
		sock.emit('changeUserColor', {colorCode: '#e3b771'});
	});

	$('#cpni15').on('click', () => {
		$('#name-color-preview').css({'color': '#e5af59'});
		sock.emit('changeUserColor', {colorCode: '#e5af59'});
	});

	$('#cpni16').on('click', () => {
		$('#name-color-preview').css({'color': '#e6c774'});
		sock.emit('changeUserColor', {colorCode: '#e6c774'});
	});

	$('#cpni17').on('click', () => {
		$('#name-color-preview').css({'color': '#e7cb5b'});
		sock.emit('changeUserColor', {colorCode: '#e7cb5b'});
	});

	$('#cpni18').on('click', () => {
		$('#name-color-preview').css({'color': '#e4d376'});
		sock.emit('changeUserColor', {colorCode: '#e4d376'});
	});

	$('#cpni19').on('click', () => {
		$('#name-color-preview').css({'color': '#a4b571'});
		sock.emit('changeUserColor', {colorCode: '#a4b571'});
	});

	$('#cpni20').on('click', () => {
		$('#name-color-preview').css({'color': '#c0d088'});
		sock.emit('changeUserColor', {colorCode: '#c0d088'});
	});

	$('#cpni21').on('click', () => {
		$('#name-color-preview').css({'color': '#6eb16d'});
		sock.emit('changeUserColor', {colorCode: '#6eb16d'});
	});

	$('#cpni22').on('click', () => {
		$('#name-color-preview').css({'color': '#95c090'});
		sock.emit('changeUserColor', {colorCode: '#95c090'});
	});

	$('#cpni23').on('click', () => {
		$('#name-color-preview').css({'color': '#64aeae'});
		sock.emit('changeUserColor', {colorCode: '#64aeae'});
	});

	$('#cpni24').on('click', () => {
		$('#name-color-preview').css({'color': '#8ab4b6'});
		sock.emit('changeUserColor', {colorCode: '#8ab4b6'});
	});




$('#controls-menu').on('click', () => {
	$('.controls').show();
});


$("body > *").not("body > a" || "body > button").click(function(event) {
  if(event.target.id=='name-color-button' || event.target.id=='controls-menu' || event.target.id=='name-color-picker' || event.target.id=='ncpcolor'){
    return false;
  }
  $('.controls').hide();
});


const oldTitle = document.title;
let newMessages = 1;

function unreadMessages() {
	let newTitle = `(${newMessages}) ${oldTitle}`;

	if (document.hasFocus()) {
		newMessages = 1;
		document.title = oldTitle;
	} else {
		newMessages++
		document.title = newTitle;
	};
};

setInterval(function () {
		if (document.hasFocus()) {
			unreadMessages();
		}
}, 500);

sock.on('message', () => {
	unreadMessages();
	let el = $("#events tr")
	let len = el.length;
	if (len >= 100) {
		$("#events tr").first().remove();
	}
})



}); // end ready function
