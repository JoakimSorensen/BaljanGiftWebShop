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

        $("<button>Ta bort användare</button>").on("click", function(e) {
            e.preventDefault();
			$.delete("/delete_user", {id : userData['id']});
			$("#admin-users").click();
            $("#user-div").empty();
            $("#user-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#user-div");

        $("<button>Redigera användare</button>").on("click", function(e) {
            e.preventDefault();
			var url = "/edit_user";
			$.post(url, {id : userData['id']}, function(status) {
				alert("In post with status: " + status);
			});
			$("#main-container").load(url, {id : userData['id']}, function(status) {
				alert("Status: " + status);
			});
        }).appendTo("#btn-div");

        $("<button>Tillbaka till användarlistan</button>").on("click", function(e) {
            e.preventDefault();
            $("#user-div").empty();
            $("#user-list").show();
  		}).appendTo("#btn-div");
}

$.delete = function(url, data, callback, type){
	 
	  if ( $.isFunction(data) ){
		      type = type || callback,
			          callback = data,
			          data = {}
		    }
	 
	  return $.ajax({
		      url: url,
		      type: 'DELETE',
		      success: callback,
		      data: data,
		      contentType: type
		    });
}
