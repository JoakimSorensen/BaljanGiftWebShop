$('[data-toggle="tooltip"]').tooltip();


function handleColClick(event) {
    $('#list-container').fadeOut(function () {
        $('#list-container').load('/html/card/' + event.target.id, function () {
            bindEventHandlers(event);
            $('#list-container').fadeIn();
        });
    });
}

$('#myModal').on('show.bs.modal', function (e) {
     ide = e.relatedTarget.id;
    $('.modal-body').load('/html/card/' + ide);
});


function bindEventHandlers(event) {
    // TODO: Bind the proper event handlers based on which "module" is activated, based on the event or something
    bindUserClick();
}
