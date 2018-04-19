$(document).ready(bindUserClick);

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
    $.getJSON(url, function (data) {
        completionHandler(data)
    });
}

function presentUserData(giftboxData) {
    $("#giftbox-list").hide();
    $("#add-giftbox").hide();
    var items = [];
    $.each(giftboxData, function (key, val) {
        items.push("<h5 id='" + key + "'>" + key + ":</h5><li>" + val + "</li>");
    });

    $("<ul/>", {
        "class": "giftbox-edit",
        html: items.join("")
    }).appendTo("#giftbox-div");

    $("<button>Ta bort gåva</button>").on("click", function (e) {
        e.preventDefault();
        $.delete("api/v1/delete_giftbox", {id: giftboxData['id']});
        document.getElementById("admin-giftboxs").click();
        $("#giftbox-div").empty();
        $("#giftbox-list").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftbox-div");

    $("<button>Redigera gåva</button>").on("click", function (e) {
        e.preventDefault();
        $('#giftbox-div').empty();
        presentUserDataEditable(giftboxData);
    }).appendTo("#btn-div");

    $("<button>Tillbaka till gåvolistan</button>").on("click", function (e) {
        e.preventDefault();
        $("#giftbox-div").empty();
        $("#giftbox-list").show();
        $("#add-giftbox").show();
    }).appendTo("#btn-div");
}

function presentUserDataEditable(giftboxData) {
    $("#giftbox-list").hide();
    $("#add-giftbox").hide();
    var items = [];
    $.each(giftboxData, function (key, val) {
        if (key != "created" && key != "modified" && key != "id" && key != "products") {
            items.push("<label id=" + key + ">" + key + ": </label>");
            items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"
                + " value='" + val + "'>");
        } else if (key == "products") {
            items.push("<label id=" + key + ">" + key + ": </label><br>");
            $.each(val, function (ind, product) {
                items.push("<div data-product-name=" + product + " id=" + product
                    + "-link class='product-link'>" + product
                    + "<span class='tooltiptext'>Klicka för att ta bort</span></div><br>");
            });
            items.push("<br><input type=\"text\" id=product-input"
                + " placeholder='lägg till produkt..'><button id='add-prod-btn'>Lägg till</button><br>");
        }
    });

    $("<ul/>", {
        "class": "giftbox-info",
        html: items.join("")
    }).appendTo("#giftbox-div");

    $(".product-link").on('click', function () {
        $.post("api/v1/delete-product-giftbox",
            {
                id: giftboxData['id'],
                name: $(this).data("product-name")
            },
            function () {
                document.getElementById("admin-giftboxs").click();
                $("#giftbox-div").empty();
                fetchUser(giftboxData['id'], presentUserDataEditable);
            });
    });

    $("#add-prod-btn").on('click', function () {
        $.post("api/v1/add-product-giftbox",
            {
                id: giftboxData['id'],
                name: $("#product-input").val()
            }, function (status) {
                if (status != "success") {
                    alert("Välj en existerande produkt!");
                } else {
                    document.getElementById("admin-giftboxs").click();
                    $("#giftbox-div").empty();
                    fetchUser(giftboxData['id'], presentUserDataEditable);
                }
            });
    });

    $("<button>Spara ändringar</button>").on("click", function (e) {
        e.preventDefault();
        $.post("api/v1/edit_giftbox",
            {
                id: giftboxData['id'],
                description: $("#description-input").val(),
                image: $("#image-input").val(),
                name: $("#name-input").val(),
                price: $("#price-input").val(),
            }, function (data, status) {
                if (status == "success") {
                    alert("Ändringar sparade!");
                } else {
                    alert("Ett fel uppstod: " + status);
                }
            });

        document.getElementById("admin-giftboxs").click();
        $("#giftbox-div").empty();
        $("#giftbox-list").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftbox-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#giftbox-div").empty();
        $("#giftbox-list").show();
        $("#add-giftbox").show();
    }).appendTo("#btn-div");
}

function addGiftBox() {
    $("#giftbox-list").hide();
    $("#add-giftbox").hide();
    var items = [];
    var keys = ["description", "image", "price", "name"]
    var localisedLabels = {
        "description": "Beskrivning",
        "image": "Bild",
        "price": "Pris",
        "name": "Namn"
    };
    $.each(keys, function (ind, key) {
        items.push("<label id=" + key + ">" + localisedLabels[key] + ": </label>");
        items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
    });

    $("<ul/>", {
        "class": "giftbox-info",
        html: items.join("")
    }).appendTo("#giftbox-div");

    $("<button>Lägg till gåva</button>").on("click", function (e) {
        e.preventDefault();
        $.post("api/v1/add_giftbox",
            {
                description: $("#description-input").val(),
                image: $("#image-input").val(),
                name: $("#name-input").val(),
                price: $("#price-input").val()
            }, function (data, status) {
                if (status == "success") {
                    alert("Gåva tillagd!");
                } else {
                    alert("Ett fel uppstod: " + status);
                }
            });

        document.getElementById("admin-giftboxs").click();
        $("#gifbox-div").empty();
        $("#giftbox-list").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#giftbox-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#giftbox-div").empty();
        $("#giftbox-list").show();
        $("#add-giftbox").show();
    }).appendTo("#btn-div");
}

