const tool1 = require('./checkInput');
const tool2 = require('./checkBankNumber');
const tool3 = require('./generateTicketNum');

module.exports = {
    checkInput: tool1,
    checkBankNumber: tool2,
    generateTicketNum: tool3,
};
