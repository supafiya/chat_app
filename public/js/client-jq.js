
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


$('.name-color-picker').hide();

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


$('ul.user-room-list').on('click', (event) => {
	let val = $(event.target).text().slice(0, -1)
	let tar = $(event.target).parent();
	let tartext = tar.text().slice(0, -1)
	const roomName = document.querySelector('#room-name');

	if (event.target.tagName === 'LI') {
		$('.events-tables').children().hide();
		$('.events-table-' + val).show();
		$('.user-room-list').children().removeClass('active-user-room')
		$(event.target).addClass('active-user-room');
		sock.emit('getRoomsUsers', {userroom: val})
		roomName.innerHTML = val;

	} else if (event.target.tagName === 'A') {
		sock.emit('leaveRoom', {userroom: tartext});
		sock.emit('getRoomList');
		tar.remove();
		$('.events-table-' + tartext).remove();

		if (tar.hasClass('active-user-room') === true) {
			let roomListFirst = $('.user-room-list li').first();
			let roomFirst = roomListFirst.text().slice(0, -1);
			$('.events-tables').children().hide();
			$('.events-table-' + roomFirst).show();
			roomListFirst.addClass('active-user-room');
			roomName.innerHTML = roomFirst;
		}
	}
});




$('#roomlist').on('click', (event) => {

// could be improved with regExp
	const roomNameTitle = document.querySelector('#room-name');
	let roomName = roomNameTitle.innerHTML;

	let val = $(event.target).text();
	let ele = $('#room-name')
	let text = ele.text();
	let join = val.slice(0, -6);

	if (val.slice(-3, -2) !== '[') {
		join = val.slice(0, -7);
	};

	if (join === text) {
		const parent = document.querySelector('#events');
		sock.emit('AlreadyInRoom', {userroom: roomName});
		parent.scrollTop = parent.scrollHeight;﻿

	} else {
			sock.emit('getSoftRoomList', join, function(req, res) {
				if (res === true) {
					sock.emit('AlreadyInRoom', {userroom: roomName});
				} else if (res === false) {
						sock.emit('roomChange', {newRoom: join, currentRoom: roomName});
					}
			});
	};
});



$('#name-color-button').on('click', (event) => {
	$('.name-color-picker').css({'position': 'absolute', 'top': event.pageY, 'left': event.pageX});
	$('.name-color-picker').show();
});


// colors:
	$('#ncp1').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#FE2712'})
	})

	$('#ncp2').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#FC600A'})
	})

	$('#ncp3').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#FB9902'})
	})

	$('#ncp4').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#FCCC1A'})
	})

	$('#ncp5').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#FEFE33'})
	})

	$('#ncp6').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#B2D732'})
	})

	$('#ncp7').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#66B032'})
	})

	$('#ncp8').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#347C98'})
	})

  $('#ncp9').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#0247FE'})
	})

  $('#ncp10').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#4424D6'})
	})

  $('#ncp11').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#8601AF'})
	})

  $('#ncp12').on('click', () => {
		sock.emit('changeUserColor', {colorCode: '#C21460'})
	})



$("body > *").not("body > button").click(function(event) {
  if(event.target.id=='name-color-button' || event.target.id=='name-color-picker' || event.target.id=='ncpcolor'){
    return false;
  }
  $('.name-color-picker').hide();
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
}, 1000);

sock.on('message', () => {
	unreadMessages();
	let el = $("#events tr")
	let len = el.length;
	if (len >= 100) {
		$("#events tr").first().remove();
	}
})



}); // end ready function
