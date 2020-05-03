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
        if (username === 'admin@group13.com') {
            console.log(username);
            window.location.replace('http://localhost:3000/admin');
        } else {
            console.log(username);
            window.location.replace('http://localhost:3000/main');
        }
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Either password or username is not correct!',
            showConfirmButton: false,
            timer: 1000,
            position: 'top',
        });
    }
});
