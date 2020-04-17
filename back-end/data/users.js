const mongoCollections = require('../config/mongoCollection');
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectId;

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
        if (!user) {
            throw `No user with that ${userName}`;
        }

        return user;
    },

    async getUserByEmail(email) {
        const userCollection = await users();

        const user = await userCollection.findOne({ email: email });
        if (!user) {
            throw `No user with that ${email}`;
        }

        return user;
    },

    async addUser(userName, email, hashedPassword) {
        const userCollection = await users();

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

    async updateUser(id, updateUser) {
        const userCollection = await users();

        id = await this.checkId(id);

        const updateUserData = {};

        if (updateUser.userName) {
            updateUserData.userName = updateUser.userName;
        }

        if (updateUser.email) {
            updateUserData.email = updateUser.email;
        }

        if (updateUser.phoneNumber) {
            updateUserData.phoneNumber = updateUser.phoneNumber;
        }

        if (updateUser.address) {
            updateUserData.address = updateUser.address;
        }

        if (updateUser.zipCode) {
            updateUserData.zipCode = updateUser.zipCode;
        }

        if (updateUser.hashedPassword) {
            updateUserData.hashedPassword = updateUser.hashedPassword;
        }

        const updateInfo = await userCollection.updateOne(
            { _id: id },
            { $set: updateUserData }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'could not update user successfully';
        }

        return await this.getUserById(id);
    },

    async completeUserInfo(id, phoneNumber, address, zipCode) {
        const userCollection = await users();

        id = await this.checkId(id);

        const updateUser = {
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
            throw 'Update failed';
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
            throw 'Update failed';
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
            throw 'Update failed';
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
            throw 'Update failed';
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
            throw 'Update failed';
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
            throw 'Update failed';
        }

        return await this.getUserById(userId);
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
