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
            throw `No user with that ${id}`;
        }

        return user;
    },

    async getUserByUserName(userName) {
        const userCollection = await users();

        const user = await userCollection.findOne({ userName: userName });

        return user;
    },

    async getUserByEmail(email) {
        const userCollection = await users();

        const user = await userCollection.findOne({ email: email });

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
            userTicketInfo: [],
            userComments: [],
            votedComments: [],
            firends: [],
            bankCard: '',
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) {
            throw 'Insert failed!';
        }

        const newID = insertInfo.insertedId;

        return await this.getUserById(newID);
    },

    async removeUser(id) {
        const userCollection = await users();

        id = await this.checkId(id);

        const deleteInfo = await userCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }

        return true;
    },

    async updatedUser(id, userName, email, phoneNumber, address, zipCode) {
        const userCollection = await users();

        id = await this.checkId(id);

        const updateUser = {
            userName: userName,
            email: email,
            phoneNumber: phoneNumber,
            address: address,
            zipCode: zipCode,
        };

        const updateInfo = await userCollection.updateOne(
            { _id: id },
            { $set: updateUser }
        );

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'could not update user successfully';
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
            throw 'AddCommentToUser Update failed';
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
            throw 'removeCommentFromUser Update failed';
        }

        return await this.getUserById(userId);
    },

    async addVotedCommentToUser(userId, votedCommentsId) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        votedCommentsId = await this.checkId(votedCommentsId);

        const updatedInfo = await userCollection.updateOne(
            { _id: userId },
            { $addToSet: { votedComments: votedCommentsId.toString() } }
        );

        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
            throw 'addVotedCommentToUser Update failed';
        }

        return await this.getUserById(userId);
    },

    async removeVodedCommentFromUser(userId, votedCommentsId) {
        const userCollection = await users();

        userId = await this.checkId(userId);
        votedCommentsId = await this.checkId(votedCommentsId);

        const deletedInfo = await userCollection.updateOne(
            { _id: userId },
            { $pull: { votedComments: votedCommentsId.toString() } }
        );

        if (!deletedInfo.matchedCount && !deletedInfo.modifiedCount) {
            throw 'removeVodedCommentFromUser Update failed';
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
            throw 'addTicketToUser Update failed';
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
            throw 'removeTicketFromUser Update failed';
        }

        return await this.getUserById(userId);
    },

    async updatePassword(id, oldPassword, newPassword) {
        const userCollection = await users();

        id = await this.checkId(id);

        password = (await this.getUserById(id)).hashedPassword;

        if (!(await bcrypt.compare(oldPassword, password))) {
            throw 'Old password does not match';
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
            throw 'updatePassword Update failed';
        }

        return await this.getUserById(id);
    },

    async checkId(id) {
        if (typeof id == 'string') {
            return ObjectId(id);
        } else if (typeof id == 'object') {
            return id;
        } else {
            throw new Error('You must provide valid id to search for.');
        }
    },
};

module.exports = exportedMethods;
