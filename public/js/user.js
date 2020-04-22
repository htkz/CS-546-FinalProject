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

const renderPassword = async () => {
    $('#change-password-btn').click(changePassword);
};

const changePassword = async () => {
    const oldPassword = $('#old-password').text();
    const newPassword = $('#new-passowrd').text();
    const reEnterPassword = $('#re-enter-new-password').text();
    console.log(oldPassword);
    console.log(newPassword);
    console.log(reEnterPassword);
};

const init = async () => {
    renderTickets();
    renderPassword();
};

init();
