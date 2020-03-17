const mongoCollections = require('../config/mongoCollection');
const tickets = mongoCollections.tickets;
const ObjectId = require('mongodb').ObjectId;

let exportedMethods = {
    async getAllUsers() {
        const ticketCollection = await tickets();

        const allTickets = await ticketCollection.find({}).toArray();

        if (!allTickets) {
            throw 'No users in system!';
        }

        return allTickets;
    },

    async getUserById(id) {
        const ticketCollection = await tickets();

        id = await this.checkId(id);

        const ticket = await ticketCollection.findOne({ _id: id });
        if (!ticket) {
            throw `No ticket with that ${id}`;
        }

        return ticket;
    },

    async addUser(userInfo) {
        return;
    },

    async removeUser(id) {
        const ticketCollection = await tickets();

        id = await this.checkId(id);

        const deleteInfo = await ticketCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete ticket with id of ${id}`;
        }

        return true;
    },

    async updateUser(id, userInfo) {
        id = await this.checkId(id);

        return;
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
