function bindUserClick() {
    $('.giftboxproduct').on('click', handleUserClick);
	$('#add-giftboxproduct').on('click', addGiftBoxProduct);
}

function handleUserClick(event) {
    var giftboxproduct_id = $(this).data('giftboxproduct-id');
    fetchUser(giftboxproduct_id, presentUserData);
}

function fetchUser(giftboxproduct_id, completionHandler) {
    var url = "api/v1/giftboxproduct/" + giftboxproduct_id;
    $.getJSON(url, function(data) {
        completionHandler(data)
    });
}

function presentUserData(giftboxproductData) {
    $( "#giftboxproduct-list" ).hide();
    var items = [];
        $.each( giftboxproductData, function( key, val ) {
            items.push( "<li id='" + key + "'>"+ key + ": " + val + "</li>" );
        });

        $( "<ul/>", {
            "class": "giftboxproduct-info",
            html: items.join( "" )
        }).appendTo( "#giftboxproduct-div" );

        $("<button>Ta bort Gåvoprodukt</button>").on("click", function(e) {
            e.preventDefault();
			$.delete("api/v1/delete_giftboxproduct", {id : giftboxproductData['id']});
			$("#admin-giftboxproducts").click();
            $("#giftboxproduct-div").empty();
            $("#giftboxproduct-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftboxproduct-div");

        $("<button>Redigera Gåvoprodukt</button>").on("click", function(e) {
            e.preventDefault();
			$('#giftboxproduct-div').empty();
			presentUserDataEditable(giftboxproductData);
        }).appendTo("#btn-div");

        $("<button>Tillbaka till gåvolistan</button>").on("click", function(e) {
            e.preventDefault();
            $("#giftboxproduct-div").empty();
            $("#giftboxproduct-list").show();
  		}).appendTo("#btn-div");
}

function presentUserDataEditable(giftboxproductData) {
    var items = [];
        $.each( giftboxproductData, function( key, val ) {
			if(key != "created" && key != "modified" && key != "id") {
            	items.push( "<label id=" + key + ">"+ key + ": </label>" );
				items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"  
						+ " value='" + val + "'>");
				}
        });
		

        $( "<ul/>", {
            "class": "giftboxproduct-info",
            html: items.join( "" )
        }).appendTo( "#giftboxproduct-div" );

        $("<button>Spara ändringar</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/edit_giftboxproduct", 
					{id: giftboxproductData['id'], 
						allergen: $("#allergen-input").val(), 
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

				$("#admin-giftboxproducts").click();
            	$("#giftboxproduct-div").empty();
            	$("#giftboxproduct-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftboxproduct-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#giftboxproduct-div").empty();
            $("#giftboxproduct-list").show();
  		}).appendTo("#btn-div");
}

function addGiftBoxProduct() {
    $( "#giftboxproduct-list" ).hide();
    $( "#add-giftboxproduct" ).hide();
    var items = [];
	var keys = ["allergen", "image", "price", "name"]
        $.each( keys, function(ind, key) {
            items.push( "<label id=" + key + ">"+ key + ": </label>" );
			items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
        });
		
        $( "<ul/>", {
            "class": "giftboxproduct-info",
            html: items.join( "" )
        }).appendTo( "#giftboxproduct-div" );

        $("<button>Lägg till Gåvoprodukt</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/add_giftboxproduct", 
					{allergen: $("#allergen-input").val(), 
						image: $("#image-input").val(), 
						name: $("#name-input").val(), 
						price: $("#price-input").val() 
						}, function(data, status) {
						if (status == "success") {
							alert("Produkt tillagd!");
						} else {
							alert("Ett fel uppstod: " + status);
						}
					});

				$("#admin-giftboxproducts").click();
            	$("#gifbox-div").empty();
            	$("#giftboxproduct-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftboxproduct-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#giftboxproduct-div").empty();
            $("#giftboxproduct-list").show();
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

