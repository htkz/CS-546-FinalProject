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
            throw `No friend with that ${id}!`;
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
        };

        const insertInfo = await friendCollection.insertOne(newFriend);
        if (insertInfo.insertedCount === 0) {
            throw 'Insert failed!';
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
            throw 'could not update user successfully';
        }

        return await this.getFriendById(id);
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
