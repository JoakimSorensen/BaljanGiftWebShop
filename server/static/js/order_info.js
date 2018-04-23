 $(document).ready(function() {
        $("#error-text").hide();
        $("#token-result, .vertical-line").hide();
	 	$("#status-container").hide();
    });


    $("#token-form").submit(function(ev){

        ev.preventDefault();
        var token_from_input = $("#token_input").val();
        var url = "api/v1/order_token_formatted_info/" + token_from_input;

        $.getJSON(url, function(data){
            if(data === "error"){
                $("#error-text").show();
                $("#token-result, .vertical-line").hide();
	 			$("#status-container").hide();
            }else{
            	$("#token-result, .vertical-line").slideDown();
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
				setStatusSelect('status-0');
				resetStatusSelect('status-1')
				resetStatusSelect('status-2')
				break;
			case $("#status-1").text():
				setStatusSelect('status-0');
				setStatusSelect('status-1');
				resetStatusSelect('status-2')
				break;
			case $("#status-2").text():
				setStatusSelect('status-0');
				setStatusSelect('status-1');
				setStatusSelect('status-2');
				break;
			case $("#status-3").text():
				$("#status-container").hide();
				$("#status-container-canceled").show();
			default:
				break;
		}
    }

function setStatusSelect(id) {
	document.getElementById(id).style.color = "#000000";
	document.getElementById(id).style.opacity = "1";
	document.getElementById(id + "-circle").style.backgroundColor = "#73906A";
	document.getElementById(id + "-circle").style.opacity = "1";
}

function resetStatusSelect(id) {
	document.getElementById(id).style.color = "";
	document.getElementById(id).style.opacity = "";
	document.getElementById(id + "-circle").style.backgroundColor = "";
	document.getElementById(id + "-circle").style.opacity = "";
}
