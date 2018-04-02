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

});

function loadURL(url) {
    $('#main-container').load(url, function() {
    });

}

page.start();
