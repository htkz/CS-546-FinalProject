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

$('#form-signin').submit(async (event) => {
    event.preventDefault();
    const username = $('#signinEmail').val();
    const password = $('#signinPassword').val();
    try {
        await $.ajax({
            url: 'http://localhost:3000/users/account/login',
            type: 'POST',
            data: {
                email: username,
                hashedPassword: password,
            },
        });
        alert('Correct Username and Password!');
    } catch (error) {
        alert(error['responseJSON']['message']);
    }
});
