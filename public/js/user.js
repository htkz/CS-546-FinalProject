let userInfo = JSON.parse(Cookies.get('user'));
let userId = userInfo['_id'];

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
        url: `/users/logout`,
    });
    window.location.replace('/entry');
};

// psersonal info

const uploadAvatar = async (event) => {
    event.preventDefault();
    const avatar = $('#imageUpload')[0].files[0];
    var formData = new FormData();
    formData.append('photo', avatar);
    $.ajax({
        type: 'POST',
        url: '/users/avatar',
        data: formData,
        processData: false,
        contentType: false,
        success: async function (r) {
            const user = await $.ajax(`/users/account/${userId}`);
            $('#avatar').attr('src', `./pic/avatar/${user.avatar}`);
            showSwal('success', 'Aready updated avatar');
        },
        error: function (e) {
            showSwal('error', 'Image upload error!');
        },
    });
};

const infoPreload = async () => {
    const userData = await $.ajax({
        url: `/users/account/${userId}`,
    });

    const userName = userData.userName;
    const email = userData.email;
    const phoneNumber = userData.phoneNumber;
    const address = userData.address;
    const zipCode = userData.zipCode;
    const bio = userData.bio;
    const gender = userData.gender;
    const birthDate = userData.birthDate;
    const avatar = userData.avatar;
    userBarPreload(userName, birthDate, gender);

    $('#form-username').val(userName);
    $('#form-email').val(email);
    if (phoneNumber) $('#form-phonenumber').val(phoneNumber);
    if (address) $('#form-address').val(address);
    if (zipCode) $('#form-zipcode').val(zipCode);
    if (bio) $('#form-bio').val(bio);
    $('#form-gender').val(gender);
    if (birthDate) $('#form-birthdate').val(birthDate);
    if (avatar) {
        $('#avatar').attr('src', `./pic/avatar/${avatar}`);
    } else {
        $('#avatar').attr('src', `./pic/avatar/default.jpg`);
    }
    $('#avatar').attr('hidden', false);
};

const userBarPreload = (userName, birthDate, gender) => {
    $('#username').text(userName);
    $('#userbar-name').text(userName);
    $('#userbar-age_gender').text(birthDatePreload(birthDate) + ' ' + gender);
};

const birthDatePreload = (birthDate) => {
    const min = '1900-01-01';
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    const year = today.getFullYear();
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    const max = year + '-' + month + '-' + day;
    $('#form-birthdate').attr({
        min: min,
        max: max,
    });
    if (!birthDate) return '???';
    const yr = parseInt(birthDate.substring(0, 4));
    const mh = parseInt(birthDate.substring(5, 7)) - 1;
    const dy = parseInt(birthDate.substring(8, 10));
    const age = ageCaculator(new Date(yr, mh, dy));
    return age;
};

const ageCaculator = (birthDate) => {
    const diff = new Date().getTime() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const infoSubmit = async (event) => {
    event.preventDefault();

    if ($('#userNameRule').attr('class') === 'formatRules') {
        $('#userNameRule').removeClass('formatRules').addClass('hidden');
    }
    if ($('#emailRule').attr('class') === 'formatRules') {
        $('#emailRule').removeClass('formatRules').addClass('hidden');
    }
    if ($('#phoneNumberRule').attr('class') === 'formatRules') {
        $('#phoneNumberRule').removeClass('formatRules').addClass('hidden');
    }
    if ($('#zipCodeRule').attr('class') === 'formatRules') {
        $('#zipCodeRule').removeClass('formatRules').addClass('hidden');
    }

    const userData = await $.ajax({
        url: `/users/account/${userId}`,
    });

    const userName = userData.userName;
    const email = userData.email;
    const phoneNumber = userData.phoneNumber;
    const zipCode = userData.zipCode;

    const inputName = $('#form-username').val();
    const inputEmail = $('#form-email').val();
    const inputNumber = $('#form-phonenumber').val();
    const inputAddress = $('#form-address').val();
    const inputZip = $('#form-zipcode').val();
    const bio = $('#form-bio').val();
    const gender = $('#form-gender').val();
    const birthDate = $('#form-birthdate').val();

    let newInfo = {
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        address: inputAddress,
        zipCode: zipCode,
        bio: bio,
        gender: gender,
        birthDate: birthDate,
    };

    let inputCheck = true;

    if (inputName.toLowerCase() !== userName.toLowerCase()) {
        if (!(await checkUsername(inputName))) {
            $('#userNameRule').removeClass('hidden').addClass('formatRules');
            inputCheck = false;
        } else newInfo.userName = inputName;
    } else {
        newInfo.userName = inputName;
    }
    if (inputEmail.toLowerCase() !== email.toLowerCase()) {
        if (!(await checkEmail(inputEmail))) {
            $('#emailRule').removeClass('hidden').addClass('formatRules');
            inputCheck = false;
        } else newInfo.email = inputEmail;
    } else {
        newInfo.email = inputEmail;
    }
    if (inputNumber !== phoneNumber) {
        if (inputNumber) {
            if (!checkPhoneNumber(inputNumber)) {
                $('#phoneNumberRule')
                    .removeClass('hidden')
                    .addClass('formatRules');
                inputCheck = false;
            }
        }
        newInfo.phoneNumber = inputNumber;
    }
    if (inputZip !== zipCode) {
        if (inputZip) {
            if (!checkZipCode(inputZip)) {
                $('#zipCodeRule').removeClass('hidden').addClass('formatRules');
                inputCheck = false;
            }
        }
        newInfo.zipCode = inputZip;
    }

    if (!inputCheck) {
        showSwal('error', 'Opps! Something went wrong!');
        return;
    }

    userBarPreload(newInfo.userName, newInfo.birthDate, newInfo.gender);

    await $.ajax({
        url: `/users/account/update/${userId}`,
        type: 'PUT',
        data: newInfo,
    });

    showSwal('success', 'Update success!');
};

const checkUsername = async (inputName) => {
    const re = /^[0-9a-zA-Z]*$/;
    if (!re.test(inputName)) return false;
    if (inputName.length > 16 || inputName.length < 3) return false;
    const data = await $.ajax({
        url: '/users/account/username',
        type: 'POST',
        data: {
            userName: inputName,
        },
    });
    if (!data) return true;
    return false;
};

const checkEmail = async (inputEmail) => {
    const re = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!re.test(inputEmail)) return false;
    const data = await $.ajax({
        url: '/users/account/email',
        type: 'POST',
        data: {
            email: inputEmail,
        },
    });
    if (!data) return true;
    return false;
};

const checkZipCode = (inputZip) => {
    const re = /^\d{5}$/;
    return re.test(inputZip);
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
            url: `/users/account/password/${userId}`,
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

const renderUserTickets = async () => {
    const tickets = await $.ajax({
        url: `/users/tickets/${userId}`,
    });

    $('#self-tickets').empty();

    if (tickets.length !== 0) {
        title = '<h3 class="tickets-header">User Tickets</h3>';
        $('#self-tickets').append(title);
    }
    for (ticket of tickets) {
        if (ticket.fourfacechusong === 'valid') {
            const $ticket = $(`
                <div class="ticket">
                    <div class="imgContainer">
                        <img src="./pic/places/${ticket.images[0]}" alt="${ticket.images[0]}">
                    </div>
                    <div class="ticketInfo">
                        <h2 class="h4">${ticket.name}</h2>
                        <p>${ticket.description}</p>
                        <p>Effect Date: ${ticket.effectDate}</p>
                        <p>Price: $${ticket.price}</p>
                        <p>Ticket Number: ${ticket.ticketNo}</p>
                    </div>
                </div>
            `);
            const cancelBtn = $(
                `<button class="btn btn-sm btn-outline-info" class="cancelBtn" data-id="${ticket['_id']}">Cancel</button>`
            );
            const rescheduleBtn = $(
                `<button class="btn btn-sm btn-outline-info" class="rescheduleBtn" data-id="${ticket['_id']}" effectDate="${ticket.effectDate}">Reschedule</button>`
            );
            cancelBtn.click((event) => {
                cancelTicket(event, 'user');
            });
            rescheduleBtn.click((event) => {
                $('#rescheduleModal').data(
                    'id',
                    $(event.currentTarget).attr('data-id')
                );
                $('#rescheduleInput').val(
                    $(event.currentTarget).attr('effectDate')
                );
                $('#rescheduleInput').attr(
                    'min',
                    $(event.currentTarget).attr('effectDate')
                );
                const date = $(event.currentTarget)
                    .attr('effectDate')
                    .split('-');
                const year = parseInt(date[0]);
                const month = date[1];
                const day = date[2];
                $('#rescheduleInput').attr(
                    'max',
                    `${year + 1}-${month}-${day}`
                );
                $('#rescheduleModal').modal('show');
            });
            $($ticket.find('.ticketInfo')[0])
                .append(cancelBtn)
                .append(rescheduleBtn);
            $('#self-tickets').append($ticket);
        } else {
            console.log('1');
            const $ticket = $(`
                <div class="ticket">
                    <div class="imgContainer">
                        <img src="./pic/avatar/default.jpg" alt="default">
                    </div>
                    <div class="ticketInfo">
                        <h2 class="h4">${ticket.placeName}</h2>
                        <p>${ticket.description}</p>
                    </div>
                </div>
            `);
            const cancelBtn = $(
                `<button class="btn btn-sm btn-outline-info" class="cancelBtn" data-id="${ticket['_id']}">Delete</button>`
            );
            const rescheduleBtn = $(
                `<button class="btn btn-sm btn-outline-info" disabled class="rescheduleBtn" data-id="${ticket['_id']}" effectDate="${ticket.effectDate}">Reschedule</button>`
            );
            cancelBtn.click((event) => {
                cancelTicket(event, 'user');
            });
            $($ticket.find('.ticketInfo')[0])
                .append(cancelBtn)
                .append(rescheduleBtn);
            $('#self-tickets').append($ticket);
        }
    }
};

const renderFriendTickets = async () => {
    const tickets = await $.ajax({
        url: `/users/tickets/friends/${userId}`,
    });

    $('#friends-tickets').empty();

    console.log(tickets);

    if (tickets.length !== 0) {
        title = '<h3 class="tickets-header">Friend Tickets</h3>';
        $('#friends-tickets').append(title);
    }

    for (ticket of tickets) {
        if (ticket.fourfacechusong === 'valid') {
            const $ticket = $(`
                <div class="ticket">
                    <div class="imgContainer">
                        <img src="./pic/places/${ticket.images[0]}" alt="${ticket.images[0]}">
                    </div>
                    <div class="ticketInfo">
                        <h2 class="h4">${ticket.name}</h2>
                        <p>Friend: ${ticket.userId}</p>
                        <p>Effect Date: ${ticket.effectDate}</p>
                        <p>Price: $${ticket.price}</p>
                        <p>Ticket Number: ${ticket.ticketNo}</p>
                    </div>
                </div>
            `);
            const cancelBtn = $(
                `<button class="btn btn-sm btn-outline-info" class="cancelBtn" data-id="${ticket['_id']}">Cancel</button>`
            );
            const rescheduleBtn = $(
                `<button class="btn btn-sm btn-outline-info" class="rescheduleBtn" data-id="${ticket['_id']}" effectDate="${ticket.effectDate}">Reschedule</button>`
            );
            cancelBtn.click((event) => {
                cancelTicket(event, 'friend');
            });
            rescheduleBtn.click((event) => {
                $('#rescheduleModal').data(
                    'id',
                    $(event.currentTarget).attr('data-id')
                );
                $('#rescheduleInput').val(
                    $(event.currentTarget).attr('effectDate')
                );
                $('#rescheduleInput').attr(
                    'min',
                    $(event.currentTarget).attr('effectDate')
                );
                const date = $(event.currentTarget)
                    .attr('effectDate')
                    .split('-');
                const year = parseInt(date[0]);
                const month = date[1];
                const day = date[2];
                $('#rescheduleInput').attr(
                    'max',
                    `${year + 1}-${month}-${day}`
                );
                $('#rescheduleModal').modal('show');
            });
            $($ticket.find('.ticketInfo')[0])
                .append(cancelBtn)
                .append(rescheduleBtn);
            $('#friends-tickets').append($ticket);
        } else {
            const $ticket = $(`
                <div class="ticket">
                    <div class="imgContainer">
                        <img src="./pic/avatar/default.jpg" alt="default">
                    </div>
                    <div class="ticketInfo">
                        <h2 class="h4">${ticket.placeName}</h2>
                        <p>${ticket.description}</p>
                    </div>
                </div>
            `);
            const cancelBtn = $(
                `<button class="btn btn-sm btn-outline-info" class="cancelBtn" data-id="${ticket['_id']}">Delete</button>`
            );
            const rescheduleBtn = $(
                `<button class="btn btn-sm btn-outline-info" disabled class="rescheduleBtn" data-id="${ticket['_id']}" effectDate="${ticket.effectDate}">Reschedule</button>`
            );
            cancelBtn.click((event) => {
                cancelTicket(event, 'friend');
            });
            $($ticket.find('.ticketInfo')[0])
                .append(cancelBtn)
                .append(rescheduleBtn);
            $('#friends-tickets').append($ticket);
        }
    }
};

const cancelTicket = async (event, operator) => {
    event.preventDefault();
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure to cancel the ticket?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d7eb1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'No',
    });
    if (result.value) {
        const id = $(event.currentTarget).data('id');
        try {
            if (operator === 'user') {
                await $.ajax({
                    url: `/tickets/user/${id}`,
                    type: 'delete',
                });
                await renderUserTickets();
            } else if (operator === 'friend') {
                await $.ajax({
                    url: `/tickets/friend/${id}`,
                    type: 'delete',
                });
                await renderFriendTickets();
            }
            await showSwal('success', 'Already canceled the ticket!');
        } catch (error) {
            await showSwal(
                'error',
                'Sorry, can not cancel the ticket, please try again.'
            );
        }
    }
};

const rescheduleTicket = async (event) => {
    event.preventDefault();

    const date = $('#rescheduleInput').val();
    if (date.length === 0) {
        await Swal.fire({
            icon: 'error',
            title: 'Please select a time first!',
        });
        return;
    }
    const id = $('#rescheduleModal').data('id');

    try {
        await $.ajax({
            url: `/tickets/${id}`,
            type: 'put',
            data: {
                effectDate: date,
            },
        });
        await renderUserTickets();
        await renderFriendTickets();
        $('#rescheduleModal').modal('hide');
        await showSwal('success', 'Already updated date!');
    } catch (error) {
        await showSwal(
            'error',
            'Sorry, can not reschedule the ticket, please try again.'
        );
    }
};

// payment
const checkCardNumber = (number) => {
    const re = /^\d{13,19}$/;
    if (!re.test(number)) {
        return false;
    }
    const value = number.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (var i = value.length - 1; i >= 0; i--) {
        var digit = parseInt(value.charAt(i));

        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 == 0;
};

const checkCVV = (securityCode) => {
    const re = /^\d{3}$/;
    return re.test(securityCode);
};

const checkExpiration = (expiration) => {
    if (expiration.length < 3 || expiration.length > 5) return false;
    let cnt = 0;
    for (ch of expiration) {
        if (ch === '/') {
            cnt += 1;
        }
    }
    if (cnt !== 1) return false;
    const arr = expiration.split('/');
    const month = parseInt(arr[0]);
    const year = parseInt(arr[1]);
    return month >= 1 && month <= 12 && year >= 0 && year <= 99;
};

const checkPayment = () => {
    const firstName = $('#firstName').val().trim();
    const lastName = $('#lastName').val().trim();
    const zipcode = $('#billingZipCode').val();
    const cardNumber = $('#cardNumber').val();
    const expirationDate = $('#month').val() + '/' + $('#year').val();
    const cvv = $('#securityCode').val();
    $('.error-message').hide();
    let valid = true;
    if (firstName.length === 0) {
        $('#firstNameRule').show();
        valid = false;
    }
    if (lastName.length === 0) {
        $('#lastNameRule').show();
        valid = false;
    }
    if (!checkZipCode(zipcode)) {
        $('#zipcodeRule').show();
        valid = false;
    }
    if (!checkCardNumber(cardNumber)) {
        $('#cardNumberRule').show();
        valid = false;
    }
    if (!checkExpiration(expirationDate)) {
        $('#expirationRule').show();
        valid = false;
    }
    if (!checkCVV(cvv)) {
        $('#secureCodeRule').show();
        valid = false;
    }
    return valid;
};

const changePayment = async (event) => {
    event.preventDefault();
    if (!(await checkPayment())) {
        await showSwal('error', 'Please make sure all fields are valid!');
        return;
    }
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const zipcode = $('#billingZipCode').val();
    const cardNumber = $('#cardNumber').val();
    const expirationDate = $('#month').val() + '/' + $('#year').val();
    const cvv = $('#securityCode').val();

    const userId = userInfo['_id'];
    const user = await $.ajax(`/users/account/${userId}`);
    const method = user.bankCard.length > 0 ? 'put' : 'post';
    const bankId = user.bankCard || '';
    try {
        await $.ajax({
            url: `/banks/${bankId}`,
            type: method,
            data: {
                user: userId,
                firstName: firstName,
                lastName: lastName,
                billingZipCode: zipcode,
                cardNumber: cardNumber,
                expirationDate: expirationDate,
                securityCode: cvv,
            },
        });
        await showSwal('success', 'Saved your payment infomation!');
    } catch (error) {
        await showSwal('error', error.error);
    }
};

const renderPayment = async (event) => {
    $('.error-message').hide();
    const userId = userInfo['_id'];
    const user = await $.ajax(`/users/account/${userId}`);
    if (user.bankCard.length === 0) {
        return;
    }
    const bank = await $.ajax(`/banks/${user.bankCard}`);
    $('#firstName').val(bank.firstName);
    $('#lastName').val(bank.lastName);
    $('#billingZipCode').val(bank.billingZipCode);
    $('#cardNumber').val(bank.cardNumber);
    const expidate = bank.expirationDate.split('/');
    const month = expidate[0];
    const year = expidate[1];
    $('#month').val(month);
    $('#year').val(year);
    $('#securityCode').val(bank.securityCode);
};

//friends
let friendsData = {};

const checkNewFriendInput = async () => {
    const name = $('#friendNameInput').val().trim();
    const email = $('#friendEmailInput').val().trim();
    const phone = $('#friendPhoneInput').val().trim();
    const reEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!reEmail.test(email)) {
        await showSwal('error', 'The email format is not valid!');
        return false;
    }
    if (name.length === 0) {
        await showSwal('error', 'The name should not be empty!');
        return false;
    }
    if (!checkPhoneNumber(phone)) {
        await showSwal('error', 'The phone number format is not valid!');
        return false;
    }
    return true;
};

const checkFriendInput = async () => {
    const name = $('#friendName').val().trim();
    const email = $('#friendEmail').val().trim();
    const phone = $('#friendPhone').val().trim();
    const reEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!reEmail.test(email)) {
        await showSwal('error', 'The email format is not valid!');
        return false;
    }
    if (name.length === 0) {
        await showSwal('error', 'The name should not be empty!');
        return false;
    }
    if (!checkPhoneNumber(phone)) {
        await showSwal('error', 'The phone number format is not valid!');
        return false;
    }
    return true;
};

const fetchFriends = async () => {
    friendsData = await $.ajax({
        url: `/users/friends/${userId}`,
    });
    console.log(friendsData);
};

const getFriendById = (friendId) => {
    for (friend of friendsData) {
        if (friend['_id'] === friendId) {
            return friend;
        }
    }
};

const renderFriends = async () => {
    await fetchFriends();
    $('#friendsList').empty();
    friendsData.forEach((friend, index) => {
        const $friend = $(
            `<span class="friendBtn" data-id="${friend['_id']}">${friend.name}</span>`
        );
        $('#friendsList').append($friend);
        $friend.click((event) => {
            const $cur = $(event.currentTarget);
            $('#friendsList').find('span').removeClass('active');
            $cur.addClass('active');
            const friend = getFriendById($cur.attr('data-id'));
            $('#friendName').val(friend.name.trim());
            $('#friendEmail').val(friend.email.trim());
            $('#friendPhone').val(friend.phoneNumber.trim());
        });
        if (index === 0) {
            $friend.addClass('active');
            $friend.click();
        }
    });
    const addFriendBtn = $(
        '<img class="addFriendIcon" id="addFriendIcon" src="pic/add.svg" alt="add-icon" width="32" height="32"/>'
    );
    addFriendBtn.click((event) => {
        event.preventDefault();
        $('#newFriendModal').modal('show');
    });
    $('#friendsList').append(addFriendBtn);
};

const addFriend = async () => {
    if (!(await checkNewFriendInput())) return;
    const name = $('#friendNameInput').val();
    const email = $('#friendEmailInput').val();
    const phone = $('#friendPhoneInput').val();
    try {
        await $.ajax({
            url: '/friends',
            type: 'post',
            data: {
                userId: userId,
                name: name,
                email: email,
                phoneNumber: phone,
            },
        });
        await renderFriends();
        $('#newFriendModal').modal('hide');
        await showSwal('success', 'Already add your friend');
    } catch (error) {
        showSwal('error', error);
    }
};

const saveFriend = async (event) => {
    event.preventDefault();
    const curFriend = $('#friendsList').find('span.active');
    if (curFriend.length === 0) {
        await showSwal('error', 'Please select a friend first!');
        return;
    }
    if (!(await checkFriendInput())) return;
    const friendId = $(curFriend[0]).attr('data-id');
    const name = $('#friendName').val().trim();
    const email = $('#friendEmail').val().trim();
    const phoneNumber = $('#friendPhone').val().trim();
    try {
        await $.ajax({
            url: `/friends/${friendId}`,
            type: 'put',
            data: {
                name: name,
                email: email,
                phoneNumber: phoneNumber,
            },
        });
        await renderFriends();
        await renderFriendTickets();
        $('#newFriendModal').modal('hide');
        await showSwal('success', 'Already saved!');
    } catch (error) {
        showSwal('error', error);
    }
};

//main
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
    // personalinfo submit
    $('#personalInfo').submit(infoSubmit);
    $('.changeAvatarBtn').click(() => {
        $('#imageUpload').click();
    });
    $('#imageUpload').on('change', () => {
        $('#imageUploadForm').submit();
    });
    $('#imageUploadForm').submit(uploadAvatar);
    // password submit
    $('#changePasswordBtn').click(changePassword);
    // payment submit
    $('#changePaymentBtn').click(changePayment);
    // friend
    $('#newFriendConfirmBtn').click(addFriend);
    $('#saveFriendBtn').click(saveFriend);
    // ticket info
    $('#rescheduleForm').submit(rescheduleTicket);
};

const init = async () => {
    infoPreload();
    renderUserTickets();
    renderFriendTickets();
    renderPayment();
    renderFriends();
    bindEvents();
};

init();
