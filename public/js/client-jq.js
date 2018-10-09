
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



});

/*

$(document).on('click', function(event) {
  if (!$(event.target).closest('.db_search_bar').length) {
  	searchBarClicked = 0;
    $searchBarDiv.fadeTo(fadespeed, 0.5);
    $searchBarDiv.animate({
    	'width': '200px'

  	}, 250);
  }
});

$searchBarDiv.on('click', () => {
  	searchBarClicked = 1;
  	$searchBarDiv.fadeTo(fadespeed, 1);
  	$searchBarDiv.animate({
    	'width': '800px'

  	}, 250);
  });

  */