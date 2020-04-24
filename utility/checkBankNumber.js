let exportedMethods = {
    cardNumber(number) {
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
    },
};

module.exports = exportedMethods;
