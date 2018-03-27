$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('.nav-button').on('click', handleNavBarClick);
    $('.nav-button').on('click', handleNavBarClick)
	$('.logo-text').on('click', handleNavBarClick)

});

function handleNavBarClick(event) {
    var url = "/" + event.target.id;
	if(url != "/logout") {
    	$('#main-container').load(url, function() {
        	bindEventHandlers(event)
    	});
	 } else {
	 	$.get("/api/v1/logout", function() {
			window.location = "/index";
		});
	 }
}

function bindEventHandlers(event) {
    // TODO: Bind the proper event handlers based on which "module" is activated, based on the event or something
    bindUserClick();
}

$(function() {
  $(".clickable").click(function() {
  	$(".clickable").removeClass("active");
    $(this).addClass("active");      //add the class to the clicked element
  });
});