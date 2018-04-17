$(document).ready(bindUserClick);

function bindUserClick() {
    $('.product').on('click', handleUserClick);
	$('#add-product').on('click', addProduct);
}

function handleUserClick(event) {
    var product_id = $(this).data('product-id');
    fetchUser(product_id, presentUserData);
}

function fetchUser(product_id, completionHandler) {
    var url = "api/v1/product/" + product_id;
    $.getJSON(url, function(data) {
        completionHandler(data)
    });
}

function presentUserData(productData) {
    $( "#product-list" ).hide();
	$('#add-product').hide();
    var items = [];
        $.each( productData, function( key, val ) {
            items.push( "<h5 id='" + key + "'>"+ key + ":</h5><li>" + val + "</li>" );
        });

        $( "<ul/>", {
            "class": "product-info",
            html: items.join( "" )
        }).appendTo( "#product-div" );

        $("<button>Ta bort produkt</button>").on("click", function(e) {
            e.preventDefault();
			$.delete("api/v1/delete_product", {id : productData['id']});
			document.getElementById("admin-products").click();
            $("#product-div").empty();
            $("#product-list").show();
			$('#add-product').show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#product-div");

        $("<button>Redigera produkt</button>").on("click", function(e) {
            e.preventDefault();
			$('#product-div').empty();
			presentUserDataEditable(productData);
        }).appendTo("#btn-div");

        $("<button>Tillbaka till gåvolistan</button>").on("click", function(e) {
            e.preventDefault();
            $("#product-div").empty();
            $("#product-list").show();
			$('#add-product').show();
  		}).appendTo("#btn-div");
}

function presentUserDataEditable(productData) {
    var items = [];
        $.each( productData, function( key, val ) {
			if(key != "created" && key != "modified" && key != "id") {
            	items.push( "<label id=" + key + ">"+ key + ": </label>" );
				items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"  
						+ " value='" + val + "'>");
				}
        });
		

        $( "<ul/>", {
            "class": "product-info",
            html: items.join( "" )
        }).appendTo( "#product-div" );

        $("<button>Spara ändringar</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/edit_product", 
					{id: productData['id'], 
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

				document.getElementById("admin-products").click();
            	$("#product-div").empty();
            	$("#product-list").show();
				$('#add-product').show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#product-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#product-div").empty();
            $("#product-list").show();
			$('#add-product').show();
  		}).appendTo("#btn-div");
}

function addProduct() {
    $( "#product-list" ).hide();
    $( "#add-product" ).hide();
    var items = [];
	var keys = ["allergen", "image", "price", "name"]
	var localisedLabels = {
        "allergen": "Allergen",
        "image": "Bild",
        "price": "Pris",
        "name": "Namn"
    };
        $.each( keys, function(ind, key) {
            items.push( "<label id=" + key + ">"+ localisedLabels[key] + ": </label>" );
			items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
        });
		
        $( "<ul/>", {
            "class": "product-info",
            html: items.join( "" )
        }).appendTo( "#product-div" );

        $("<button>Lägg till produkt</button>").on("click", function(e) {
            e.preventDefault();
				$.post("api/v1/add_product", 
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

				document.getElementById("admin-products").click();
            	$("#gifbox-div").empty();
            	$("#product-list").show();
        }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#product-div");
        
	$("<button>Avbryt</button>").on("click", function(e) {
            e.preventDefault();
            $("#product-div").empty();
            $("#product-list").show();
            $( "#add-product").show();
  		}).appendTo("#btn-div");
}

