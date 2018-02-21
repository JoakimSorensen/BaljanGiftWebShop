function bindUserClick() {
    $('.user').on('click', handleUserClick);
}

function handleUserClick(event) {
    var user_id = $(this).data('user-id');
    fetchUser(user_id, presentUserData);
}

function fetchUser(user_id, completionHandler) {
    var url = "api/v1/users/" + user_id;
    $.getJSON(url, function(data) {
        completionHandler(data)
    });
}

function presentUserData(userData) {
    $( "#user-list" ).hide();
    var items = [];
        $.each( userData, function( key, val ) {
            items.push( "<li id='" + key + "'>"+ key + ": " + val + "</li>" );
        });

        $( "<ul/>", {
            "class": "user-info",
            html: items.join( "" )
        }).appendTo( "#user-div" );

        $("<button>Tillbaka till användarlistan</button>").on("click", function(e) {
            e.preventDefault();
            $("#user-div").empty();
            $("#user-list").show();
        }).wrap("<form><div></div></form>").closest("form").appendTo("#user-div");
}