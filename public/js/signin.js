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
            url: '/users/account/login',
            type: 'POST',
            data: {
                email: username,
                hashedPassword: password,
            },
        });
        if (username === 'admin@group13.com') {
            window.location.replace('/admin.html');
        } else {
            window.location.replace('/main');
        }
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: error['responseJSON']['message'],
            showConfirmButton: false,
            timer: 1000,
            position: 'top',
        });
    }
});
