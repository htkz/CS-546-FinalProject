const express = require('express');
const router = express.Router();
const data = require('../data');
const friendData = data.friends;
const userData = data.users;
const utility = require('../utility');
const checkParam = utility.checkInput;
const xss = require('xss');

router.get('/:id', async (req, res) => {
    try {
        const friend = await friendData.getFriendById(xss(req.params.id));
        res.status(200).json(friend);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

router.post('/', async (req, res) => {
    let friendInfo = req.body;

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

    if (!checkParam.checkEmail(xss(friendInfo.email))) {
        res.status(400).json({
            error: 'Not valid email',
        });
        return;
    }

    if (!checkParam.checkPhoneNumber(xss(friendInfo.phoneNumber))) {
        res.status(400).json({
            error: 'Not valid phoneNumber',
        });
        return;
    }

    try {
        await userData.getUserById(xss(friendInfo.userId));
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const newFriend = await friendData.addFriend(
            xss(friendInfo.userId),
            xss(friendInfo.name),
            xss(friendInfo.email),
            xss(friendInfo.phoneNumber)
        );
        res.status(200).json(newFriend);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put('/:id', async (req, res) => {
    const requestBody = req.body;

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
            xss(req.params.id),
            xss(requestBody.name),
            xss(requestBody.email),
            xss(requestBody.phoneNumber)
        );
        res.status(200).json(updatedFriend);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

module.exports = router;
