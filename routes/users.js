const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const ticketData = data.tickets;
const utility = require('../utility');
const checkParam = utility.checkInput;

router.get('/account/:id', async (req, res) => {
    try {
        const user = await userData.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
    }
});

router.post('/account/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.hashedPassword;

    if (!email) {
        res.status(400).json({
            error: 'No user name provided',
        });
        return;
    }

    if (!password) {
        res.status(400).json({
            error: 'No password provided',
        });
        return;
    }

    try {
        const user = await userData.getUserByEmail(email);
        let comparePasswords = await bcrypt.compare(
            password,
            user.hashedPassword
        );
        if (!comparePasswords) {
            res.status(401).json({ message: 'Password incorrect' });
            return;
        }
        // cookie
        let sessionUser = { _id: user._id, userName: user.userName };
        res.cookie('user', JSON.stringify(sessionUser));
        req.session.user = { _id: user._id, userName: user.userName };
        res.status(200).json(user);
    } catch (e) {
        res.status(404).json({ message: 'User not found' });
    }
});

router.get('/', async (req, res) => {
    try {
        const userList = await userData.getAllUsers();
        res.status(200).json(userList);
    } catch (e) {
        res.status(500).json({ error: 'No users in database' });
    }
});

router.get('/tickets/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const tickets = await ticketData.getTicketsByUserId(userId);
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({
            error: `Error with tickets of user ${req.params.id}`,
        });
    }
});

router.post('/account/register', async (req, res) => {
    let userInfo = req.body;
    let username = req.body.userName.toLowerCase();
    let email = req.body.email.toLowerCase();
    let unhashedPassword = req.body.hashedPassword;

    if (!userInfo) {
        res.status(400).json({
            error: 'You must provide data to create a user',
        });
        return;
    }

    if (!username) {
        res.status(400).json({
            error: 'No user name provided',
        });
        return;
    }

    // check user name
    if (!checkParam.checkUserName(username)) {
        res.status(400).json({
            error:
                'Username must 3-16 characters, only contains lower case word, upper case word or number',
        });
        return;
    }

    if (!email) {
        res.status(400).json({
            error: 'No email address provided',
        });
        return;
    }

    // check email
    if (!checkParam.checkEmail(email)) {
        res.status(400).json({ error: 'Not valid e-mail address' });
        return;
    }

    if (!unhashedPassword) {
        res.status(400).json({
            error: 'No password provided',
        });
        return;
    }

    // check password
    if (!checkParam.checkPassword(unhashedPassword)) {
        res.status(400).json({
            error:
                'Password must 8-16 characters. Only should contain lower case word, upper case word or number',
        });
        return;
    }

    if ((await userData.getUserByUserName(userInfo.userName)) !== null) {
        res.status(400).json({
            error:
                'The user name has been existed, please choose another user name',
        });
        return;
    }

    if ((await userData.getUserByEmail(userInfo.email)) !== null) {
        res.status(500).json({
            error: 'The email has been existed, please choose another email',
        });
        return;
    }

    try {
        const newUser = await userData.addUser(
            username,
            email,
            unhashedPassword
        );
        res.status(200).json(newUser);
    } catch (e) {
        res.status(500).json({ error: 'Add user failed' });
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
    if (!checkParam.checkPhoneNumber(requestBody.newPhoneNumber)) {
        res.status(400).json({ error: 'Not valid phone number' });
        return;
    }

    // check newZipCode field
    if (!checkParam.checkZipCode(requestBody.newZipCode)) {
        res.status(400).json({ error: 'Not valid zip code' });
        return;
    }

    // check newEmail field
    if (!checkParam.checkEmail(requestBody.newEmail)) {
        res.status(400).json({ error: 'Not valid e-mail address' });
        return;
    }

    // check new email whether in the database or not
    if (requestBody.newEmail) {
        if (
            (await userData.getUserByEmail(
                requestBody.newEmail.toLowerCase()
            )) !== null
        ) {
            res.status(400).json({
                error: `This ${requestBody.newEmail} has been existed`,
            });
            return;
        }
    }

    // check newHashedPassword field
    if (!checkParam.checkPassword(requestBody.newHashedPassword)) {
        res.status(400).json({
            error:
                'Password must 8-16 characters. Only should contain lower case word, upper case word or number',
        });
        return;
    }

    // check newUserName field
    if (!checkParam.checkUserName(requestBody.newUserName)) {
        res.status(400).json({
            error:
                'Username must 3-16 characters, only contains lower case word, upper case word & number',
        });
        return;
    }

    // check new name whether in the database or not
    if (requestBody.newUserName) {
        if (
            (await userData.getUserByUserName(
                requestBody.newUserName.toLowerCase()
            )) !== null
        ) {
            res.status(400).json({
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
            updatedObject.userName = requestBody.newUserName.toLowerCase();
        } else {
            res.status(400).json({
                error: 'The new user name is the same as the old user name',
            });
        }

        if (requestBody.newEmail && requestBody.newEmail !== oldUser.email) {
            updatedObject.email = requestBody.newEmail.toLowerCase();
        } else {
            res.status(400).json({
                error: 'The new email is the same as the old email',
            });
        }

        if (
            requestBody.newPhoneNumber &&
            requestBody.newPhoneNumber !== oldUser.phoneNumber
        ) {
            updatedObject.phoneNumber = requestBody.newPhoneNumber;
        } else {
            res.status(400).json({
                error:
                    'The new phone number is the same as the old phone number',
            });
        }

        if (
            requestBody.newAddress &&
            requestBody.newAddress !== oldUser.address
        ) {
            updatedObject.address = requestBody.newAddress;
        } else {
            res.status(400).json({
                error: 'The new address is the same as the old address',
            });
        }

        if (
            requestBody.newZipCode &&
            requestBody.newZipCode !== oldUser.zipCode
        ) {
            updatedObject.zipCode = requestBody.newZipCode;
        } else {
            res.status(400).json({
                error: 'The new zip code is the same as the old zip code',
            });
        }

        if (
            requestBody.newHashedPassword &&
            !(await bcrypt.compare(
                requestBody.newHashedPassword,
                oldUser.hashedPassword
            ))
        ) {
            updatedObject.hashedPassword = requestBody.newHashedPassword;
        } else {
            res.status(400).json({
                error: 'The new password is the same as the old password',
            });
        }
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }

    try {
        if (JSON.stringify(updatedObject) === '{}') {
            res.status(400).json({ error: 'No information need to update' });
            return;
        }
        const updatedUser = await userData.updateUser(
            req.params.id,
            updatedObject
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Upadte user information failed' });
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

    // check phoneNumber field
    if (!userInfo.phoneNumber || userInfo.phoneNumber.length === 0) {
        res.status(400).json({ error: 'You must provide a phone number' });
        return;
    }

    if (!checkParam.checkPhoneNumber(userInfo.phoneNumber)) {
        res.status(400).json({ error: 'Not valid phone number' });
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

    // check zipCode field
    if (!userInfo.zipCode || userInfo.zipCode.length === 0) {
        res.status(400).json({ error: 'You must provide a zip code' });
        return;
    }

    if (!checkParam.checkZipCode(userInfo.zipCode)) {
        res.status(400).json({ error: 'Not valid zip code' });
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
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ error: 'Complete user information failed' });
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
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(500).json({ error: 'Delete user failed' });
    }
});

router.get('/logout', async (req, res) => {
    try {
        req.session.user = undefined;
        res.status(200).json({ message: 'Logout successful!' });
    } catch (e) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

module.exports = router;