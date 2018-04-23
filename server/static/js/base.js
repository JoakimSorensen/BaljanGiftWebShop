// All requests from the browser will hit this code first. Then the request will match one of the defined routes below,
// depending on the requested path. The function for each defined route is responsible for initiating the page that
// should be served.
//
// We are using normal <a>-links on the site for the paths defined below, and the `page`-package will automagically
// intercept the click-event and execute the code in the corresponding route.

page('/', function () {
    var url = "/html/index";
    loadURL(url);
});

page('/baljan', function () {
    var url = "/admin-welcome";
    loadURL(url);
});

page('/products', function () {
    var url = "/html/products";
    loadURL(url);

});

page.exit('/products', function (ctx, next) {
    $('#myModal').modal('hide');
    $('.modal-backdrop').remove();
    next();
});

page('/guide', function () {
    var url = "/html/guide";
    loadURL(url);
});

page('/about', function () {
    var url = "/html/about";
    loadURL(url);
});

page('/faq', function () {
    var url = "/html/faq";
    loadURL(url);
});

page('/contact', function () {
    var url = "/html/contact";
    loadURL(url);
});

page('/order_info', function () {
    var url = "/html/order_info";
    loadURL(url);
});

page('/order', function (context) {
    var url = "/html/order" + "?" + context.querystring;
    loadURL(url);
});

page('/baljan/users', function () {
    var url = "/admin-users";
    loadURL(url);
});

page('/baljan/orders', function () {
    var url = "/admin-orders";
    loadURL(url);
});

page('/baljan/giftboxs', function () {
    var url = "/admin-giftboxs";
    loadURL(url);
});

page('/baljan/products', function () {
    var url = "/admin-products";
    loadURL(url);
});

page('/baljan/buyers', function () {
    var url = "/admin-buyers";
    loadURL(url);
});

page('/baljan/receivers', function () {
    var url = "/admin-receivers";
    loadURL(url);
});

page('/logout', function () {
    var url = "/api/v1/logout";
    loadURL(url);
});

function loadURL(url) {
    $('#main-container').load(url, function () {
    });

}

$.delete = function (url, data, callback, type) {

    if ($.isFunction(data)) {
        type = type || callback,
            callback = data,
            data = {}
    }

    return $.ajax({
        url: url,
        type: 'DELETE',
        success: callback,
        data: data,
        contentType: type
    });
};

page.start();

$(document).ready(function () {
    $('.clickable').on('click', handleNavbarClick) ;

    	});

function handleNavbarClick(event){
    	if (event.target.id === 'logotype') {
    		$('.clickable').removeClass('active');
		} else {
    		$('.clickable').removeClass('active');
    		var path = event.target.pathname;
        var target = $('.clickable[href="' + path + '"]');
        target.addClass('active');
        }
}

$(window).on('load', reloadNavbar);

function reloadNavbar() {
	if (window.location.pathname === '/') {
	    $('.clickable').removeClass('active');
	} else {
	    $('.clickable').removeClass('active');
	    var path = window.location.pathname;
	    var target = $('.clickable[href="'+ path +'"]');
	    target.addClass('active');
    }
}
$('.clickable-footer').on('click', function(event){
    handleNavbarClick(event);
});

$('.no-underline').on('click', function() {
    $('.clickable').removeClass('active');
});

$('.nav-button').on('click', function(){
    window.scrollBy(0,-1000);
});