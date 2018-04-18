 $(document).ready(function() {
        $("#error-text").hide();
        $("#token-result").hide();
	 	$("#status-container").hide();
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

		$("#status-container").show();
		switch(data["status"]) {
			case $("#status-0").text():
				$.setStatusSelect('status-0');
				break;
			case $("#status-1").text():
				$.setStatusSelect('status-1');
				break;
			case $("#status-2").text():
				$.setStatusSelect('status-2');
				break;
			case $("#status-3").text():
				$("#status-container").hide();
				$("#status-container-canceled").show();
			default:
				break;
		}
    }

$.setStatusSelect = function(id) {
	document.getElementById(id).style.color = "green";
	document.getElementById(id + "-circle").style.backgroundColor = "green";
}
