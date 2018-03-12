function bindUserClick() {
    $('.order').on('click', handleUserClick);
}

function handleUserClick(event) {
    var order_id = $(this).data('order-id');
    fetchUser(order_id, presentUserData);
}

function fetchUser(order_id, completionHandler) {
    var url = "api/v1/order/" + order_id;
    $.getJSON(url, function(data) {
        completionHandler(data)
    });
}

function presentUserData(orderData) {
    $( "#order-list" ).hide();
    var items = [];
        $.each( orderData, function( key, val ) {
            items.push( "<li id='" + key + "'>"+ key + ": " + val + "</li>" );
        });

        $( "<ul/>", {
            "class": "order-info",
            html: items.join( "" )
        }).appendTo( "#order-div" );

        $("<button>Ta bort order</button>").on("click", function(e) {
            e.preventDefault();
			$.delete("api/v1/delete_order", {id : orderData['id']});
			$("#admin-orders").click();
            $("#order-div").empty();
            $("#order-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#order-div");

        $("<button>Redigera order</button>").on("click", function(e) {
            e.preventDefault();
			$('#order-div').empty();
			presentUserDataEditable(orderData);
        }).appendTo("#btn-div");

        $("<button>Tillbaka till orderlistan</button>").on("click", function(e) {
            e.preventDefault();
            $("#order-div").empty();
            $("#order-list").show();
  		}).appendTo("#btn-div");
}

function presentUserDataEditable(orderData) {
    var items = [];
        $.each( orderData, function( key, val ) {
			if(key != "created" && key != "modified" && key != "id") {
            	items.push( "<label id=" + key + ">"+ key + ": </label>" );
				items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"  
						+ " value='" + val + "'>");
				}
        });
		

        $( "<ul/>", {
            "class": "order-info",
            html: items.join( "" )
        }).appendTo( "#order-div" );

        $("<button>Spara ändringar</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/edit_order", 
					{id: orderData['id'], 
						buyer: $("#buyer-input").val(), 
						buyer_id: $("#buyer_id-input").val(), 
						date: $("#date-input").val(), 
						giftbox: $("#giftbox-input").val(), 
						giftbox_id: $("#giftbox_id-input").val(), 
						receiver: $("#receiver-input").val(), 
						giftbox_id: $("#receiver_id-input").val(), 
						status_: $("#status-input").val(), 
						price: $("#price-input").val(), 
						}, function(data, status) {
						if (status == "success") {
							alert("Ändringar sparade!");
						} else {
							alert("Ett fel uppstod: " + status);
						}
					});

				$("#admin-orders").click();
            	$("#order-div").empty();
            	$("#order-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#order-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#order-div").empty();
            $("#order-list").show();
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

