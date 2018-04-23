
$('[data-toggle="tooltip"]').tooltip();

function swishData() {
    console.log("Performing swish payment");
    var name = $("#name").val();
    var rec_name = $("#rec-name").val();
    var number = $("#phonenumber").val();
    var email = $("#email").val();
    var message = $("#message").val();
    var giftbox = $("#giftbox").val();

    var data = {
        "rec-name": rec_name,
        "phonenumber": number,
        "message": message,
        "email": email,
        "name": name,
        "giftbox": giftbox
    };

    $.get("/api/v1/swish_payment_completed/", data, function(res) {
        var token = res["token"];
        window.location.href = "/order?token=" + token;
    });

}

$(document).ready(function() {
    $("#name-error").hide();
    $("#rec-name-error").hide();
    $("#phonenumber-error").hide();
    $("#email-error").hide();
    $("#swishNumber-error").hide();


    $("#hider").hide();
    $("#swish").hide();


    $("#swishButton").on("click", function () {
        /*swishData();*/
        if ( document.getElementById("swishButton").classList.contains('disabled')) {
            validateName();
            validateNumber($("#phonenumber").val(),$("#phonenumber-error"));
            validateRecName();
            validate();
        }else{
            $("#hider").fadeIn("slow");
            $("#swish").fadeIn("slow");
            $("#loaderMain").hide();
            $("#swishPayement").hide();
            $("#swishPhone-form").show();

        }

    });

    $("#closeSwish").on("click", function () {
        $("#swish").fadeOut("slow");
        $("#hider").fadeOut("slow");
    });


    $("#submit-input").on("submit", function () {
        console.log($("#buyerPhone").val());
    });

    $("#swishPhone-form").submit(function(ev){

        ev.preventDefault();

        var lengthOk = $("#buyerPhone").val().length == 10;
        var numbersOk = /^[0-9]*$/.test($("#buyerPhone").val());

        validateNumber($("#buyerPhone").val(), $("#swishNumber-error"));

        if (lengthOk && numbersOk){
        $("#swishPhone-form").hide();
        $("#loaderMain").show();
            setTimeout(function () {
            $("#loaderMain").hide();
            $("#swishPayement").show();
            swishData();

            setTimeout(function () {
                $("#swish").hide();
                $("#hider").hide();

            },1500);

        },5000);

        }else{
            console.log("failure");
        };



    });

});

function validateName() {
    var name = $("#name").val();
    if (name == "") {
        $("#name-error").show();
    }else{
        $("#name-error").hide();
    };
};

function validateRecName() {
    var name = $("#rec-name").val();
    if (name == "") {
        $("#rec-name-error").show();
    }else{
        $("#rec-name-error").hide();
    };
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
        if ($('#email').val().length != 0 && $('#name').val().length != 0 && (/^[0-9]*$/.test($("#phonenumber").val())) && ($("#phonenumber").val().length == 10) && $('#rec-name').val().length != 0 && validate() )
            $('.button1').removeClass('disabled');
        else
            $('.button1').addClass('disabled');
    });
});

function loadStripe() {
    if ( document.getElementById("stripeButton").classList.contains('disabled')) {
        validateName();
        validateNumber($("#phonenumber").val(), $("#phonenumber-error"));
        validateRecName();
        validate();
    } else {
        console.log($("#email").val());
        console.log("clicks on stripe button");
        $('.stripe-button-el').click();
    }}
