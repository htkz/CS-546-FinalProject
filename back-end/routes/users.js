const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
var path = require('path');

router.get('/:id', async (req, res) => {
    try {
        const user = await userData.getUserById(req.params.id);
        res.json(user);
    } catch (e) {
        res.status(404).json({ message: 'not found!' });
    }
});

router.get('/', async (req, res) => {
    try {
        const userList = await userData.getAllUsers();
        res.sendFile(path.join(__dirname + '/signin.html'));
        res.json(userList);
    } catch (e) {
        // Something went wrong with the server!
        res.status(500).send();
    }
});

router.post('/', async (req, res) => {
    // Not implemented
    let userData = req.body;
    let error = [];

    if (!body.email) {
        error.push('No email address provided');
    }

    if (!body.userName) {
        error.push('No user name provided');
    }

    if (!body.hashedPassword) {
        error.push('No password provided');
    }

    if (error.length > 0) {
        console.log(error);
    }

    try {
        const newUser = await userData.addUser(
            userData.email,
            userData.userName,
            userData.hashedPassword
        );
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.patch('/:id', async (req, res) => {
    const requestBody = req.body;
    let updatedObject = {};

    // check data structure
    if (
        !requestBody.newUserName &&
        !requestBody.newEmail &&
        !requestBody.newPhoneNumer &&
        !requestBody.newAddress &&
        !requestBody.newZipCode
    ) {
        res.status(400).json({
            error:
                'You must provide userName, email, phoneNumber, address or zipCode',
        });
        return;
    }
    // check newPhoneNumber field
    else if (requestBody.newPhoneNumer) {
        if ((typeof requestBody.newPhoneNumer == 'number') == false) {
            res.status(400).json({
                error: 'The type of phoneNumber must be number',
            });
            return;
        }
    }
    // check newZipCode field
    else if (requestBody.newZipCode) {
        if ((typeof requestBody.newSongs == 'number') == false) {
            res.status(400).json({
                error: 'The type of zipCode must be string',
            });
            return;
        }
    }

    try {
        const oldUser = await userData.getUserById(req.params.id);

        if (
            requestBody.newUserName &&
            requestBody.newUserName !== oldUser.userName
        ) {
            updatedObject.userName = requestBody.newUserName;
        }

        if (requestBody.newEmail && requestBody.newEmail !== oldUser.email) {
            updatedObject.email = requestBody.newEmail;
        }

        if (
            requestBody.newPhoneNumer &&
            requestBody.newPhoneNumer !== oldUser.phoneNumber
        ) {
            updatedObject.phoneNumber = requestBody.newPhoneNumer;
        }

        if (
            requestBody.newAddress &&
            requestBody.newAddress !== oldUser.address
        ) {
            updatedObject.address = requestBody.newAddress;
        }

        if (
            requestBody.newZipCode &&
            requestBody.newZipCode !== oldUser.zipCode
        ) {
            updatedObject.zipCode = requestBody.newZipCode;
        }
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    try {
        const updatedUser = await userData.updateUser(
            req.params.id,
            updatedObject
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put('/:id', async (req, res) => {
    let userInfo = req.body;

    /*
     phoneNumber
     address
     ZipCode
     */
    if (!userInfo) {
        res.status(400).json({
            error: 'You must provide data to complete a user information',
        });
    }

    // check phone number field
    if (!userInfo.phoneNumber || userInfo.phoneNumber.length === 0) {
        res.status(400).json({ error: 'You must provide a phone number' });
        return;
    }

    if ((typeof userInfo.phoneNumber == 'number') == false) {
        res.status(400).json({
            error: 'Phone number name must be number type',
        });
        return;
    }

    // check address field
    if (!userInfo.address || userInfo.address.length === 0) {
        res.status(400).json({ error: 'You must provide an address' });
        return;
    }

    if ((typeof userInfo.address == 'string') == false) {
        res.status(400).json({ error: 'Address must be string type' });
        return;
    }

    // check zip code fields
    if (!userInfo.zipCode || userData.zipCode.length === 0) {
        res.status(400).json({ error: 'You must provide a zip code' });
        return;
    }

    if ((typeof userInfo.zipCode == 'number') == false) {
        res.status(400).json({ error: 'Zip code must be number type' });
        return;
    }

    try {
        await userData.getUserById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    try {
        const updateUser = await userData.completeUserInfo(
            req.params.id,
            userInfo.phoneNumber,
            userInfo.address,
            userInfo.zipCode
        );
        res.json(updateUser);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        throw 'You must specify an ID to delete';
    }

    try {
        await userData.getUserById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }

    try {
        const deleteUser = await userData.removeUser(req.params.id);
        res.json(deleteUser);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

module.exports = router;
