const express = require('express');
const router = express.Router();
const data = require('../data');
const friendData = data.friends;
const utility = require('../utility');
const checkParam = utility.checkInput;

router.get('/:id', async (req, res) => {
    try {
        const friend = await friendData.getFriendById(req.params.id);
        res.status(200).json(friend);
    } catch (e) {
        res.status(404).json({ error: 'Friend not found' });
    }
});

router.post('/', async (req, res) => {
    let friendInfo = req.body;
    console.log(friendInfo);

    if (!friendInfo) {
        res.status(400).json({
            error: 'You must provide data to create a friend',
        });
        return;
    }

    if (!friendInfo.userId) {
        res.status(400).json({
            error: 'You must provide userId to create a friend',
        });
        return;
    }

    if (!friendInfo.name) {
        res.status(400).json({
            error: 'You must provide name to create a friend',
        });
        return;
    }

    if (!friendInfo.email) {
        res.status(400).json({
            error: 'You must provide email to create a friend',
        });
        return;
    }

    if (!friendInfo.phoneNumber) {
        res.status(400).json({
            error: 'You must provide phoneNumber to create a friend',
        });
        return;
    }

    try {
        const newFriend = await friendData.addFriend(
            friendInfo.userId,
            friendInfo.name,
            friendInfo.email,
            friendInfo.phoneNumber
        );
        res.status(200).json(newFriend);
    } catch (error) {
        res.status(500).json({ error: 'Add friend failed' });
        console.log(error);
    }
});

router.put('/:id', async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide data to update a bank information',
        });
        return;
    }

    if (!requestBody.name) {
        res.status(400).json({
            error: 'You must provide name to update a bank information',
        });
        return;
    }

    if (!requestBody.email) {
        res.status(400).json({
            error: 'You must provide email to update a bank information',
        });
        return;
    }

    if (!checkParam.checkEmail(requestBody.email)) {
        res.status(400).json({
            error: 'No valid email',
        });
        return;
    }

    if (!requestBody.phoneNumber) {
        res.status(400).json({
            error: 'You must provide phoneNumber to update a bank information',
        });
        return;
    }

    if (!checkParam.checkPhoneNumber(requestBody.phoneNumber)) {
        res.status(400).json({
            error: 'No valid phone number',
        });
        return;
    }

    try {
        const updatedFriend = await friendData.updatedFriend(
            req.params.id,
            requestBody.name,
            requestBody.email,
            requestBody.phoneNumber
        );
        res.status(200).json(updatedFriend);
    } catch (error) {
        res.status(500).json({ error: 'Update friend information failed' });
    }
});

module.exports = router;
