function bindUserClick() {
    $('.giftbox').on('click', handleUserClick);
	$('#add-giftbox').on('click', addGiftBox);
}

function handleUserClick(event) {
    var giftbox_id = $(this).data('giftbox-id');
    fetchUser(giftbox_id, presentUserData);
}

function fetchUser(giftbox_id, completionHandler) {
    var url = "api/v1/giftbox/" + giftbox_id;
    $.getJSON(url, function(data) {
        completionHandler(data)
    });
}

function presentUserData(giftboxData) {
    $( "#giftbox-list" ).hide();
    var items = [];
        $.each( giftboxData, function( key, val ) {
            items.push( "<li id='" + key + "'>"+ key + ": " + val + "</li>" );
        });

        $( "<ul/>", {
            "class": "giftbox-info",
            html: items.join( "" )
        }).appendTo( "#giftbox-div" );

        $("<button>Ta bort gåva</button>").on("click", function(e) {
            e.preventDefault();
			$.delete("api/v1/delete_giftbox", {id : giftboxData['id']});
			$("#admin-giftboxs").click();
            $("#giftbox-div").empty();
            $("#giftbox-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftbox-div");

        $("<button>Redigera gåva</button>").on("click", function(e) {
            e.preventDefault();
			$('#giftbox-div').empty();
			presentUserDataEditable(giftboxData);
        }).appendTo("#btn-div");

        $("<button>Tillbaka till gåvolistan</button>").on("click", function(e) {
            e.preventDefault();
            $("#giftbox-div").empty();
            $("#giftbox-list").show();
  		}).appendTo("#btn-div");
}

function presentUserDataEditable(giftboxData) {
    var items = [];
        $.each( giftboxData, function( key, val ) {
			if(key != "created" && key != "modified" && key != "id") {
            	items.push( "<label id=" + key + ">"+ key + ": </label>" );
				items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"  
						+ " value='" + val + "'>");
				}
        });
		

        $( "<ul/>", {
            "class": "giftbox-info",
            html: items.join( "" )
        }).appendTo( "#giftbox-div" );

        $("<button>Spara ändringar</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/edit_giftbox", 
					{id: giftboxData['id'], 
						description: $("#description-input").val(), 
						image: $("#image-input").val(), 
						name: $("#name-input").val(), 
						price: $("#price-input").val(), 
						}, function(data, status) {
						if (status == "success") {
							alert("Ändringar sparade!");
						} else {
							alert("Ett fel uppstod: " + status);
						}
					});

				$("#admin-giftboxs").click();
            	$("#giftbox-div").empty();
            	$("#giftbox-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftbox-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#giftbox-div").empty();
            $("#giftbox-list").show();
  		}).appendTo("#btn-div");
}

function addGiftBox() {
    $( "#giftbox-list" ).hide();
    $( "#add-giftbox" ).hide();
    var items = [];
	var keys = ["description", "image", "price", "name"]
        $.each( keys, function(ind, key) {
            items.push( "<label id=" + key + ">"+ key + ": </label>" );
			items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
        });
		
        $( "<ul/>", {
            "class": "giftbox-info",
            html: items.join( "" )
        }).appendTo( "#giftbox-div" );

        $("<button>Lägg till gåva</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/add_giftbox", 
					{description: $("#description-input").val(), 
						image: $("#image-input").val(), 
						name: $("#name-input").val(), 
						price: $("#price-input").val() 
						}, function(data, status) {
						if (status == "success") {
							alert("Gåva tillagd!");
						} else {
							alert("Ett fel uppstod: " + status);
						}
					});

				$("#admin-giftboxs").click();
            	$("#gifbox-div").empty();
            	$("#giftbox-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftbox-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#giftbox-div").empty();
            $("#giftbox-list").show();
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

