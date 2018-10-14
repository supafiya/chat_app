
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
	var sheet = document.styleSheets[0];
	var rules = sheet.cssRules || sheet.rules;
	if (onOff % 2 === 0) {
		rules[15].style.width = '2.5em';
		rules[15].style.opacity = '1';
		rules[15].style.right = "0px"
	} else {
		rules[15].style.width = "0em";
		rules[15].style.opacity = "0";
		rules[15].style.right = "40px"
	};
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
	let el = $("#events li")
	let len = el.length;
	if (len > 400) {
		$(".chat-time-stamp").first().remove();
		$("#events li").first().remove();
	}
})



}); // end ready function

/*
$(this).find('span:first');

$(this).find(':first-child');

$(this).find('span').eq(0);

while (el.length >= 20) {
		console.log(el.find('#events:first-child').remove())
	}





*/