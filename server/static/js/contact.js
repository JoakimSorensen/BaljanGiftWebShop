$(document).ready(function() {
    $(".explanation-wrapper").css({'visibility':'hidden'});
    $(".contact-img").on("click", function() {
        var id = this.id;
        if (!$("#" + id + "-info").hasClass("active-text")) {
            $("#" + id + "-info").css({'visibility':'visible'});
            $("#" + id + "-info").addClass("active-text");

        } else {
            $("#" + id + "-info").css({'visibility':'hidden'});
            $("#" + id + "-info").removeClass("active-text");
        };
    });

});

$('.get-started').on('click', function(event) {
    $.getScript('/base.js', function () {
        handleNavbarClick(event);
    });
});

