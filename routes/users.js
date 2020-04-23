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

router.post('/account/username', async (req, res) => {
    let username = req.body.userName;
    try {
        const user = await userData.getUserByUserName(username);
        res.status(200).json(user);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
    }
});

router.post('/account/email', async (req, res) => {
    let email = req.body.email;
    try {
        const user = await userData.getUserByUserName(email);
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

router.put('/account/update/:id', async (req, res) => {
    let userInfo = req.body;
    console.log(userInfo);
    /*
     userName
     phoneNumber
     email
     address
     zipCode
     bio
     */
    if (!userInfo) {
        res.status(400).json({
            error: 'You must provide data to update a user information',
        });
        return;
    }

    if (!userInfo.userName || userInfo.userName.length === 0) {
        res.status(400).json({
            error: 'You must provide user name to update a user information',
        });
        return;
    }

    // check new name whether in the database or not
    if (userInfo.userName) {
        if (
            (await userData.getUserByUserName(
                userInfo.userName.toLowerCase()
            )) !== null
        ) {
            if (
                (await userData.getUserById(req.params.id)).userName !==
                userInfo.userName.toLowerCase()
            ) {
                res.status(400).json({
                    error: `This ${userInfo.userName} has been existed`,
                });
                return;
            }
        }
    }

    if (!checkParam.checkUserName(userInfo.userName)) {
        res.status(400).json({ error: 'Not valid user name' });
        return;
    }

    // check phoneNumber field
    if (userInfo.phoneNumber.length !== 0) {
        if (!checkParam.checkPhoneNumber(userInfo.phoneNumber)) {
            res.status(400).json({ error: 'Not valid phone number' });
            return;
        }
    }

    // check email field
    if (!checkParam.checkEmail(userInfo.email)) {
        res.status(400).json({
            error: 'You must provide email to update a user information',
        });
        return;
    }

    if (!checkParam.checkEmail(userInfo.email)) {
        res.status(400).json({ error: 'Not valid email' });
        return;
    }

    // check new email whether in the database or not
    if (userInfo.email) {
        if (
            (await userData.getUserByEmail(userInfo.email.toLowerCase())) !==
            null
        ) {
            if (
                (await userData.getUserById(req.params.id)).email !==
                userInfo.email.toLowerCase()
            ) {
                res.status(400).json({
                    error: `This ${userInfo.email} has been existed`,
                });
                return;
            }
        }
    }

    // check address field
    if (userInfo.address.length !== 0) {
        if ((typeof userInfo.address == 'string') == false) {
            res.status(400).json({ error: 'Address must be string type' });
            return;
        }
    }

    // check zipCode field
    if (userInfo.zipCode.length !== 0) {
        if (!checkParam.checkZipCode(userInfo.zipCode)) {
            res.status(400).json({ error: 'Not valid zip code' });
            return;
        }
    }

    try {
        await userData.getUserById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }

    try {
        const updatedUser = await userData.updatedUser(
            req.params.id,
            userInfo.userName.toLowerCase(),
            userInfo.email.toLowerCase(),
            userInfo.phoneNumber,
            userInfo.address,
            userInfo.zipCode,
            userInfo.bio
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Update user information failed' });
        console.log(error);
    }
});

router.put('/account/password/:id', async (req, res) => {
    let passwordInfo = req.body;

    if (!passwordInfo) {
        res.status(400).json({
            error:
                'You must provide old password and new password to update password',
        });
        return;
    }

    if (!passwordInfo.oldPassword) {
        res.status(400).json({ error: 'You must provide a old password' });
        return;
    }

    if (!passwordInfo.newPassword) {
        res.status(400).json({ error: 'You must provide a new password' });
        return;
    }

    // check new password field
    if (!checkParam.checkPassword(passwordInfo.newPassword)) {
        res.status(400).json({
            error:
                'Password must 8-16 characters. Only should contain lower case word, upper case word or number',
        });
        return;
    }

    if (
        await bcrypt.compare(
            passwordInfo.newPassword,
            (await userData.getUserById(req.params.id)).hashedPassword
        )
    ) {
        res.status(400).json({
            error: 'The new password is the same as the old password',
        });
        return;
    }

    try {
        await userData.getUserById(req.params.id);
    } catch (error) {
        res.status(404).json('User not found');
    }

    try {
        const updatePassword = await userData.updatePassword(
            req.params.id,
            passwordInfo.oldPassword,
            passwordInfo.newPassword
        );
        res.status(200).json(updatePassword);
    } catch (error) {
        res.status(500).json({ error: 'Update password failed' });
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
