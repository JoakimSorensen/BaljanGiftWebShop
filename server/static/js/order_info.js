 $(document).ready(function() {
        $("#error-text").hide();
        $("#token-result").hide();
    });


    $("#token-form").submit(function(ev){

        ev.preventDefault();
        var token_from_input = $("#token_input").val();
        var url = "api/v1/order_token/" + token_from_input;

        $.getJSON(url, function(data){
            if(data === "error"){
                $("#error-text").show();
                $("#token-result").hide();
            }else{
            $("#token-result").show();
            $("#error-text").hide();

            retrieveData(data);

            }
        });
    });

    function retrieveData(data){
            var gift_data;
            var receiver_data;
            var msg_val;
            var price_val;
            var status_val;

         $.each(data, function( key, val ) {
            if(key==="giftbox_id"){
                var giftbox_val = val;
                var url = "api/v1/giftbox/" + giftbox_val;
                $.getJSON(url, function (data) {
                gift_data = data;
                });


            }else if(key==="receiver_id"){
                var receiver_val = val;
                var url = "api/v1/receiver/" + receiver_val;
                $.getJSON(url, function (data) {
                receiver_data = data;
                });


            }else if(key==="date"){
                var date_val = val;
            }else if(key==="message"){
                 msg_val = val;

            }else if(key==="price"){
                 price_val = val;

            }else if(key==="status"){
                 status_val = val;

            }
            setTimeout(function () {

                if(gift_data !== undefined && receiver_data !== undefined ){
                document.getElementById("name_info").innerText = gift_data.name;
                document.getElementById("receiver_name").innerText = receiver_data.name;
                document.getElementById("receiver_phone").innerText = receiver_data.phone;
                document.getElementById("msg_id").innerText = msg_val;
                document.getElementById("status_id").innerText = status_val;
                document.getElementById("price_id").innerText = price_val;
                }


            },100)


            });
    }