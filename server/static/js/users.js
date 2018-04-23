$(document).ready(bindUserClick);

function bindUserClick() {
    $('.user').on('click', handleUserClick);
    $("#add-user").on('click', addUser);
}

function handleUserClick(event) {
    var userId = $(this).data('user-id');
    fetchUser(userId, presentUserData);
}

function fetchUser(userID, completionHandler) {
    var url = "api/v1/users/" + userID;
    $.getJSON(url, function (data) {
        completionHandler(data)
    });
}

function presentUserData(userData) {
    $("#user-list").hide();
    $("#add-user").hide();
    var items = [];
    $.each(userData, function (key, val) {
        items.push("<h5 id='" + key + "'>" + key + ":</h5><li>" + val + "</li>");
    });

    $("<ul/>", {
        "class": "user-info",
        html: items.join("")
    }).appendTo("#user-div");

    $("<button>Ta bort användare</button>").on("click", function (e) {
        e.preventDefault();
        $.delete("api/v1/delete_user", {id: userData['id']});
        document.getElementById("admin-users").click();
        $("#user-div").empty();
        $("#user-list").show();
        $("#add-user").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#user-div");

    $("<button>Redigera användare</button>").on("click", function (e) {
        e.preventDefault();
        $('#user-div').empty();
        presentUserDataEditable(userData);
    }).appendTo("#btn-div");

    $("<button>Tillbaka till användarlistan</button>").on("click", function (e) {
        e.preventDefault();
        $("#user-div").empty();
        $("#user-list").show();
        $("#add-user").show();
    }).appendTo("#btn-div");
}

function presentUserDataEditable(userData) {
    var items = [];
    $.each(userData, function (key, val) {
        if (key != "created" && key != "modified" && key != "id") {
            items.push("<label id=" + key + ">" + key + ": </label>");
            if (key == "email") {
                items.push("<input type=\"email\" class=\"form-control\" id=" + key + "-input"
                    + " value=" + val + ">");
            } else if (key == "is_admin") {
                items.push("<br><input type=\"checkbox\" id=" + key + "-input"
                    + " value=" + val + "><br>");

            } else {
                items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input"
                    + " value=" + val + ">");
            }
        }
    });

    items.push("<label id=password> Lösenord: </label>");
    items.push("<input type=\"password\" class=\"form-control\" id=password-input>");
    items.push("<label id=password2> Repetera lösenord: </label>");
    items.push("<input type=\"password\" class=\"form-control\" id=password2-input>");

    $("<ul/>", {
        "class": "user-info",
        html: items.join("")
    }).appendTo("#user-div");

    $("<button>Spara ändringar</button>").on("click", function (e) {
        e.preventDefault();
        if ($("#password-input").val() != $("#password2-input").val()) {
            alert("Lösenorden måste stämma överens!");
        } else {
            $.post("api/v1/edit_user",
                {
                    id: userData['id'],
                    username: $("#username-input").val(),
                    email: $("#email-input").val(),
                    password: $("#password-input").val(),
                    password2: $("#password2-input").val(),
                    is_admin: $("#is_admin-input").val()
                }, function (data, status) {
                    if (status == "success") {
                        alert("Ändringar sparade!");
                    } else {
                        alert("Ett fel uppstod: " + status);
                    }
                });

            $("#user-div").empty();
            $("#user-list").show();
            $("#add-user").show();
            document.getElementById("admin-users").click();
        }
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#user-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#user-div").empty();
        $("#user-list").show();
        $("#add-user").show();
    }).appendTo("#btn-div");
}

function addUser() {
    $("#user-list").hide();
    $("#add-user").hide();
    var items = [];
    var keys = ["username", "email", "is_admin"];

    var localisedLabels = {
        "username": "Användarnamn",
        "email": "E-post",
        "is_admin": "Administratör"
    };
    $.each(keys, function (ind, key) {
        items.push("<label id=" + key + ">" + localisedLabels[key] + ": </label>");
        if (key == "email") {
            items.push("<input type=\"email\" class=\"form-control\" id=" + key + "-input>");
        } else if (key == "is_admin") {
            items.push("<br><input type=\"checkbox\" id=" + key + "-input><br>");

        } else {
            items.push("<input type=\"text\" class=\"form-control\" id=" + key + "-input" + ">");
        }
    });

    items.push("<label id=password> Lösenord: </label>");
    items.push("<input type=\"password\" class=\"form-control\" id=password-input>");
    items.push("<label id=password2> Repetera lösenord: </label>");
    items.push("<input type=\"password\" class=\"form-control\" id=password2-input>");

    $("<ul/>", {
        "class": "user-info",
        html: items.join("")
    }).appendTo("#user-div");

    $("<button>Lägg till baljör</button>").on("click", function (e) {
        e.preventDefault();
        if ($("#password-input").val() != $("#password2-input").val()) {
            alert("Lösenorden måste stämma överens!");
        } else {
            $.post("api/v1/add_user",
                {
                    email: $("#email-input").val(),
                    is_admin: $("#is_admin-input").val(),
                    username: $("#username-input").val(),
                    password: $("#password-input").val()
                }, function (data, status) {
                    if (status == "success") {
                        alert("Baljör tillagd!");
                    } else {
                        alert("Ett fel uppstod: " + status);
                    }
                });
        }
        document.getElementById("admin-users").click();
        $("#gifbox-div").empty();
        $("#user-list").show();
        $("#add-user").show();
    }).wrap("<form><div id=btn-div></div></form>").closest("form").appendTo("#user-div");

    $("<button>Avbryt</button>").on("click", function (e) {
        e.preventDefault();
        $("#user-div").empty();
        $("#user-list").show();
        $("#add-user").show();
    }).appendTo("#btn-div");
}

