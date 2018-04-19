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
        console.log("heeej");

    });

    $("#swish-phone-form").submit(function (ev) {

        ev.preventDefault();

        var lengthOk = $("#buyer-phone").val().length == 10;
        var numbersOk = /^[0-9]*$/.test($("#buyer-phone").val());
        console.log(lengthOk);
        console.log(numbersOk);

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
        ;


    });

});

function validateName() {
    var name = $("#name").val();
    if (name == "") {
        $("#name-error").show();
    } else {
        $("#name-error").hide();
    }
    ;
};

function validateRecName() {
    var name = $("#rec-name").val();
    if (name == "") {
        $("#rec-name-error").show();
    } else {
        $("#rec-name-error").hide();
    }
    ;
};

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

function loadStripe() {
    if (document.getElementById("stripeButton").classList.contains('disabled')) {
        validateName();
        validateNumber($("#phonenumber").val(), $("#phonenumber-error"));
        validateRecName();
        validate();
    } else {
        $('.stripe-button-el').click();
    }
}
