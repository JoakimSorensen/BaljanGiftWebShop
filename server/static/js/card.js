$(document).ready(function() {
    $("#name-error").hide();
    $("#rec-name-error").hide();
    $("#phonenumber-error").hide();

    $("#name").on("focusout", validateName);
    $("#rec-name").on("focusout", validateRecName);
    $("#phonenumber").on("focusout", validateNumber);

    // console.log(document.getElementsByClassName("stripe-button-el")[0]);
    //$(".stripe-button-el")[0].disabled = true;
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

function validateNumber() {
    var number = $("#phonenumber").val();
    if ((/^[0-9]*$/.test(number)) && (number.length == 10)) {
        $("#phonenumber-error").hide();
    } else {
        $("#phonenumber-error").show();
    }

}