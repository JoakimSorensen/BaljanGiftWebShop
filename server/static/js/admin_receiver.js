function bindUserClick() {
    $('.receiver').on('click', handleReceiverClick);
	$('#add-receiver').on('click', addReceiver);
}

function handleReceiverClick(event) {
    var receiver_id = $(this).data('receiver-id');
    fetchReceiver(receiver_id, presentReceiverData);
}

function fetchReceiver(receiver_id, completionHandler) {
    var url = "api/v1/receiver/" + receiver_id;
    $.getJSON(url, function(data) {
        completionHandler(data)
    });
}

function presentReceiverData(receiverData) {
    $( "#receiver-list" ).hide();
	$('#add-receiver').hide();
    var items = [];
        $.each( receiverData, function( key, val ) {
            items.push( "<h5 id='" + key + "'>"+ key + ":</h5><li>" + val + "</li>" );
        });

        $( "<ul/>", {
            "class": "receiver-info",
            html: items.join( "" )
        }).appendTo( "#receiver-div" );

        $("<button>Ta bort mottagare</button>").on("click", function(e) {
            e.preventDefault();
			$.delete("api/v1/delete_receiver", {id : receiverData['id']});
			$("#admin-receivers").click();
            $("#receiver-div").empty();
            $("#receiver-list").show();
			$('#add-receiver').show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#receiver-div");

        $("<button>Redigera mottagare</button>").on("click", function(e) {
            e.preventDefault();
			$('#receiver-div').empty();
			presentReceiverDataEditable(receiverData);
        }).appendTo("#btn-div");

        $("<button>Tillbaka till mottagarelistan</button>").on("click", function(e) {
            e.preventDefault();
            $("#receiver-div").empty();
            $("#receiver-list").show();
			$('#add-receiver').show();
  		}).appendTo("#btn-div");
}

function presentReceiverDataEditable(receiverData) {
    var items = [];
        $.each( receiverData, function( key, val ) {
			if(key != "created" && key != "modified" && key != "id") {
            	items.push( "<label id=" + key + ">"+ key + ": </label>" );
				items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"  
						+ " value='" + val + "'>");
				}
        });
		

        $( "<ul/>", {
            "class": "receiver-info",
            html: items.join( "" )
        }).appendTo( "#receiver-div" );

        $("<button>Spara ändringar</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/edit_receiver", 
					{id: receiverData['id'], 
						name: $("#name-input").val(), 
						phone: $("#phone-input").val(), 
						}, function(data, status) {
						if (status == "success") {
							alert("Ändringar sparade!");
						} else {
							alert("Ett fel uppstod: " + status);
						}
					});

				$("#admin-receivers").click();
            	$("#receiver-div").empty();
            	$("#receiver-list").show();
				$('#add-receiver').show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#receiver-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#receiver-div").empty();
            $("#receiver-list").show();
			$('#add-receiver').show();
  		}).appendTo("#btn-div");
}

function addReceiver() {
    $( "#receiver-list" ).hide();
    $( "#add-receiver" ).hide();
    var items = [];
	var keys = ["name", "phone"]
        $.each( keys, function(ind, key) {
            items.push( "<label id=" + key + ">"+ key + ": </label>" );
			items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
        });
		
        $( "<ul/>", {
            "class": "receiver-info",
            html: items.join( "" )
        }).appendTo( "#receiver-div" );

        $("<button>Lägg till mottagare</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/add_receiver", 
					{phone: $("#phone-input").val(), 
						name: $("#name-input").val() 
						}, function(data, status) {
						if (status == "success") {
							alert("Mottagare tillagd!");
						} else {
							alert("Ett fel uppstod: " + status);
						}
					});

				$("#admin-receivers").click();
            	$("#gifbox-div").empty();
            	$("#receiver-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#receiver-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#receiver-div").empty();
            $("#receiver-list").show();
			$('#add-receiver').show();
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

