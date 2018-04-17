$(document).ready(bindUserClick);

function bindUserClick() {
    $('.buyer').on('click', handleBuyerClick);
	$('#add-buyer').on('click', addBuyer);
}

function handleBuyerClick(event) {
    var buyer_id = $(this).data('buyer-id');
    fetchBuyer(buyer_id, presentBuyerData);
}

function fetchBuyer(buyer_id, completionHandler) {
    var url = "api/v1/buyer/" + buyer_id;
    $.getJSON(url, function(data) {
        completionHandler(data)
    });
}

function presentBuyerData(buyerData) {
    $( "#buyer-list" ).hide();
	$('#add-buyer').hide();
    var items = [];
        $.each( buyerData, function( key, val ) {
            items.push( "<h5 id='" + key + "'>"+ key + ":</h5><li>" + val + "</li>" );
        });

        $( "<ul/>", {
            "class": "buyer-info",
            html: items.join( "" )
        }).appendTo( "#buyer-div" );

        $("<button>Ta bort köpare</button>").on("click", function(e) {
            e.preventDefault();
			$.delete("api/v1/delete_buyer", {id : buyerData['id']});
			document.getElementById("admin-buyers").click();
            $("#buyer-div").empty();
            $("#buyer-list").show();
			$('#add-buyer').show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#buyer-div");

        $("<button>Redigera köpare</button>").on("click", function(e) {
            e.preventDefault();
			$('#buyer-div').empty();
			presentBuyerDataEditable(buyerData);
        }).appendTo("#btn-div");

        $("<button>Tillbaka till köparelistan</button>").on("click", function(e) {
            e.preventDefault();
            $("#buyer-div").empty();
            $("#buyer-list").show();
			$('#add-buyer').show();
  		}).appendTo("#btn-div");
}

function presentBuyerDataEditable(buyerData) {
    var items = [];
        $.each( buyerData, function( key, val ) {
			if(key != "created" && key != "modified" && key != "id") {
            	items.push( "<label id=" + key + ">"+ key + ": </label>" );
				items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"  
						+ " value='" + val + "'>");
				}
        });
		

        $( "<ul/>", {
            "class": "buyer-info",
            html: items.join( "" )
        }).appendTo( "#buyer-div" );

        $("<button>Spara ändringar</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/edit_buyer", 
					{id: buyerData['id'], 
						name: $("#name-input").val(), 
						email: $("#email-input").val() 
						}, function(data, status) {
						if (status == "success") {
							alert("Ändringar sparade!");
						} else {
							alert("Ett fel uppstod: " + status);
						}
					});

				document.getElementById("admin-buyers").click();
            	$("#buyer-div").empty();
            	$("#buyer-list").show();
				$('#add-buyer').show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#buyer-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#buyer-div").empty();
            $("#buyer-list").show();
			$('#add-buyer').show();
  		}).appendTo("#btn-div");
}

function addBuyer() {
    $( "#buyer-list" ).hide();
    $( "#add-buyer" ).hide();
    var items = [];
	var keys = ["name", "email"]
        $.each( keys, function(ind, key) {
            items.push( "<label id=" + key + ">"+ key + ": </label>" );
			items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
        });
		
        $( "<ul/>", {
            "class": "buyer-info",
            html: items.join( "" )
        }).appendTo( "#buyer-div" );

        $("<button>Lägg till köpare</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/add_buyer", 
					{name: $("#name-input").val(), 
						email: $("#email-input").val() 
						}, function(data, status) {
						if (status == "success") {
							alert("Köpare tillagd!");
						} else {
							alert("Ett fel uppstod: " + status);
						}
					});

				document.getElementById("admin-buyers").click();
            	$("#gifbox-div").empty();
            	$("#buyer-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#buyer-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#buyer-div").empty();
            $("#buyer-list").show();
            $( "#add-buyer").show();
  		}).appendTo("#btn-div");
}

