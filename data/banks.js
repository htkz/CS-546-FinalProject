const mongoCollections = require('../config/mongoCollection');
const banks = mongoCollections.banks;
const users = require('./users');

/*
    firstName: String
    lastName: String
    billingZipCode: String
    cardNumber: String
    expirationDate: String
    securityCode: String
*/

let exportedMethods = {
    async getBankById(id) {
        const bankCollection = await banks();

        const bank = await bankCollection.findOne({ _id: id });

        if (!bank) {
            throw `No bank card with that ${id}!`;
        }

        return bank;
    },

    async addBank(
        userId,
        firstName,
        lastName,
        billingZipCode,
        cardNumber,
        expirationDate,
        securityCode
    ) {
        const bankCollection = await banks();

        let newBank = {
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            billingZipCode: billingZipCode,
            cardNumber: cardNumber,
            expirationDate: expirationDate,
            securityCode: securityCode,
        };

        const insertInfo = await bankCollection.insertOne(newBank);
        if (insertInfo.insertedCount === 0) {
            throw 'Insert failed!';
        }

        const newID = insertInfo.insertedId;
        await users.addBankToUser(userId, newID);

        return await this.getBankById(newID);
    },

    async updatedBank(
        id,
        firstName,
        lastName,
        billingZipCode,
        cardNumber,
        expirationDate,
        securityCode
    ) {
        const bankCollection = await banks();

        let updatedBank = {
            firstName: firstName,
            lastName: lastName,
            billingZipCode: billingZipCode,
            cardNumber: cardNumber,
            expirationDate: expirationDate,
            securityCode: securityCode,
        };

        const updateInfo = await bankCollection.updateOne(
            { _id: id },
            { $set: updatedBank }
        );

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'could not update user successfully';
        }

        return await this.getBankById(id);
    },
};

module.exports = exportedMethods;
