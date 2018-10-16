
$(document).ready(function() {


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



sock.on('message', () => {
	let el = $("#events tr")
	let len = el.length;
	if (len >= 150) {
		$("#events tr").first().remove();
	}
})



}); // end ready function
