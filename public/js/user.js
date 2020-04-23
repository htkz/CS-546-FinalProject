const userInfo = JSON.parse(Cookies.get('user'));
const userId = userInfo['_id'];

// util
const showSwal = async (icon, title) => {
    await Swal.fire({
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 1500,
    });
};

// navbar
const logout = async (event) => {
    event.preventDefault();
    await $.ajax({
        url: `http://localhost:3000/users/logout`,
    });
    window.location.replace('http://localhost:3000/entry');
};

const renderUsername = () => {
    const userName = userInfo['userName'];
    if (userName !== undefined) {
        $('#username').text(userName);
    }
};

// psersonal info
const infoPreload = async () => {
    const userData = await $.ajax({
        url: `http://localhost:3000/users/account/${userId}`,
    });

    const userName = userData.userName;
    const phoneNumber = userData.phoneNumber;
    const address = userData.address;
    const zipCode = userData.zipCode;

    $('#form-username').val(userName);
    if (phoneNumber) $('#form-phonenumber').val(phoneNumber);
    if (address) $('#form-address').val(address);
    if (zipCode) $('#form-zipcode').val(zipCode);
};

const infoSubmit = async (event) => {
    event.preventDefault();
    const userData = await $.ajax({
        url: `http://localhost:3000/users/account/${userId}`,
    });

    const userName = userData.userName;
    const phoneNumber = userData.phoneNumber;
    const address = userData.address;
    const zipCode = userData.zipCode;

    let newInfo = {
        newUserName: userName,
        newPhoneNumber: phoneNumber,
        newAddress: address,
        newZipCode: zipCode,
    };

    const inputName = $('#form-username').val();
    const inputNumber = $('#form-phonenumber').val();
    const inputAddress = $('#form-address').val();
    const inputZip = $('#form-zipcode').val();

    //if(inputName !== userName) checkUsername(userName,inputName);
    if (inputNumber !== phoneNumber) {
        if (inputNumber) {
            if (!checkPhoneNumber(inputNumber)) {
                showSwal('error', 'Opps! Something went wrong!');
                $('#phoneNumberRule').removeClass('hidden').addClass('formatRules');
            }
        }
        newInfo.newPhoneNumber = inputNumber;
    }
};

const checkUsername = async (userName, inputName) => {
    const re = /^[0-9a-zA-Z]*$/;
    if (!re.test(userName)) return false;
    if (userName.length > 16 || userName.length < 3) return false;
    return true;
};

const checkZipCode = (inputZip) => {
    const re = /^\d{5}$/;
    if (!re.test(inputZip)) return false;
    return true;
};

const checkPhoneNumber = (inputNumber) => {
    const re = /^\d{10}$/;
    if (!re.test(inputNumber)) return false;
    return true;
};

// password
const changePassword = async (event) => {
    event.preventDefault();

    const oldPassword = $('#old-password').val();
    const newPassword = $('#new-password').val();
    const reEnterPassword = $('#re-enter-password').val();

    if (!checkPassword(newPassword)) {
        await showSwal(
            'error',
            'Opps! Password must 8-16 characters. Only should contain lower case word, upper case word or number!'
        );
        return;
    }

    if (compareTwoPassword(oldPassword, newPassword)) {
        await showSwal(
            'error',
            'Opps! New password and old password are the same!'
        );
        return;
    }

    if (!compareTwoPassword(newPassword, reEnterPassword)) {
        await showSwal('error', 'Opps! Two new password must be the same!');
        return;
    }
    try {
        await $.ajax({
            url: `http://localhost:3000/users/account/password/${userId}`,
            type: 'PUT',
            data: {
                oldPassword: $.trim(oldPassword),
                newPassword: $.trim(newPassword),
            },
        });
        await showSwal('success', 'Change password successfully');
        $('#old-password').val('');
        $('#new-password').val('');
        $('#re-enter-password').val('');
        checkPasswordEmpty();
    } catch (error) {
        await showSwal('error', 'Old password not correct!');
        console.log(error);
    }
};

const compareTwoPassword = (password1, password2) => {
    if (password1 === password2) {
        return true;
    }
    return false;
};

const checkPassword = (password) => {
    const re = /^[0-9a-zA-Z]*$/;
    if (!re.test(password)) {
        console.log(1);
        return false;
    }
    console.log(password.length);
    if (password.length > 16 || password.length < 8) {
        console.log(2);
        return false;
    }
    return true;
};

const checkPasswordEmpty = () => {
    const oldPassword = $('#old-password').val();
    const newPassword = $('#new-password').val();
    const reEnterPassword = $('#re-enter-password').val();
    if (
        oldPassword.length !== 0 &&
        newPassword.length !== 0 &&
        reEnterPassword.length !== 0
    ) {
        $('#changePasswordBtn').prop('disabled', false);
    } else {
        $('#changePasswordBtn').prop('disabled', true);
    }
};

// ticket info
const changeFocus = (id) => {
    $('.navbar li').each((index, li) => {
        const $li = $(li);
        if ($li.attr('id') === id) {
            $li.attr('class', 'active');
            $($li.attr('data-id')).fadeIn(1000);
        } else {
            $li.attr('class', '');
            $($li.attr('data-id')).hide();
        }
    });
};

const renderTickets = async () => {
    const tickets = await $.ajax({
        url: `http://localhost:3000/users/tickets/${userId}`,
    });
    $('#tickets').empty();
    for (ticket of tickets) {
        const $ticket = `
            <div class="ticket">
                <div class="imgContainer">
                    <img src="./pic/${ticket.images[0]}" alt="${ticket.images[0]}">
                </div>
                <div class="ticketInfo">
                    <h4>${ticket.name}</h4>
                    <p>${ticket.description}</p>
                    <p>Effect Date: ${ticket.effectDate}</p>
                    <p>Price: ${ticket.price}</p>
                </div>
            </div>
        `;
        $('#tickets').append($ticket);
    }
};

const bindEvents = async () => {
    $('#logoutBtn').click(logout);
    $('.navbar li').each((index, li) => {
        const $li = $(li);
        $li.click(() => {
            changeFocus($li.attr('id'));
        });
    });
    $('#old-password').bind('input propertychange', checkPasswordEmpty);
    $('#new-password').bind('input propertychange', checkPasswordEmpty);
    $('#re-enter-password').bind('input propertychange', checkPasswordEmpty);
    $('#personalInfo').submit(infoSubmit);
    $('#changePasswordBtn').click(changePassword);
};

const init = async () => {
    infoPreload();
    renderTickets();
    renderUsername();
    bindEvents();
};

init();
