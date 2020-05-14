$('#signupAnchor').click((event) => {
    event.preventDefault();
    $('.form-signin').hide();
    $('.form-signup').css('display', 'flex');
});

$('#signinAnchor').click((event) => {
    event.preventDefault();
    $('.form-signup').hide();
    $('.form-signin').show();
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
        window.location.replace('/main');
        // if (username === 'admin@group13.com') {
        //     console.log(username);
        //     window.location.replace('/admin');
        // } else {
        //     console.log(username);
        //     window.location.replace('/main');
        // }
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Either password or username is not correct!',
            showConfirmButton: false,
            timer: 1500,
        });
    }
});
