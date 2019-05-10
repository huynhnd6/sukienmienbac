
$('.navbar-toggler').click(function () {
    var nav = $(this).attr('data-target');
    $(nav).toggleClass('show');
    return false;
});