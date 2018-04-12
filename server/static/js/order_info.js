 $(document).ready(function() {
        $("#error-text").hide();
        $("#token-result").hide();
    });


    $("#token-form").submit(function(ev){

        ev.preventDefault();
        var token_from_input = $("#token_input").val();
        var url = "api/v1/order_token_formatted_info/" + token_from_input;

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
    	document.getElementById("name_info").innerText = data["giftbox_name"];
		document.getElementById("receiver_name").innerText = data["receiver_name"];
        document.getElementById("receiver_phone").innerText = data["receiver_phone"];
       	document.getElementById("msg_id").innerText = data["message"];
        document.getElementById("status_id").innerText = data["status"];
        document.getElementById("price_id").innerText = data["price"];
    }
