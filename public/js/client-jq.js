
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



$('#roomlist').on('click', (event) => {
	let val = $(event.target).text();
	sock.emit('roomChange', val);
})





}); // end ready function
