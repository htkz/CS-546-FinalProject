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
        res.status(404).json({ message: 'Not found!' });
    }
});

router.post('/account/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.hashedPassword;

    if (!email) {
        res.status(401).json({
            error: 'No user name provided',
        });
        return;
    }

    if (!password) {
        res.status(401).json({
            error: 'No password provided',
        });
        return;
    }

    try {
        const user = await userData.getUserByEmail(email);
        if (user.hashedPassword !== password) {
            res.status(401).json({ message: 'Password incorrect.' });
            return;
        }
        res.cookie('user', JSON.stringify(user));
        res.json(user);
    } catch (e) {
        res.status(404).json({ message: 'Not found!' });
    }
});

router.get('/', async (req, res) => {
    try {
        const userList = await userData.getAllUsers();
        res.json(userList);
    } catch (e) {
        // Something went wrong with the server!
        res.status(500).send();
    }
});

router.post('/account/register', async (req, res) => {
    let userInfo = req.body;
    let error = [];

    if (!userInfo) {
        res.status(400).json({
            error: 'You must provide data to create a user',
        });
    }

    if (!userInfo.userName) {
        error.push('No user name provided');
        res.status(500).json({
            error: 'No user name provided',
        });
        return;
    }

    if (!userInfo.email) {
        error.push('No email address provided');
        res.status(500).json({
            error: 'No email address provided',
        });
        return;
    }

    if (!userInfo.hashedPassword) {
        error.push('No password provided');
        res.status(500).json({
            error: 'No password provided',
        });
        return;
    }

    if ((await userData.getUserByUserName(userInfo.userName)) !== null) {
        error.push(
            'The user name has been existed, please choose another user name.'
        );
        res.status(500).json({
            error:
                'The user name has been existed, please choose another user name.',
        });
        return;
    }

    if ((await userData.getUserByEmail(userInfo.email)) !== null) {
        error.push('The email has been existed, please choose another email.');
        res.status(500).json({
            error: 'The email has been existed, please choose another email.',
        });
        return;
    }

    if (error.length > 0) {
        console.log(error);
    }

    try {
        const newUser = await userData.addUser(
            userInfo.userName,
            userInfo.email,
            userInfo.hashedPassword
        );
        res.status(200).json(newUser);
    } catch (e) {
        res.status(500).json({ error: e });
        console.log(e);
    }
});

router.patch('/:id', async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);

    let updatedObject = {};

    // check data structure
    if (
        !requestBody.newUserName &&
        !requestBody.newEmail &&
        !requestBody.newPhoneNumber &&
        !requestBody.newAddress &&
        !requestBody.newZipCode &&
        !requestBody.newHashedPassword
    ) {
        res.status(400).json({
            error:
                'You must provide userName, email, phoneNumber, address or zipCode',
        });
        return;
    }
    // check newPhoneNumber field
    else if (requestBody.newPhoneNumber) {
        if ((typeof requestBody.newPhoneNumber == 'number') == false) {
            res.status(400).json({
                error: 'The type of phoneNumber must be number',
            });
            return;
        }
    }
    // check newZipCode field
    else if (requestBody.newZipCode) {
        if ((typeof requestBody.newZipCode == 'string') == false) {
            res.status(400).json({
                error: 'The type of zipCode must be string',
            });
            return;
        }
    }
    // check new email whether in the database or not
    if (requestBody.newEmail) {
        if ((await userData.getUserByEmail(requestBody.newEmail)) !== null) {
            res.status(500).json({
                error: `This ${requestBody.newEmail} has been existed`,
            });
            return;
        }
    }
    // check new name whether in the database or not
    if (requestBody.newUserName) {
        if (
            (await userData.getUserByUserName(requestBody.newUserName)) !== null
        ) {
            res.status(500).json({
                error: `This ${requestBody.newUserName} has been existed`,
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
            requestBody.newPhoneNumber &&
            requestBody.newPhoneNumber !== oldUser.phoneNumber
        ) {
            updatedObject.phoneNumber = requestBody.newPhoneNumber;
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

        if (
            requestBody.newHashedPassword &&
            requestBody.newHashedPassword !== oldUser.hashedPassword
        ) {
            updatedObject.hashedPassword = requestBody.newHashedPassword;
        }
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    try {
        if (JSON.stringify(updatedObject) === '{}') {
            res.status(500).json({ error: 'No information need to update' });
            return;
        }
        const updatedUser = await userData.updateUser(
            req.params.id,
            updatedObject
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
});

router.put('/:id', async (req, res) => {
    let userInfo = req.body;
    console.log(userInfo);
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
    if (!userInfo.zipCode || userInfo.zipCode.length === 0) {
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
        console.log(error);
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
