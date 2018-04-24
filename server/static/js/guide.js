$(document).ready(function () {
    $(".explanation-wrapper").css({'visibility': 'hidden'});
    $(".guide-img").on("click", function () {
        var id = this.id;
        if (!$("#" + id + "-guide").hasClass("active-text")) {
            $("#" + id + "-guide").css({'visibility': 'visible'});
            $("#" + id + "-guide").addClass("active-text");

        } else {
            $("#" + id + "-guide").css({'visibility': 'hidden'});
            $("#" + id + "-guide").removeClass("active-text");
        }
    });


});


$('.get-started').on('click', function(event) {
    $.getScript('/base.js', function () {
        handleNavbarClick(event);
    });
});

