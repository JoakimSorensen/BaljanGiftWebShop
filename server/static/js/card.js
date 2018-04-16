
$('[data-toggle="tooltip"]').tooltip();

$(document).ready(function() {
    $("#name-error").hide();
    $("#rec-name-error").hide();
    $("#phonenumber-error").hide();
    $("#hider").hide();
    $("#swish").hide();


    $("#name").on("focusout", validateName);
    $("#rec-name").on("focusout", validateRecName);
    $("#phonenumber").on("focusout", validateNumber);

    // console.log(document.getElementsByClassName("stripe-button-el")[0]);
    //$(".stripe-button-el")[0].disabled = true;

    $("#swishButton").on("click", function () {
        /*swishData();*/
        $("#hider").fadeIn("slow");
        $("#swish").fadeIn("slow");
        $("#loaderMain").hide();
        $("#swishPayement").hide();

        $("#swishPhone-form").show();

    });

     $("#closeSwish").on("click", function () {
        /*swishData();*/
        $("#hider").fadeOut("slow");
        $("#swish").fadeOut("slow");
    });

      $("#swishPhone-form").submit(function(ev){

        ev.preventDefault();
        $("#swishPayement").hide();

        var buyer_phone = $("#buyerPhone").val();
        $("#swishPhone-form").hide();
        $("#loaderMain").show();

        setTimeout(function () {
            $("#loaderMain").hide();
            $("#swishPayement").show();

            setTimeout(function () {
                $("#swish").hide();
                $("#hider").hide();

            },1500);

        },5000);

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

function swishData() {
    $("#swishModal").showModal();

    var name = $("#name").val();
    var rec_name = $("#rec-name").val();
    var number = $("#phonenumber").val();
    var email = $("#email").val();
    var message = $("#message").val();
    var giftbox = $("#giftbox").val();

    var data = {
        receiver_name: rec_name,
        receiver_phone: number,
        message: message,
        buyer_email: email,
        buyer_name: name,
        giftbox_in: giftbox
    };

    $.post("/api/v1/payment_completed", data, function (res) {
            console.log('res', res);
        });

};

function validateRecName() {
  var name = $("#rec-name").val();
  if (name == "") {
    $("#rec-name-error").show();
  }else{
    $("#rec-name-error").hide();
  };
};

function validateNumber() {
    var number = $("#phonenumber").val();
    if ((/^[0-9]*$/.test(number)) && (number.length == 10)) {
        $("#phonenumber-error").hide();
    } else {
        $("#phonenumber-error").show();
    }
}



