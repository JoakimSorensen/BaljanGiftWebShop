$('[data-toggle="tooltip"]').tooltip();

function swishData() {
    console.log("Performing swish payment");
    var name = $("#name").val();
    var recName = $("#rec-name").val();
    var number = $("#phonenumber").val();
    var email = $("#email").val();
    var message = $("#message").val();
    var giftbox = $("#giftbox").val();

    var data = {
        "rec-name": recName,
        "phonenumber": number,
        "message": message,
        "email": email,
        "name": name,
        "giftbox": giftbox
    };

    $.get("/api/v1/swish_payment_completed/", data, function (res) {
        var token = res["token"];
        window.location.href = "/order?token=" + token;
    });

}

$(document).ready(function () {
    $("#name-error").hide();
    $("#rec-name-error").hide();
    $("#phonenumber-error").hide();
    $("#email-error").hide();
    $("#swishNumber-error").hide();


    $("#hider").hide();
    $("#swish").hide();

    var handler = StripeCheckout.configure({
        key: 'pk_test_tA2Aq6pmnwXZvAwayRaPnFKm',
        locale: 'auto',
        panelLabel: "Betala",
        currency: "sek",
        zipCode: false,
        allowRememberMe: false,
        token: function(token) {
            var data = {
                "stripeToken": token.id,
                "rec-name": $("#rec-name").val(),
                "phonenumber": $("#phonenumber").val(),
                "message": $("#message").val(),
                "name": $("#name").val(),
                "email": $("#email").val(),
                "giftbox": $("#giftbox").val(),
                "giftbox-price": $("#giftbox-price").val()
            };
            $.post("/api/v1/payment_completed/", data, function(res) {
                var token = res["token"];
                window.location.href = "/order?token=" + token;
            });
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
        }
    });

    $("#swish-button").on("click", function () {
        /*swishData();*/
        if (document.getElementById("swish-button").classList.contains('disabled')) {
            validateName();
            validateNumber($("#phonenumber").val(), $("#phonenumber-error"));
            validateRecName();
            validate();
        } else {
            $("#hider").fadeIn("slow");
            $("#swish").fadeIn("slow");
            $("#loaderMain").hide();
            $("#swishPayement").hide();
            $("#swish-phone-form").show();

        }

    });

    $("#closeSwish").on("click", function () {
        $("#swish").fadeOut("slow");
        $("#hider").fadeOut("slow");
    });


    $("#submit-input").on("submit", function () {
        console.log($("#buyer-phone").val());
    });

    $("#swish-phone-form").submit(function (ev) {

        ev.preventDefault();

        var lengthOk = $("#buyer-phone").val().length == 10;
        var numbersOk = /^[0-9]*$/.test($("#buyer-phone").val());

        validateNumber($("#buyer-phone").val(), $("#swishNumber-error"));

        if (lengthOk && numbersOk) {
            $("#swish-phone-form").hide();
            $("#loaderMain").show();
            setTimeout(function () {
                $("#loaderMain").hide();
                $("#swishPayement").show();
                swishData();

                setTimeout(function () {
                    $("#swish").hide();
                    $("#hider").hide();

                }, 1500);

            }, 5000);

        } else {
            console.log("failure");
        }
    });

    $("#stripeButton").on("click", function(e) {
        console.log("Clicked stripe button");
        if (document.getElementById("stripeButton").classList.contains('disabled')) {
            validateName();
            validateNumber($("#phonenumber").val(), $("#phonenumber-error"));
            validateRecName();
            validate();
        } else {
            console.log("'Breakpoint'");
            handler.open({
                name: $("#stripe-data-name").val(),
                image: $("#stripe-data-image").val(),
                amount: Number($("#stripe-data-amount").val()),
                email: $("#email").val()
            });
            e.preventDefault();
        }
    });

});

function validateName() {
    var name = $("#name").val();
    if (name == "") {
        $("#name-error").show();
    } else {
        $("#name-error").hide();
    }
}
function validateRecName() {
    var name = $("#rec-name").val();
    if (name == "") {
        $("#rec-name-error").show();
    } else {
        $("#rec-name-error").hide();
    }
}
function validateNumber(number, errorDiv) {

    if ((/^[0-9]*$/.test(number)) && (number.length == 10)) {
        errorDiv.hide();
    } else {
        errorDiv.show();
    }


}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validate() {
    var email = $("#email").val();

    if (validateEmail(email)) {
        $("#email-error").hide();

        return true;
    } else {
        $("#email-error").show();
        return false;
    }
}


$('#stripeStuff').hide();


$('#myModal').ready(function () {
    $('.inputfield').keyup(function () {
        if ($('#email').val().length != 0 && $('#name').val().length != 0 && (/^[0-9]*$/.test($("#phonenumber").val())) && ($("#phonenumber").val().length == 10) && $('#rec-name').val().length != 0 && validate())
            $('.button1').removeClass('disabled');
        else
            $('.button1').addClass('disabled');
    });
});
