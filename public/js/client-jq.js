
$(document).ready(function() {

$('.name-color-picker').hide();

$('#overlay-name-form-closebtn').on('click', () => {
	$('#overlay-name-form').hide();
	$('#chat-input').focus();
});

$('#openNameChangeOverlay').on('click', () => {
	$('#overlay-name-form').show();
	$('#name-input').focus();
});


$('#overlay-room-form-closebtn').on('click', () => {
	$('#overlay-room-form').hide();
	$('#chat-input').focus();
});

$('#openRoomChangeOverlay').on('click', () => {
	$('#overlay-room-form').show();
	$('#room-input').focus();
});

let onOff = 0;
$('#timestamp-button').on('click', () => {
	onOff++
	let sheet = document.styleSheets[0];
	let rules = sheet.cssRules || sheet.rules;

	if (onOff % 2 === 0) {
		$('.time').attr('style', 'user-select: auto;');
		rules[1].style.opacity = '1';
		rules[1].style.color = '#ffa8a8';
		rules[1].style.width = '50px';

	} else {
		$('.time').attr('style', 'user-select: none;');
		rules[1].style.opacity = '0';
		rules[1].style.color = 'red';
		rules[1].style.width = '0px';
	}

});



$('#roomlist').on('click', (event) => {
	let val = $(event.target).text();
	let ele = $('#room-name');
	let text = ele.text();
	if (val === text) {
		const parent = document.querySelector('#events');
		const el = document.createElement('li');
		el.innerHTML = 'You are already in that room!';
		parent.appendChild(el);
		parent.scrollTop = parent.scrollHeight;﻿
	} else {
		sock.emit('roomChange', val);
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


sock.on('message', () => {
	let el = $("#events tr")
	let len = el.length;
	if (len >= 150) {
		$("#events tr").first().remove();
	}
})





}); // end ready function
