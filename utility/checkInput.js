/*
userName: 3-16 characters, only contains lower case word, upper case word & number
email: basic email format
password:
    8-16 characters
    Should only contains lower case word, upper case word & number
*/
let exportedMethods = {
    checkUserName(userName) {
        const re = /^[0-9a-zA-Z]*$/;
        if (!re.test(userName)) {
            return false;
        }
        if (userName.length > 16 || userName.length < 3) {
            return false;
        }
        return true;
    },

    checkEmail(email) {
        const re = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!re.test(email)) {
            return false;
        }
        return true;
    },

    checkPassword(password) {
        const re = /^[0-9a-zA-Z]*$/;
        if (!re.test(password)) {
            return false;
        }
        if (password.length > 16 || password.length < 8) {
            return false;
        }
        return true;
    },

    checkZipCode(zipCode) {
        const re = /^\d{5}$/;
        if (!re.test(zipCode)) {
            return false;
        }
        return true;
    },

    checkPhoneNumber(phoneNumber) {
        const re = /^\d{10}$/;
        if (!re.test(phoneNumber)) {
            return false;
        }
        return true;
    },

    checkDate(date) {
        const re = /\d{4}-\d{1,2}-\d{1,2}/;
        return re.test(date);
    },

    checkPrice(price) {
        const re = /^\d+$/;
        return re.test(price);
    },

    checkBirthDate(date) {
        const re = /\d{4}-\d{2}-\d{2}/;
        if (!re.test(date)) return false;
        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(5, 7));
        const day = parseInt(date.substring(8, 10));
        const nowYear = new Date().getFullYear();
        if (
            year < 1900 ||
            year > nowYear ||
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31
        )
            return false;
        return true;
    },

    checkImage(image) {
        const re = /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/;
        return re.test(image);
    },
};

module.exports = exportedMethods;
