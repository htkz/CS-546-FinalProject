const mongoCollections = require('../config/mongoCollection');
const tickets = mongoCollections.tickets;
const users = require('./users');
const places = require('./places');
const counts = require('./counts');
const friends = require('./friends');
const ObjectId = require('mongodb').ObjectId;
const utility = require('../utility');
const generateTicketNo = utility.generateTicketNum;
const xss = require('xss');

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

        if (!allTickets) {
            throw `No tickets by user id: ${id}!`;
        }

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
            throw `No ticket with id: ${id}`;
        }

        const placeId = ticket.placeId;
        const place = await places.getPlaceById(placeId);
        ticket['images'] = place.images;
        ticket['name'] = place.placeName;
        ticket['description'] = place.description;

        return ticket;
    },

    async addTicket(
        persons,
        placeId,
        placeName,
        orderedDate,
        effectDate,
        price
    ) {
        const ticketCollection = await tickets();

        if ((await counts.findDataById('ticketNo')) === null) {
            await counts.addData('ticketNo', 0);
        }

        // update remain number
        let number = 0;
        if (persons.user !== '') {
            number += 1;
        }
        if (persons.friends !== undefined) {
            number = number + persons.friends.length;
        }
        await places.updateRemainNum(placeId, number, 'buy');

        result = [];
        if (persons.user !== '') {
            const index = (await counts.getNextSequenceValue('ticketNo'))
                .sequenceValue;

            ticketNo = generateTicketNo.ticketNo(index, placeId, orderedDate);

            let newTicket = {
                userId: xss(persons.user),
                placeId: placeId,
                placeName: placeName,
                ticketNo: ticketNo,
                orderedDate: orderedDate,
                effectDate: effectDate,
                price: price,
                fourfacechusong: 'valid',
            };

            const insertInfo = await ticketCollection.insertOne(newTicket);
            if (insertInfo.insertedCount === 0) {
                throw 'Insert ticket failed!';
            }

            const newID = insertInfo.insertedId;

            // add ticket to user field
            await users.addTicketToUser(persons.user, newID);

            result.push(await this.getTicketById(newID));
        }

        if (persons.friends !== undefined) {
            for (friendId of persons.friends) {
                const index = (await counts.getNextSequenceValue('ticketNo'))
                    .sequenceValue;

                ticketNo = generateTicketNo.ticketNo(
                    index,
                    placeId,
                    orderedDate
                );

                let newTicket = {
                    userId: xss(friendId),
                    placeId: placeId,
                    ticketNo: ticketNo,
                    orderedDate: orderedDate,
                    effectDate: effectDate,
                    price: price,
                };

                const insertInfo = await ticketCollection.insertOne(newTicket);
                if (insertInfo.insertedCount === 0) {
                    throw 'Insert ticket failed!';
                }

                const newID = insertInfo.insertedId;

                await friends.addTicketToFriend(friendId, newID);

                result.push(await this.getTicketById(newID));
            }
        }

        return result;
    },

    async removeTicket(id, operator) {
        const ticketCollection = await tickets();

        id = await this.checkId(id);

        let ticket = null;
        try {
            ticket = await this.getTicketById(id);
        } catch (error) {
            throw `No ticket with id: ${id}`;
        }

        const deleteInfo = await ticketCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete ticket with id: ${id}`;
        }

        if (operator === 'user') {
            await users.removeTicketFromUser(ticket.userId, id);
        } else if (operator === 'friend') {
            await friends.removeTicketFromFriend(ticket.userId, id);
        }

        await places.updateRemainNum(ticket.placeId, 1, 'delete');

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
            throw `Could not update ticket successfully by id: ${id}`;
        }

        return await this.getTicketById(id);
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
