const mongoCollections = require('../config/mongoCollection');
const tickets = mongoCollections.tickets;
const ObjectId = require('mongodb').ObjectId;

let exportedMethods = {
    async getAllTictets() {
        const ticketCollection = await tickets();

        const allTickets = await ticketCollection.find({}).toArray();

        if (!allTickets) {
            throw 'No tickets in system!';
        }

        return allTickets;
    },

    async getTicketById(id) {
        const ticketCollection = await tickets();

        id = await this.checkId(id);

        const ticket = await ticketCollection.findOne({ _id: id });
        if (!ticket) {
            throw `No ticket with that ${id}`;
        }

        return ticket;
    },

    async addTicket(userId, placeId, ticketNo, orderedDate, effectDate, price) {
        const ticketCollection = await tickets();

        let newTicket = {
            userId: userId,
            placeId: placeId,
            ticketNo: ticketNo,
            orderedDate: orderedDate,
            effectDate: effectDate,
            price: price,
        };

        const insertInfo = await ticketCollection.insertOne(newTicket);
        if (insertInfo.insertedCount === 0) {
            throw 'Insert failed!';
        }

        const newID = insertInfo.insertedId;

        return await this.getTicketById(newID);
    },

    async removeTicket(id) {
        const ticketCollection = await tickets();

        id = await this.checkId(id);

        const deleteInfo = await ticketCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete ticket with id of ${id}`;
        }

        return true;
    },

    async updateTicket(id, effectDate) {
        const ticketCollection = await tickets();

        id = await this.checkId(id);

        let updateTicket = {
            effectDate: effectDate,
        };

        const updateInfo = await ticketCollection.updateOne(
            { _id: id },
            { $set: updateTicket }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'could not update ticket successfully';
        }

        return await this.getTicketById(id);
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
