$('#signupAnchor').click((event) => {
    event.preventDefault();
    $('.form-signin').hide();
    $('.form-signup').fadeIn(1000);
});

$('#signinAnchor').click((event) => {
    event.preventDefault();
    $('.form-signup').hide();
    $('.form-signin').fadeIn(1000);
});
