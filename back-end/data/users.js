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
        const userCollection = await user();

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
