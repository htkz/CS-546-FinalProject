const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const ticketData = data.tickets;
const friendData = data.friends;
const commentData = data.comments;
const placeData = data.places;
const bankData = data.banks;
const utility = require('../utility');
const checkParam = utility.checkInput;
const xss = require('xss');
const multer = require('multer');
const { friends, tickets } = require('../config/mongoCollection');

const getFileExtension = (file) => {
    const index = file.indexOf('/');
    return '.' + file.substring(index + 1);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/pic/avatar');
    },
    filename: function (req, file, cb) {
        const extension = getFileExtension(file.mimetype);
        cb(null, req.session.user + '-avatar' + extension);
    },
});

const upload = multer({ storage: storage });

router.post('/avatar', upload.single('photo'), async (req, res) => {
    try {
        const extension = getFileExtension(req.file.mimetype);
        const updatedAvator = await userData.updatedAvatar(
            xss(req.session.user),
            xss(req.session.user + '-avatar' + extension)
        );
        res.status(200).json(updatedAvator);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

router.get('/account/:id', async (req, res) => {
    try {
        const user = await userData.getUserById(xss(req.params.id));
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

router.get('/otheruser/:id', async (req, res) => {
    try {
        const user = await userData.getUserById(xss(req.params.id));
        // get user comments
        for (let i = 0; i < user.userComments.length; i++) {
            comment = await commentData.getCommentById(user.userComments[i]);
            user.userComments[i] = {
                placeName: (await placeData.getPlaceById(comment.placeId))
                    .placeName,
                content: comment.comment,
            };
        }

        // get upvote comments
        for (let i = 0; i < user.upVotedComments.length; i++) {
            comment = await commentData.getCommentById(user.upVotedComments[i]);
            user.upVotedComments[i] = {
                placeName: (await placeData.getPlaceById(comment.placeId))
                    .placeName,
                content: comment.comment,
            };
        }

        otherUser = {
            name: user.userName,
            email: user.email,
            gender: user.gender,
            bio: user.bio,
            birthDate: user.birthDate,
            zipCode: user.zipCode,
            avatar: user.avatar,
            comments: user.userComments,
            upvoteComments: user.upVotedComments,
        };
        res.status(200).json(otherUser);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

router.post('/account/username', async (req, res) => {
    let username = req.body.userName;
    try {
        const user = await userData.getUserByUserName(xss(username));
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({
            error: `No user with username: ${xss(username)}`,
        });
    }
});

router.post('/account/email', async (req, res) => {
    let email = req.body.email;
    try {
        const user = await userData.getUserByEmail(xss(email));
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: `No user with email: ${xss(email)}` });
    }
});

router.post('/account/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.hashedPassword;

    if (!email) {
        res.status(400).json({
            error: 'No email provided',
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
            xss(password),
            xss(user.hashedPassword)
        );
        if (!comparePasswords) {
            res.status(401).json({ error: 'Password incorrect' });
            return;
        }
        // cookie
        let sessionUser = { _id: user._id, userName: xss(user.userName) };
        res.cookie('user', JSON.stringify(sessionUser));
        req.session.user = user._id;
        req.session.isAdmin = !!(user.userName === 'Admin');
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: 'Wrong password or username' });
    }
});

router.get('/', async (req, res) => {
    try {
        let userList = await userData.getAllUsers();
        for (let i = 0; i < userList.length; i++) {
            // comments
            userComments = userList[i].userComments;
            for (let j = 0; j < userComments.length; j++) {
                id = userComments[j];
                userComments[j] = {
                    id: id,
                    comment: (await commentData.getCommentById(id)).comment,
                };
            }
            // upVotedComment
            upVotedComments = userList[i].upVotedComments;
            for (let j = 0; j < upVotedComments.length; j++) {
                id = upVotedComments[j];
                upVotedComments[j] = {
                    id: id,
                    comment: (await commentData.getCommentById(id)).comment,
                };
            }
            // downVotedComment
            downVotedComments = userList[i].downVotedComments;
            for (let j = 0; j < downVotedComments.length; j++) {
                id = downVotedComments[j];
                downVotedComments[j] = {
                    id: id,
                    comment: (await commentData.getCommentById(id)).comment,
                };
            }
            // tickets
            ticketInfo = userList[i].userTicketInfo;
            for (let j = 0; j < ticketInfo.length; j++) {
                ticketId = ticketInfo[j];
                const data = await ticketData.getTicketById(ticketId);
                ticketInfo[j] = {
                    id: ticketId,
                    ticketNo: data.ticketNo,
                    placeName: data.placeName,
                    orderedDate: data.orderedDate,
                    effectDate: data.effectDate,
                    status: data.fourfacechusong,
                };
            }
            // friend
            friendList = userList[i].friends;
            for (let j = 0; j < friendList.length; j++) {
                friendId = friendList[j];
                const data = await friendData.getFriendById(friendId);
                let tickets = data.tickets;
                for (let x = 0; x < tickets.length; x++) {
                    id = tickets[x];
                    const ticket = await ticketData.getTicketById(id);
                    tickets = {
                        id: id,
                        ticketNo: ticket.ticketNo,
                        placeName: ticket.placeName,
                        orderedDate: ticket.orderedDate,
                        effectDate: ticket.effectDate,
                        status: ticket.fourfacechusong,
                    };
                }
                friendList[j] = {
                    id: friendId,
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    tickets: tickets,
                };
            }
            // bank
            if (userList[i].bankCard.length !== 0) {
                id = userList[i].bankCard;
                userList[i].bankCard = {
                    id: id,
                    cardNumber: (await bankData.getBankById(id)).cardNumber,
                };
            }
        }
        res.status(200).json(userList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.get('/tickets/:id', async (req, res) => {
    const userId = xss(req.params.id);
    let user = null;

    try {
        user = await userData.getUserById(userId);
    } catch (error) {
        res.status(404).json({ error: error });
    }

    let tickets = user.userTicketInfo;
    let ticketList = [];
    try {
        for (let i = 0; i < tickets.length; i++) {
            tickets[i] = await ticketData.getTicketById(tickets[i]);
            ticketList.push(tickets[i]);
        }
        res.status(200).json(ticketList);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/tickets/friends/:id', async (req, res) => {
    const userId = xss(req.params.id);
    let user = null;

    try {
        user = await userData.getUserById(userId);
    } catch (error) {
        res.status(404).json({ error: error });
    }

    friends = user.friends;
    for (friend of friends) {
        try {
            await friendData.getFriendById(friend);
        } catch (error) {
            res.status(404).json({ error: error });
        }
    }
    ticketList = [];
    try {
        for (let i = 0; i < friends.length; i++) {
            friends[i] = await friendData.getFriendById(friends[i]);
            for (let m = 0; m < friends[i].tickets.length; m++) {
                friends[i].tickets[m] = await ticketData.getTicketById(
                    friends[i].tickets[m]
                );
                friends[i].tickets[m].userId = friends[i].name;
                ticketList.push(friends[i].tickets[m]);
            }
        }
        res.status(200).json(ticketList);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/friends/:id', async (req, res) => {
    try {
        const user = await userData.getUserById(xss(req.params.id));
        if (user.friends.length === 0) {
            res.status(200).json(user.friends);
            return;
        } else {
            for (let i = 0; i < user.friends.length; i++) {
                try {
                    user.friends[i] = await friendData.getFriendById(
                        user.friends[i]
                    );
                } catch (error) {
                    res.status(404).json({ error: error });
                }
            }
            res.status(200).json(user.friends);
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.post('/account/register', async (req, res) => {
    let userInfo = req.body;
    let username = req.body.userName;
    let email = req.body.email;
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
            xss(username),
            xss(email),
            xss(unhashedPassword)
        );
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put('/account/update/:id', async (req, res) => {
    let userInfo = req.body;
    /*
     userName
     phoneNumber
     email
     address
     zipCode
     bio
     gender
     birthDate
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
        if ((await userData.getUserByUserName(userInfo.userName)) !== null) {
            if (
                (
                    await userData.getUserById(req.params.id)
                ).userName.toLowerCase() !== userInfo.userName.toLowerCase()
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
    if (!userInfo.email) {
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
        if ((await userData.getUserByEmail(userInfo.email)) !== null) {
            if (
                (
                    await userData.getUserById(req.params.id)
                ).email.toLowerCase() !== userInfo.email.toLowerCase()
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

    //check gender field
    if (
        userInfo.gender !== 'Male' &&
        userInfo.gender !== 'Female' &&
        userInfo.gender !== 'Unknown'
    ) {
        res.status(400).json({ error: 'Not valid gender' });
        return;
    }

    //check birthDate field
    if (userInfo.birthDate && !checkParam.checkBirthDate(userInfo.birthDate)) {
        res.status(400).json({ error: 'Not valid effect birth date' });
        return;
    }

    try {
        await userData.getUserById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }

    try {
        const updatedUser = await userData.updatedUser(
            xss(req.params.id),
            xss(userInfo.userName),
            xss(userInfo.email),
            xss(userInfo.phoneNumber),
            xss(userInfo.address),
            xss(userInfo.zipCode),
            xss(userInfo.bio),
            xss(userInfo.gender),
            xss(userInfo.birthDate)
        );
        const sessionUser = {
            _id: updatedUser._id,
            userName: xss(updatedUser.userName),
        };
        res.cookie('user', JSON.stringify(sessionUser));
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error });
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

    try {
        await userData.getUserById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: error });
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
        const updatePassword = await userData.updatePassword(
            xss(req.params.id),
            xss(passwordInfo.oldPassword),
            xss(passwordInfo.newPassword),
            xss('user')
        );
        res.status(200).json(updatePassword);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put('/admin/password/:id', async (req, res) => {
    let password = req.body.password;

    if (!password) {
        res.status(400).json({ error: 'You must provide a password' });
        return;
    }

    try {
        const updatePassword = await userData.updatePassword(
            xss(req.params.id),
            xss(password),
            xss(password),
            xss('admin')
        );
        res.status(200).json(updatePassword);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete('/:id', async (req, res) => {
    let user = null;
    if (!req.params.id) {
        res.status(400).json({ error: 'You must specify an ID to delete' });
        return;
    }

    try {
        user = await userData.getUserById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: error });
    }

    try {
        const deleteUser = await userData.removeUser(xss(req.params.id));
        // delete comments
        for (let i = 0; i < user.userComments.length; i++) {
            await commentData.removeComment(xss(user.userComments[i]));
        }
        // delete upvoted
        for (let i = 0; i < user.upVotedComments.length; i++) {
            await commentData.updateCancelComment(
                user.upVotedComments[i],
                req.params.id,
                'up'
            );
        }
        // delete downvoted
        for (let i = 0; i < user.downVotedComments.length; i++) {
            await commentData.updateCancelComment(
                user.upVotedComments[i],
                req.params.id,
                'down'
            );
        }
        // delete tickets
        for (let i = 0; i < user.userTicketInfo.length; i++) {
            await ticketData.removeTicket(xss(user.userTicketInfo[i]));
        }
        // delete friends
        for (let i = 0; i < user.friends.length; i++) {
            // delete tickets
            const friend = await friendData.getFriendById(xss(user.friends[i]));
            for (let x = 0; x < friend.tickets.length; x++) {
                await ticketData.removeTicket(xss(friend.tickets[i]));
            }
            await friendData.removeFriend(xss(user.friends[i]));
        }
        // delete bank
        await bankData.removeBank(xss(user.bankCard));
        res.status(200).json(deleteUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.get('/logout', async (req, res) => {
    try {
        req.session.user = undefined;
        res.status(200).json({ message: 'Logout successful!' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

module.exports = router;
