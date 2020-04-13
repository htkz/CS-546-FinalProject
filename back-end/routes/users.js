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

module.exports = router;
