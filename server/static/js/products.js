$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('#card1').on('click', handleColClick)
});

function handleColClick(event) {

    var url = "/" + "card";
    $('#list-container').load(url, function() {
        bindEventHandlers(event)
    });
}

function bindEventHandlers(event) {
    // TODO: Bind the proper event handlers based on which "module" is activated, based on the event or something
    bindUserClick();
}

