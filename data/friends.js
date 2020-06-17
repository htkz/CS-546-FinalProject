const mongoCollections = require('../config/mongoCollection');
const friends = mongoCollections.friends;
const users = require('./users');
const ObjectId = require('mongodb').ObjectId;

/*
    _id: id
    name: string
    email: string
    phoneNumber: number
*/
let exportedMethods = {
    async getFriendById(id) {
        const friendCollection = await friends();

        id = await this.checkId(id);

        const friend = await friendCollection.findOne({ _id: id });

        if (!friend) {
            throw `No friend with id: ${id}!`;
        }

        return friend;
    },

    async addFriend(userId, name, email, phoneNumber) {
        const friendCollection = await friends();

        let newFriend = {
            userId: userId,
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            tickets: [],
        };

        const insertInfo = await friendCollection.insertOne(newFriend);
        if (insertInfo.insertedCount === 0) {
            throw 'Insert friend failed!';
        }

        const newID = insertInfo.insertedId;
        await users.addFriendToUser(userId, newID);

        return await this.getFriendById(newID);
    },

    async updatedFriend(id, name, email, phoneNumber) {
        const friendCollection = await friends();

        id = await this.checkId(id);

        let updatedFriend = {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
        };

        const updateInfo = await friendCollection.updateOne(
            { _id: id },
            { $set: updatedFriend }
        );

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw `Could not update user successfully with id: ${id}`;
        }

        return await this.getFriendById(id);
    },

    async addTicketToFriend(friendId, ticketId) {
        const friendCollection = await friends();

        friendId = await this.checkId(friendId);
        ticketId = await this.checkId(ticketId);

        const updatedInfo = await friendCollection.updateOne(
            { _id: friendId },
            { $addToSet: { tickets: ticketId.toString() } }
        );

        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
            throw `addTicketToFriend Update failed by id: ${friendId}`;
        }

        return await this.getFriendById(friendId);
    },

    async removeTicketFromFriend(friendId, ticketId) {
        const friendCollection = await friends();

        friendId = await this.checkId(friendId);
        ticketId = await this.checkId(ticketId);

        const updatedInfo = await friendCollection.updateOne(
            { _id: friendId },
            { $pull: { tickets: ticketId.toString() } }
        );

        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
            throw `removeTicketFromFriend Update failed by id: ${friendId}`;
        }

        return await this.getFriendById(friendId);
    },

    async removeFriend(id) {
        const friendCollection = await friends();

        id = await this.checkId(id);

        const deleteInfo = await friendCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete friend with id: ${id}`;
        }

        return true;
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
