$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('.nav-button').on('click', handleNavBarClick);
    $('.nav-button').on('click', handleNavBarClick)
    $('.logo_text').on('click', handleNavBarClick)
    $('.logo_gift').on('click', handleNavBarClick)
});

function handleNavBarClick(event) {
    var url = "/" + event.target.id;
    $('#main-container').load(url, function() {
        bindEventHandlers(event)
    });
}

function bindEventHandlers(event) {
    // TODO: Bind the proper event handlers based on which "module" is activated, based on the event or something
    bindUserClick();
}

