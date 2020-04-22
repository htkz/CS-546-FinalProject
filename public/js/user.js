const userInfo = JSON.parse(Cookies.get('user'));
const userId = userInfo['_id'];
console.log(userInfo);

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
    const oldPassword = $('#old-password').text();
    const newPassword = $('#new-password').text();
    const reEnterPassword = $('#re-enter-new-password').text();

    await $.ajax({
        url: `http://localhost:3000/users/${userId}`,
        type: 'PATCH',
        data: {
            newHashedPassword: $.trim(newPassword),
        },
    });
};

let oldPassowordFlag = false;
let newPasswordFlag = false;
let reEnterPasswordFlag = false;

const oldPasswordInputEvent = async () => {
    $('#old-password').bind('input propertychange', function (event) {
        const oldPassword = $('#old-password').val();
        if (oldPassword.length !== 0) {
            oldPassowordFlag = true;
            buttonDisable();
            oldPasswordInputEvent();
        } else {
            oldPassowordFlag = false;
            buttonDisable();
            oldPasswordInputEvent();
        }
    });
};

const newPasswordInputEvent = async () => {
    $('#new-password').bind('input propertychange', function (event) {
        const newPassword = $('#new-password').val();
        if (newPassword.length !== 0) {
            newPasswordFlag = true;
            buttonDisable();
            newPasswordInputEvent();
        } else {
            newPasswordFlag = false;
            buttonDisable();
            newPasswordInputEvent();
        }
    });
};

const rePasswordInputEvent = async () => {
    $('#re-enter-new-password').bind('input propertychange', function (event) {
        const reEnterPassword = $('#re-enter-new-password').val();
        if (reEnterPassword.length !== 0) {
            reEnterPasswordFlag = true;
            buttonDisable();
            rePasswordInputEvent();
        } else {
            reEnterPasswordFlag = false;
            buttonDisable();
            rePasswordInputEvent();
        }
    });
};

const logout = async (event) => {
    event.preventDefault();
    await $.ajax({
        url: `http://localhost:3000/users/logout`,
    });
    window.location.replace('http://localhost:3000/entry');
};

const buttonDisable = async () => {
    // console.log('old ' + oldPassowordFlag);
    // console.log('new ' + newPasswordFlag);
    // console.log('re  ' + reEnterPasswordFlag);
    if (
        oldPassowordFlag === true &&
        newPasswordFlag === true &&
        reEnterPasswordFlag === true
    ) {
        $('#changePasswordBtn').prop('disabled', false);
        $('#changePasswordBtn').click(changePassword);
    } else {
        $('#changePasswordBtn').prop('disabled', true);
    }
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

const bindEvents = async () => {
    $('#logoutBtn').click(logout);
    oldPasswordInputEvent();
    newPasswordInputEvent();
    rePasswordInputEvent();
    $('.navbar li').each((index, li) => {
        const $li = $(li);
        $li.click(() => {
            changeFocus($li.attr('id'));
        });
    });
};

const init = async () => {
    renderTickets();
    bindEvents();
};

init();
