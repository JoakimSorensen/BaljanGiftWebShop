$(document).ready(bindUserClick);

function bindUserClick() {
    $('.receiver').on('click', handleReceiverClick);
    $('#add-receiver').on('click', addReceiver);
}

function handleReceiverClick(event) {
    var receiver_id = $(this).data('receiver-id');
    fetchReceiver(receiver_id, presentReceiverData);
}

function fetchReceiver(receiverID, completionHandler) {
    var url = "api/v1/receiver/" + receiverID;
    $.getJSON(url, function (data) {
        completionHandler(data)
    });
}

function presentReceiverData(receiverData) {
    $("#receiver-list").hide();
    $('#add-receiver').hide();
    var items = [];
    $.each(receiverData, function (key, val) {
        items.push("<h5 id='" + key + "'>" + key + ":</h5><li>" + val + "</li>");
    });

    $("<ul/>", {
        "class": "receiver-info",
        html: items.join("")
    }).appendTo("#receiver-div");

    $("<button>Ta bort mottagare</button>").on("click", function (e) {
        e.preventDefault();
        $.delete("api/v1/delete_receiver", {id: receiverData['id']});
        document.getElementById("admin-receivers").click();
        $("#receiver-div").empty();
        $("#receiver-list").show();
        $('#add-receiver').show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#receiver-div");

    $("<button>Redigera mottagare</button>").on("click", function (e) {
        e.preventDefault();
        $('#receiver-div').empty();
        presentReceiverDataEditable(receiverData);
    }).appendTo("#btn-div");

    $("<button>Tillbaka till mottagarelistan</button>").on("click", function (e) {
        e.preventDefault();
        $("#receiver-div").empty();
        $("#receiver-list").show();
        $('#add-receiver').show();
    }).appendTo("#btn-div");
}

function presentReceiverDataEditable(receiverData) {
    var items = [];
    $.each(receiverData, function (key, val) {
        if (key != "created" && key != "modified" && key != "id") {
            items.push("<label id=" + key + ">" + key + ": </label>");
            items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"
                + " value='" + val + "'>");
        }
    });


    $("<ul/>", {
        "class": "receiver-info",
        html: items.join("")
    }).appendTo("#receiver-div");

    $("<button>Spara ??ndringar</button>").on("click", function (e) {
        e.preventDefault();
        $.post("api/v1/edit_receiver",
            {
                id: receiverData['id'],
                name: $("#name-input").val(),
                phone: $("#phone-input").val(),
            }, function (data, status) {
                if (status == "success") {
                    alert("??ndringar sparade!");
                } else {
                    alert("Ett fel uppstod: " + status);
                }
            });

        document.getElementById("admin-receivers").click();
        $("#receiver-div").empty();
        $("#receiver-list").show();
        $('#add-receiver').show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#receiver-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#receiver-div").empty();
        $("#receiver-list").show();
        $('#add-receiver').show();
    }).appendTo("#btn-div");
}

function addReceiver() {
    $("#receiver-list").hide();
    $("#add-receiver").hide();
    var items = [];
    var keys = ["name", "phone"];
    var localisedLabels = {
        "name": "Namn",
        "phone": "Telefonnummer"
    };
    $.each(keys, function (ind, key) {
        items.push("<label id=" + key + ">" + localisedLabels[key] + ": </label>");
        items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
    });

    $("<ul/>", {
        "class": "receiver-info",
        html: items.join("")
    }).appendTo("#receiver-div");

    $("<button>L??gg till mottagare</button>").on("click", function (e) {
        e.preventDefault();
        $.post("api/v1/add_receiver",
            {
                phone: $("#phone-input").val(),
                name: $("#name-input").val()
            }, function (data, status) {
                if (status == "success") {
                    alert("Mottagare tillagd!");
                } else {
                    alert("Ett fel uppstod: " + status);
                }
            });

        document.getElementById("admin-receivers").click();
        $("#gifbox-div").empty();
        $("#receiver-list").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#receiver-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#receiver-div").empty();
        $("#receiver-list").show();
        $('#add-receiver').show();
    }).appendTo("#btn-div");
}

