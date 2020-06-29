const mongoCollections = require('../config/mongoCollection');
const banks = mongoCollections.banks;
const users = require('./users');
const ObjectId = require('mongodb').ObjectId;

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

        id = await this.checkId(id);

        const bank = await bankCollection.findOne({ _id: id });

        if (!bank) {
            throw `No bank card with id: ${id}!`;
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
            throw 'Insert bank failed!';
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

        id = await this.checkId(id);

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
            throw `Could not update user successfully with id: ${id}`;
        }

        return await this.getBankById(id);
    },

    async removeBank(id) {
        const bankCollection = await banks();

        if (id.length !== 0) {
            id = await this.checkId(id);

            const deleteInfo = await bankCollection.removeOne({ _id: id });
            if (deleteInfo.deletedCount === 0) {
                throw `Could not delete bank with id: ${id}`;
            }
        }

        return true;
    },

    async checkId(id) {
        try {
            if (typeof id == 'string') {
                return ObjectId(id);
            } else if (typeof id == 'object') {
                return id;
            }
        } catch (error) {
            throw error.message;
        }
    },
};

module.exports = exportedMethods;
