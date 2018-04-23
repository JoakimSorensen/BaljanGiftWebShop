$(document).ready(function(){
    $('.answer-wrapper').hide();
    $('.minus').hide();

    $('.plus').on('click', function() {
        var num = this.id.split('-').pop();
        $('#plus-' + num).hide();
        $('#minus-' + num).show();
        $('#answer-' + num).slideDown();
    });

    $('.minus').on('click', function(){
        var num = this.id.split('-').pop();
        $('#minus-' + num).hide();
        $('#plus-' + num).show();
        $('#answer-' + num).slideUp();
    });

});
