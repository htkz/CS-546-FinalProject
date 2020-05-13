const express = require('express');
const router = express.Router();
const data = require('../data');
const bankData = data.banks;
const userData = data.users;
const utility = require('../utility');
const checkParam1 = utility.checkBankNumber;
const checkParam2 = utility.checkInput;
const xss = require('xss');

router.get('/:id', async (req, res) => {
    try {
        const bank = await bankData.getBankById(xss(req.params.id));
        res.status(200).json(bank);
    } catch (e) {
        res.status(404).json({ error: error });
    }
});

router.post('/', async (req, res) => {
    let bankInfo = req.body;

    if (!bankInfo) {
        res.status(400).json({
            error: 'You must provide data to create a bank',
        });
        return;
    }

    if (!bankInfo.user) {
        res.status(400).json({
            error: 'You must provide userId to create a bank',
        });
        return;
    }

    if (!bankInfo.firstName) {
        res.status(400).json({
            error: 'You must provide firstName to create a bank',
        });
        return;
    }

    if (!bankInfo.lastName) {
        res.status(400).json({
            error: 'You must provide lastName to create a bank',
        });
        return;
    }

    if (!bankInfo.billingZipCode) {
        res.status(400).json({
            error: 'You must provide billingZipCode to create a bank',
        });
        return;
    }

    if (!checkParam2.checkZipCode(bankInfo.billingZipCode)) {
        res.status(400).json({
            error: 'Zipcode is not valid',
        });
    }

    if (!bankInfo.cardNumber) {
        res.status(400).json({
            error: 'You must provide cardNumber to create a bank',
        });
        return;
    }

    // check bank number
    if (!checkParam1.cardNumber(bankInfo.cardNumber)) {
        res.status(400).json({
            error: 'Bank number is not valid',
        });
    }

    if (!bankInfo.expirationDate) {
        res.status(400).json({
            error: 'You must provide expirationDate to create a bank',
        });
        return;
    }

    if (!bankInfo.securityCode) {
        res.status(400).json({
            error: 'You must provide securityCode to create a bank',
        });
        return;
    }

    try {
        await userData.getUserById(bankInfo.user);
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const newBank = await bankData.addBank(
            xss(bankInfo.user),
            xss(bankInfo.firstName),
            xss(bankInfo.lastName),
            xss(bankInfo.billingZipCode),
            xss(bankInfo.cardNumber),
            xss(bankInfo.expirationDate),
            xss(bankInfo.securityCode)
        );
        res.status(200).json(newBank);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put('/:id', async (req, res) => {
    /*
    firstName: String
    lastName: String
    billingZipCode: String
    cardNumber: String
    expirationDate: String
    securityCode: String
    */
    const requestBody = req.body;

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide data to update a bank information',
        });
        return;
    }

    if (!requestBody.firstName) {
        res.status(400).json({
            error: 'You must provide firstName to update a bank information',
        });
        return;
    }

    if (!requestBody.lastName) {
        res.status(400).json({
            error: 'You must provide lastName to update a bank information',
        });
        return;
    }

    if (!requestBody.billingZipCode) {
        res.status(400).json({
            error:
                'You must provide billingZipCode to update a bank information',
        });
        return;
    }

    // check zipcode
    if (!checkParam2.checkZipCode(requestBody.billingZipCode)) {
        res.status(400).json({
            error: 'Zipcode is not valid',
        });
    }

    if (!requestBody.cardNumber) {
        res.status(400).json({
            error: 'You must provide cardNumber to update a bank information',
        });
        return;
    }

    // check cardNumber
    if (!checkParam1.cardNumber(requestBody.cardNumber)) {
        res.status(400).json({
            error: 'Bank number is not valid',
        });
    }

    if (!requestBody.expirationDate) {
        res.status(400).json({
            error:
                'You must provide expirationDate to update a bank information',
        });
        return;
    }

    if (!requestBody.securityCode) {
        res.status(400).json({
            error: 'You must provide securityCode to update a bank information',
        });
        return;
    }

    try {
        const updatedBank = await bankData.updatedBank(
            xss(req.params.id),
            xss(requestBody.firstName),
            xss(requestBody.lastName),
            xss(requestBody.billingZipCode),
            xss(requestBody.cardNumber),
            xss(requestBody.expirationDate),
            xss(requestBody.securityCode)
        );
        res.status(200).json(updatedBank);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

module.exports = router;
