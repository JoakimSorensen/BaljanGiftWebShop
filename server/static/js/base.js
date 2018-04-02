// All requests from the browser will hit this code first. Then the request will match one of the defined routes below,
// depending on the requested path. The function for each defined route is responsible for initiating the page that
// should be served.
//
// We are using normal <a>-links on the site for the paths defined below, and the `page`-package will automagically
// intercept the click-event and execute the code in the corresponding route.

page('/', function(){
    var url = "/html/index";
    loadURL(url);
    console.log("Index");
});

page('/products', function() {
    var url = "/html/products";
    loadURL(url);
    console.log("Products")

});

page('/guide', function() {
    var url = "/html/guide";
    loadURL(url);
    console.log("Guide")
});

page('/order_info', function() {
    var url = "/html/order_info";
    loadURL(url);
    console.log("Order Info")
});

page('/order', function(context) {
    var url = "/html/order" + "?" + context.querystring;
    loadURL(url);
    console.log("Order")
});

page('/baljan/users', function() {
	var url = "/admin-users";
	loadURL(url);
	console.log("Admin Users")
});

page('/baljan/orders', function() {
	var url = "/admin-orders";
	loadURL(url);
	console.log("Admin Orders")
});

page('/baljan/giftboxs', function() {
	var url = "/admin-giftboxs";
	loadURL(url);
	console.log("Admin Giftboxes")
});

page('/baljan/products', function() {
	var url = "/admin-products";
	loadURL(url);
	console.log("Admin Products")
});

page('/baljan/buyers', function() {
	var url = "/admin-buyers";
	loadURL(url);
	console.log("Admin Buyers")
});

page('/baljan/receivers', function() {
	var url = "/admin-receivers";
	loadURL(url);
	console.log("Admin Receivers")
});

page('/logout', function() {
	var url = "/api/v1/logout";
	loadURL(url);
	console.log("Admin Logout")
});

function loadURL(url) {
    $('#main-container').load(url, function() {
    });

}


page.start();
