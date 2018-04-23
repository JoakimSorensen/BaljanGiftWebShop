$(document).ready(bindUserClick);

function bindUserClick() {
    $(".send-status-wait").hide();
    $('.order').on('click', handleUserClick);
    $('#add-order').on('click', addOrder);
    $(".status-button").on('click', changeStatus);
    $(".send-status-button").on('click', notifyStatus);
    $("#token-button").on('click', getFromToken);
}

function handleUserClick(event) {
    var order_id = $(this).data('order-id');
    fetchUser(order_id, presentUserData);
}

function fetchUser(order_id, completionHandler) {
    var url = "api/v1/order/" + order_id;
    $.getJSON(url, function (data) {
        completionHandler(data)
    });
}

function changeStatus(event) {
    var order_id = $(this).data('order-id');
    $.post("api/v1/change_status/" + order_id);
    document.getElementById("admin-orders").click();
    event.stopPropagation();
}

function notifyStatus(event) {
    var order_id = $(this).data('order-id');
    $("#send-status-" + order_id).hide();
    $("#send-status-wait-" + order_id).show();
    $.get("api/v1/notify-buyer-status/" + order_id, function (data, status) {
        if (status == "success") {
            alert("Köparen har blivit notifierad!");
            $("#send-status-wait-" + order_id).hide();
            $("#send-status-" + order_id).show();
        } else {
            alert("Ett fel uppstod! Status = " + status + "\nMeddelande = " + data);
            $("#send-status-wait-" + order_id).hide();
            $("#send-status-" + order_id).show();
        }
    });
    event.stopPropagation();
}

function getFromToken(event) {
    var url = "api/v1/order_token/" + $("#token-search").val();
    $("#order-div").empty();
    $.getJSON(url, function (data) {
        presentUserData(data)
    });
}

function presentUserData(orderData) {
    $("#order-list").hide();
    $("#add-order").hide();
    var items = [];
    $.each(orderData, function (key, val) {
        if (key != "buyer" && key != "receiver") {
            items.push("<h5 id='" + key + "'>" + key + ":</h5><li>" + val + "</li>");
        }
    });

    $("<ul/>", {
        "class": "order-info",
        html: items.join("")
    }).appendTo("#order-div");

    $("<button>Ta bort order</button>").on("click", function (e) {
        e.preventDefault();
        $.delete("api/v1/delete_order", {id: orderData['id']});
        document.getElementById("admin-orders").click();
        $("#order-div").empty();
        $("#order-list").show();
        $("#add-order").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#order-div");

    $("<button>Redigera order</button>").on("click", function (e) {
        e.preventDefault();
        $('#order-div').empty();
        presentUserDataEditable(orderData);
    }).appendTo("#btn-div");

    $("<button>Kontrollera token</button>").on("click", function (e) {
        e.preventDefault();
        $('#order-div').empty();
        checkUuid(orderData);
    }).appendTo("#btn-div");

    $("<button>Tillbaka till orderlistan</button>").on("click", function (e) {
        e.preventDefault();
        $("#order-div").empty();
        $("#order-list").show();
        $("#add-order").show();
    }).appendTo("#btn-div");
}

function checkUuid(orderData) {
    var items = [];
    items.push("<label id=uuid>Hash:</label><input type=\"text\" class=\"form-control\" id=uuid-input>");

    $("<ul/>", {
        "class": "check-uuid",
        html: items.join("")
    }).appendTo("#order-div");

    $("<button>Kontrollera token</button>").on("click", function (e) {
        e.preventDefault();
        $.getJSON("api/v1/check_order_hash/" + orderData['id'] + "/" + $("#uuid-input").val(),
            function (data, status) {
                if (status == "success") {
                    alert("Token stämmer!");
                } else {
                    alert("Ett fel uppstod: " + status);
                }
            });

        document.getElementById("admin-orders").click();
        $("#order-div").empty();
        $("#order-list").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#order-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#order-div").empty();
        $("#order-list").show();
    }).appendTo("#btn-div");
}

function presentUserDataEditable(orderData) {
    var items = [];
    $.each(orderData, function (key, val) {
        if (key != "created" && key != "modified" && key != "id" && key != "receiver" && key != "buyer") {
            items.push("<label id=" + key + ">" + key + ": </label>");
            items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"
                + " value='" + val + "'>");
        }
    });


    $("<ul/>", {
        "class": "order-info",
        html: items.join("")
    }).appendTo("#order-div");

    $("<button>Spara ändringar</button>").on("click", function (e) {
        e.preventDefault();
        $.post("api/v1/edit_order",
            {
                id: orderData['id'],
                buyer: $("#buyer-input").val(),
                buyer_id: $("#buyer_id-input").val(),
                date: $("#date-input").val(),
                giftbox: $("#giftbox-input").val(),
                giftbox_id: $("#giftbox_id-input").val(),
                receiver: $("#receiver-input").val(),
                receiver_id: $("#receiver_id-input").val(),
                status_: $("#status-input").val(),
                price: $("#price-input").val(),
                message: $("#message-input").val()
            }, function (data, status) {
                if (status == "success") {
                    alert("Ändringar sparade!");
                } else {
                    alert("Ett fel uppstod: " + status);
                }
            });

        document.getElementById("admin-orders").click();
        $("#order-div").empty();
        $("#order-list").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#order-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#order-div").empty();
        $("#order-list").show();
    }).appendTo("#btn-div");
}

function addOrder() {
    $("#order-list").hide();
    $("#add-order").hide();
    var items = [];
    var keys = ["buyer_id", "date", "giftbox_id", "receiver_id", "status_", "message"];
    var localisedLabels = {
        "buyer_id": "Köparens id",
        "date": "Datum",
        "giftbox_id": "Gåvoboxens id",
        "receiver_id": "Mottagarens id",
        "status_": "Status",
        "message": "Meddelande"
    };
    $.each(keys, function (ind, key) {
        items.push("<label id=" + key + ">" + localisedLabels[key] + ": </label>");
        items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
    });

    $("<ul/>", {
        "class": "order-info",
        html: items.join("")
    }).appendTo("#order-div");

    $("<button>Lägg till order</button>").on("click", function (e) {
        e.preventDefault();
        $.post("api/v1/add_order",
            {
                buyer: $("#buyer-input").val(),
                buyer_id: $("#buyer_id-input").val(),
                date: $("#date-input").val(),
                giftbox: $("#giftbox-input").val(),
                giftbox_id: $("#giftbox_id-input").val(),
                receiver: $("#receiver-input").val(),
                receiver_id: $("#receiver_id-input").val(),
                status_: $("#status-input").val(),
                price: $("#price-input").val(),
                message: $("#message-input").val()
            }, function (data, status) {
                if (status == "success") {
                    alert("Order tillagd!");
                } else {
                    alert("Ett fel uppstod: " + status);
                }
            });

        document.getElementById("admin-orders").click();
        $("#order-div").empty();
        $("#order-list").show();
        $("#add-order").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#order-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#order-div").empty();
        $("#order-list").show();
        $("#add-order").show();
    }).appendTo("#btn-div");
}

