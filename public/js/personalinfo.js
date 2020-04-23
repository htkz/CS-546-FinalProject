const preLoad = async() => {
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

function checkUserName(userName) {
    const re = /^[0-9a-zA-Z]*$/;
    if (!re.test(userName)) {
        return false;
    }
    if (userName.length > 16 || userName.length < 3) {
        return false;
    }
    return true;
};

function checkZipCode(zipCode) {
    const re = /^\d{5}$/;
    if (!re.test(zipCode)) {
        return false;
    }
    return true;
};

$('#personalInfo').submit(async (event) => {
    event.preventDefault();
});

const main = ()=>{
    
}

main();