const userInfo = JSON.parse(Cookies.get('user'));
const userId = userInfo['_id'];
console.log(userInfo);

let oldPassword = null;
let newPassword = null;
let reEnterPassword = null;

const infoPage = async() => {
    const userData = await $.ajax({
        url: `http://localhost:3000/users/account/${userId}`,
    });
    
    const userName = userData.userName;
    const phoneNumber = userData.phoneNumber;
    const address = userData.address;
    const zipCode = userData.zipCode;
    
    $('#form-username').val(userName);
    if(phoneNumber) $('#form-phonenumber').val(phoneNumber);
    if(address) $('#form-address').val(address);
    if(zipCode) $('#form-zipcode').val(zipCode);
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

const changePassword = async (event) => {
    event.preventDefault();

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

const showSwal = async (icon, title) => {
    await Swal.fire({
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 1500,
    });
};

const checkPasswordEmpty = () => {
    oldPassword = $('#old-password').val();
    newPassword = $('#new-password').val();
    reEnterPassword = $('#re-enter-password').val();
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

const logout = async (event) => {
    event.preventDefault();
    await $.ajax({
        url: `http://localhost:3000/users/logout`,
    });
    window.location.replace('http://localhost:3000/entry');
};

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

const renderUser = () => {
    $('#change-password-username').text(userInfo['userName']);
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
    $('#changePasswordBtn').click(changePassword);
};

const init = async () => {
    infoPage();
    renderTickets();
    bindEvents();
    renderUser();
};

init();
