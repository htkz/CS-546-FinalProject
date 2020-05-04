const mongoCollections = require('../config/mongoCollection');
const tickets = mongoCollections.tickets;
const users = require('./users');
const places = require('./places');
const counts = require('./counts');
const friends = require('./friends');
const ObjectId = require('mongodb').ObjectId;
const utility = require('../utility');
const generateTicketNo = utility.generateTicketNum;

let exportedMethods = {
    async getAllTictets() {
        const ticketCollection = await tickets();

        const allTickets = await ticketCollection.find({}).toArray();

        if (!allTickets) {
            throw 'No tickets in system!';
        }

        return allTickets;
    },

    async getTicketsByUserId(id) {
        id = await this.checkId(id);
        const ticketCollection = await tickets();
        const allTickets = await ticketCollection
            .find({ userId: id.toString() })
            .toArray();

        for (let i = 0; i < allTickets.length; i++) {
            const ticket = allTickets[i];
            const placeId = ticket.placeId;
            const place = await places.getPlaceById(placeId);
            ticket['images'] = place.images;
            ticket['name'] = place.placeName;
            ticket['description'] = place.description;
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

    async addTicket(userId, placeId, orderedDate, effectDate, price, url) {
        const ticketCollection = await tickets();

        if ((await counts.findDataById('ticketNo')) === null) {
            await counts.addData('ticketNo', 0);
        }

        const index = (await counts.getNextSequenceValue('ticketNo'))
            .sequenceValue;

        ticketNo = generateTicketNo.ticketNo(index, placeId, orderedDate);

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

        if (url === '/user/') {
            await users.addTicketToUser(userId, newID);
        } else if (url === '/friends/') {
            await friends.addTicketToFriend(userId, newID);
        } else {
            throw new Error('wrong url');
        }
        // update ticket remain number for ticket
        await places.updateRemainNum(placeId);

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
};

module.exports = exportedMethods;
