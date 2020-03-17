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

    async addUser(userInfo) {
        return users().then(userCollection => {
            return userCollection
                .insertOne(userInfo)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getUserById(newId);
                });
        });
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

    async updateUser(id, userInfo) {
        id = await this.checkId(id);

        return this.getUserById(id).then(currentUser => {
            return userCollection
                .updateOne({ _id: id }, updatedUser)
                .then(() => {
                    return this.getUserById(id);
                });
        });
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
