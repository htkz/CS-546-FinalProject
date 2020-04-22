const userInfo = JSON.parse(Cookies.get('user'));
const userId = userInfo['_id'];

$('#personalInfo').submit(async (event) => {
    event.preventDefault();
    const userData = await $.ajax({
        url: `http://localhost:3000/users/account/${userId}`,
    });

    const userName = userData.userName;
    const phoneNumber = userData.phoneNumber;
    const address = userData.address;
    const zipCode = userData.zipCode;

    console.log(userName);
    $('#form-username').val(userName);
    console.log(userData);
});
