const express = require('express');
const router = express.Router();
const data = require('../data');
const bankData = data.bands;
const utility = require('../utility');
const checkParam = utility.checkBankNumber;

router.get('/:id', async (req, res) => {
    try {
        const bank = await bankData.getBankById(req.params.id);
        res.status(200).json(bank);
    } catch (e) {
        res.status(404).json({ error: 'bank not found' });
    }
});

router.post('/', async (req, res) => {
    let bankInfo = req.body;
    console.log(bankInfo);

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

    if (!bankInfo.cardNumber) {
        res.status(400).json({
            error: 'You must provide cardNumber to create a bank',
        });
        return;
    }

    // check bank number
    if (!checkParam.checkBankNumber(bankInfo.cardNumber)) {
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
        const newBank = await bankData.addBank(
            bankInfo.user,
            bankInfo.firstName,
            bankInfo.lastName,
            bankInfo.billingZipCode,
            bankInfo.cardNumber,
            bankInfo.expirationDate,
            bankInfo.securityCode
        );
        res.status(200).json(newBank);
    } catch (error) {
        res.status(500).json({ error: 'Add bank failed' });
        console.log(error);
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
    console.log(requestBody);

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

    if (!requestBody.cardNumber) {
        res.status(400).json({
            error: 'You must provide cardNumber to update a bank information',
        });
        return;
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
        await bankData.getBankById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: 'Bank not found' });
    }

    try {
        const updatedBank = await bankData.updatedBank(
            req.params.id,
            requestBody.firstName,
            requestBody.lastName,
            requestBody.billingZipCode,
            requestBody.cardNumber,
            requestBody.expirationDate,
            requestBody.securityCode
        );
        res.status(200).json(updatedBank);
    } catch (error) {
        res.status(500).json({ error: 'Update bank information failed' });
    }
});

module.exports = router;
