    $('[data-toggle="tooltip"]').tooltip();

    $('.overlay').on('click', handleColClick);


    function handleColClick(event) {
        var url = "/" + "card";

        $('#list-container').fadeOut(function () {
            $('#list-container').load(url, function () {
                bindEventHandlers(event);
                $('#list-container').fadeIn();
            });
        });
    }

    function bindEventHandlers(event) {
        // TODO: Bind the proper event handlers based on which "module" is activated, based on the event or something
        bindUserClick();
    }
