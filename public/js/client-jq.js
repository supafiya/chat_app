
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


var str = "lobby - [2]";
str = str.slice(-3, -2);
console.log(str)



$('#roomlist').on('click', (event) => {

// could be improved with regExp

	let val = $(event.target).text();
	let ele = $('#room-name')
	let text = ele.text();
	let join = val.slice(0, -6);

	if (val.slice(-3, -2) !== '[') {
		join = val.slice(0, -7);
	};

	if (join === text) {
		const parent = document.querySelector('#events');
		parent.innerHTML += `
		<tr>
    	<td class="time">${timestamp()}</td>
    	<td style="font-style:italic;"><span style="color:#ff5c5c; font-weight:bold; font-style:italic;">Admin:</span> You are already in that room!</td>
  	</tr>
		`
		parent.scrollTop = parent.scrollHeight;﻿
	} else {
		sock.emit('roomChange', join);
	}
});

$('#name-color-button').on('click', (event) => {
	$('.name-color-picker').css({'position': 'absolute', 'top': event.pageY, 'left': event.pageX});
	$('.name-color-picker').show();
	console.log('color button clicked.')

});


// colors:
	$('#ncp1').on('click', () => {
		sock.emit('userMessage', `/color #FE2712`)
	})

	$('#ncp2').on('click', () => {
		sock.emit('userMessage', `/color #FC600A`)
	})

	$('#ncp3').on('click', () => {
		sock.emit('userMessage', `/color #FB9902`)
	})

	$('#ncp4').on('click', () => {
		sock.emit('userMessage', `/color #FCCC1A`)
	})

	$('#ncp5').on('click', () => {
		sock.emit('userMessage', `/color #FEFE33`)
	})

	$('#ncp6').on('click', () => {
		sock.emit('userMessage', `/color #B2D732`)
	})

	$('#ncp7').on('click', () => {
		sock.emit('userMessage', `/color #66B032`)
	})

	$('#ncp8').on('click', () => {
		sock.emit('userMessage', `/color #347C98`)
	})

  $('#ncp9').on('click', () => {
		sock.emit('userMessage', `/color #0247FE`)
	})

  $('#ncp10').on('click', () => {
		sock.emit('userMessage', `/color #4424D6`)
	})

  $('#ncp11').on('click', () => {
		sock.emit('userMessage', `/color #8601AF`)

	})

  $('#ncp12').on('click', () => {
		sock.emit('userMessage', `/color #C21460`)
	})



$("body > *").not("body > button").click(function(event) {
  if(event.target.id=='name-color-button' || event.target.id=='name-color-picker' || event.target.id=='ncpcolor'){
    return false;
  }
  $('.name-color-picker').hide();
});


$('#controls-menu').on('click', () => {
	$('.controls').show();
	console.log('menu button clicked')
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
