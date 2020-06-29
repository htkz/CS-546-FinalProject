const bcrypt = require('bcryptjs');
const mongoCollections = require('../config/mongoCollection');
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectId;

const saltRounds = 5;

let exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();

        const allUsers = await userCollection.find({}).toArray();

        if (!allUsers) {
            throw 'No users in system!';
        }

        return allUsers;
    },

    async getUserById(id) {
        const userCollection = await users();

        id = await this.checkId(id);

        const user = await userCollection.findOne({ _id: id });
        if (!user) {
            throw `No user with id: ${id}`;
        }

        return user;
    },

    async getUserByUserName(userName) {
        const userCollection = await users();

        const user = await userCollection.findOne({
            userName: new RegExp(`^${userName}$`, 'i'),
        });

        return user;
    },

    async getUserByEmail(email) {
        const userCollection = await users();

        const user = await userCollection.findOne({
            email: new RegExp(`^${email}$`, 'i'),
        });

        return user;
    },

    async addUser(userName, email, hashedPassword) {
        const userCollection = await users();

        hashedPassword = await bcrypt.hash(hashedPassword, saltRounds);

        let newUser = {
            userName: userName,
            email: email,
            phoneNumber: '',
            address: '',
            zipCode: '',
            hashedPassword: hashedPassword,
            bio: '',
            gender: 'Unknown',
            birthDate: '',
            avatar: '',
            userTicketInfo: [],
            userComments: [],
            upVotedComments: [],
            downVotedComments: [],
            friends: [],
            bankCard: '',
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) {
            throw 'Insert user failed!';
        }

        const newID = insertInfo.insertedId;

        return await this.getUserById(newID);
    },

    async removeUser(id) {
        const userCollection = await users();

        id = await this.checkId(id);

        const deleteInfo = await userCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete user with id: ${id}`;
        }

        return true;
    },

    async updatedUser(
        id,
        userName,
        email,
        phoneNumber,
        address,
        zipCode,
        bio,
        gender,
        birthDate,
        avatar
    ) {
        const userCollection = await users();

        id = await this.checkId(id);

        const updatedUser = {
            userName: userName,
            email: email,
            phoneNumber: phoneNumber,
            address: address,
            zipCode: zipCode,
            bio: bio,
            gender: gender,
            birthDate: birthDate,
        };

        const updateInfo = await userCollection.updateOne(
            { _id: id },
            { $set: updatedUser }
        );

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw `Could not update user successfully by id: ${id}`;
        }

        return await this.getUserById(id);
    },

    async addCommentToUser(userId, commentId) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        commentId = await this.checkId(commentId);

        const updatedInfo = await userCollection.updateOne(
            { _id: userId },
            { $addToSet: { userComments: commentId.toString() } }
        );

        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
            throw `addCommentToUser Update failed by id: ${userId}`;
        }

        return await this.getUserById(userId);
    },

    async removeCommentFromUser(userId, commentId) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        commentId = await this.checkId(commentId);

        const deletedInfo = await userCollection.updateOne(
            { _id: userId },
            { $pull: { userComments: commentId.toString() } }
        );

        if (!deletedInfo.matchedCount && !deletedInfo.modifiedCount) {
            throw `removeCommentFromUser Update failed by id: ${userId}`;
        }

        return await this.getUserById(userId);
    },

    async addVotedCommentToUser(userId, votedCommentsId, type) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        votedCommentsId = await this.checkId(votedCommentsId);

        if (type === 'up') {
            const updatedInfo = await userCollection.updateOne(
                { _id: userId },
                { $addToSet: { upVotedComments: votedCommentsId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `addVotedCommentToUser Update failed by id: ${userId}`;
            }
        } else if (type === 'down') {
            const updatedInfo = await userCollection.updateOne(
                { _id: userId },
                { $addToSet: { downVotedComments: votedCommentsId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `addVotedCommentToUser Update failed by id: ${userId}`;
            }
        }

        return await this.getUserById(userId);
    },

    async removeVotedCommentFromUser(userId, votedCommentsId, type) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        votedCommentsId = await this.checkId(votedCommentsId);

        if (type === 'up') {
            const deletedInfo = await userCollection.updateOne(
                { _id: userId },
                { $pull: { upVotedComments: votedCommentsId.toString() } }
            );

            if (!deletedInfo.matchedCount && !deletedInfo.modifiedCount) {
                throw `removeVodedCommentFromUser Update failed by id: ${userId}`;
            }
        } else if (type === 'down') {
            const deletedInfo = await userCollection.updateOne(
                { _id: userId },
                { $pull: { downVotedComments: votedCommentsId.toString() } }
            );

            if (!deletedInfo.matchedCount && !deletedInfo.modifiedCount) {
                throw `removeVodedCommentFromUser Update failed by id: ${userId}`;
            }
        }

        return await this.getUserById(userId);
    },

    async addTicketToUser(userId, ticketId) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        ticketId = await this.checkId(ticketId);

        const updatedInfo = await userCollection.updateOne(
            { _id: userId },
            { $addToSet: { userTicketInfo: ticketId.toString() } }
        );

        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
            throw `addTicketToUser Update failed by id: ${userId}`;
        }

        return await this.getUserById(userId);
    },

    async removeTicketFromUser(userId, ticketId) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        ticketId = await this.checkId(ticketId);

        const deletedInfo = await userCollection.updateOne(
            { _id: userId },
            { $pull: { userTicketInfo: ticketId.toString() } }
        );

        if (!deletedInfo.matchedCount && !deletedInfo.modifiedCount) {
            throw `removeTicketFromUser Update failed by id: ${userId}`;
        }

        return await this.getUserById(userId);
    },

    async addBankToUser(userId, bankId) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        bankId = await this.checkId(bankId);

        const updatedInfo = await userCollection.updateOne(
            { _id: userId },
            { $set: { bankCard: bankId.toString() } }
        );

        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
            throw `addBankToUser Update failed by id: ${userId}`;
        }

        return await this.getUserById(userId);
    },

    async addFriendToUser(userId, friendId) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        friendId = await this.checkId(friendId);

        const updatedInfo = await userCollection.updateOne(
            { _id: userId },
            { $addToSet: { friends: friendId.toString() } }
        );

        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
            throw `addFriendToUser Update failed by id: ${userId}`;
        }

        return await this.getUserById(userId);
    },

    async updatePassword(id, oldPassword, newPassword, type) {
        const userCollection = await users();

        id = await this.checkId(id);

        password = (await this.getUserById(id)).hashedPassword;

        if (type === 'user') {
            if (!(await bcrypt.compare(oldPassword, password))) {
                throw 'Old password does not match';
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updatePasswordInfo = await userCollection.updateOne(
            { _id: id },
            { $set: { hashedPassword: hashedPassword } }
        );

        if (
            !updatePasswordInfo.matchedCount &&
            !updatePasswordInfo.modifiedCount
        ) {
            throw `updatePassword Update failed by id: ${id}`;
        }

        return await this.getUserById(id);
    },

    async updatedAvatar(id, avatar) {
        const userCollection = await users();

        id = await this.checkId(id);

        const updateAvatarInfo = await userCollection.updateOne(
            { _id: id },
            { $set: { avatar: avatar } }
        );

        if (!updateAvatarInfo.matchedCount && !updateAvatarInfo.modifiedCount) {
            throw `updateAvatar Update failed by id: ${id}`;
        }

        return await this.getUserById(id);
    },

    async checkId(id) {
        try {
            if (typeof id == 'string') {
                return ObjectId(id);
            } else if (typeof id == 'object') {
                return id;
            }
        } catch (error) {
            throw error.message;
        }
    },
};

module.exports = exportedMethods;
