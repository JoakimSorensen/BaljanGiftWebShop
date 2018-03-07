$('[data-toggle="tooltip"]').tooltip();


function handleColClick(event) {
    var x = Number("1");
    $('#list-container').fadeOut(function () {
        $('#list-container').load('/card/' + event.target.id, function () {
            bindEventHandlers(event);
            $('#list-container').fadeIn();
        });
    });
}

$('#myModal').on('show.bs.modal', function (e) {
     ide = e.relatedTarget.id;
    $('.modal-body').load('/card/' + ide);
});

/*
Lär ej behövas detta:
*/
/*function loadcard(ide) {
    $('#list-container').fadeOut(function () {
        $('#list-container').load('/card/' + ide, function () {
            $('#list-container').fadeIn();
        });
    })
}*/

function bindEventHandlers(event) {
    // TODO: Bind the proper event handlers based on which "module" is activated, based on the event or something
    bindUserClick();
}
