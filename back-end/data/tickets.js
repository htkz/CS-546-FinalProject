const mongoCollections = require('../config/mongoCollection');
const tickets = mongoCollections.tickets;
const users = require('./users');
const counts = require('./counts');
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

    async addTicket(userId, placeId, orderedDate, effectDate, price) {
        const ticketCollection = await tickets();

        if ((await counts.findDataById('ticketNo')) === null) {
            await counts.addData('ticketNo', 0);
        }

        let newTicket = {
            userId: userId,
            placeId: placeId,
            ticketNo: (await counts.getNextSequenceValue('ticketNo'))
                .sequence_value,
            orderedDate: orderedDate,
            effectDate: effectDate,
            price: price,
        };

        const insertInfo = await ticketCollection.insertOne(newTicket);
        if (insertInfo.insertedCount === 0) {
            throw 'Insert failed!';
        }

        const newID = insertInfo.insertedId;

        await users.addTicketToUser(userId, newID);

        return await this.getTicketById(newID);
    },

    async removeTicket(id) {
        const ticketCollection = await tickets();

        id = await this.checkId(id);

        let ticket = null;
        try {
            ticket = await this.getTicketById(id);
        } catch (error) {
            throw new Error(`No ticket with that ${id}`);
        }

        const deleteInfo = await ticketCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete ticket with id of ${id}`;
        }

        await users.removeTicketFromUser(ticket.userId, id);

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

    // async getNextSequenceValue(sequenceName) {
    //     var sequenceDocument = mongoCollections.counts.findAndModify({
    //         query: { _id: sequenceName },
    //         update: { $inc: { sequence_value: 1 } },
    //         new: true,
    //     });
    //     return sequenceDocument.sequence_value;
    // },
};

module.exports = exportedMethods;
