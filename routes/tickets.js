const express = require('express');
const router = express.Router();
const data = require('../data');
const ticketData = data.tickets;
const friendData = data.friends;
const userData = data.users;
const utility = require('../utility');
const checkParam = utility.checkInput;
const xss = require('xss');

router.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketData.getTicketById(xss(req.params.id));
        res.status(200).json(ticket);
    } catch (e) {
        res.status(404).json({ error: error });
    }
});

router.get('/', async (req, res) => {
    try {
        const ticketList = await ticketData.getAllTictets();
        res.status(200).json(ticketList);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.post('/', async (req, res) => {
    const requestBody = req.body;

    const persons = requestBody.persons;
    const placeId = requestBody.placeId;
    const placeName = requestBody.placeName;
    const orderedDate = requestBody.orderedDate;
    const effectDate = requestBody.effectDate;
    const price = requestBody.price;

    if (!persons.friends) {
        persons.friends = [];
    }

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide data to create a ticket',
        });
        return;
    }

    if (!persons) {
        res.status(400).json({
            error: "You must provide friends' id to create a ticket",
        });
        return;
    }

    if (!placeId) {
        res.status(400).json({
            error: 'You must provide placeId to create a ticket',
        });
        return;
    }

    if (!placeName) {
        res.status(400).json({
            error: 'You must provide placeName to create a ticket',
        });
        return;
    }

    if (!orderedDate) {
        res.status(400).json({
            error: 'You must provide orderedDate to create a ticket',
        });
        return;
    }

    // check date
    if (!checkParam.checkDate(orderedDate)) {
        res.status(400).json({
            error: 'Not valid ordered date',
        });
        return;
    }

    if (!effectDate) {
        res.status(400).json({
            error: 'You must provide effectDate to create a ticket',
        });
        return;
    }

    // check date
    if (!checkParam.checkDate(effectDate)) {
        res.status(400).json({
            error: 'Not valid effect date',
        });
        return;
    }

    if (!price) {
        res.status(400).json({
            error: 'You must provide price to create a ticket',
        });
        return;
    }

    // check price
    if (!checkParam.checkPrice(price)) {
        res.status(400).json({
            error: 'Not valid price',
        });
        return;
    }

    try {
        if (persons.user.length > 0) {
            await userData.getUserById(xss(persons.user));
        }

        for (friend of persons.friends) {
            await friendData.getFriendById(friend);
        }
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const newTickets = await ticketData.addTicket(
            persons,
            xss(placeId),
            xss(placeName),
            xss(orderedDate),
            xss(effectDate),
            xss(price)
        );
        res.status(200).json(newTickets);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put('/:id', async (req, res) => {
    const requestBody = req.body;

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide date to update a ticket',
        });
        return;
    }

    if (!requestBody.effectDate) {
        res.status(400).json({
            error: 'You must provide effectDate to update a ticket',
        });
        return;
    }

    // check date
    if (!checkParam.checkDate(requestBody.effectDate)) {
        res.status(400).json({
            error: 'Not valid effect date',
        });
        return;
    }

    try {
        await ticketData.getTicketById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: 'Ticket not found' });
    }

    try {
        const updatedTicket = await ticketData.updateTicket(
            req.params.id,
            xss(requestBody.effectDate)
        );
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete('/user/:id', async (req, res) => {
    let id = xss(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'You must specify an ID to delete' });
        return;
    }

    try {
        const ticket = await ticketData.getTicketById(id);
        await userData.getUserById(ticket.userId);
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const deleteTicket = await ticketData.removeTicket(
            id,
            'user',
            'ticket'
        );
        res.status(200).json(deleteTicket);
    } catch (error) {
        res.status(500).json({ error: error });
        return;
    }
});

router.delete('/friend/:id', async (req, res) => {
    let id = xss(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'You must specify an ID to delete' });
        return;
    }

    try {
        const ticket = await ticketData.getTicketById(id);
        await friendData.getFriendById(ticket.userId);
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const deleteTicket = await ticketData.removeTicket(
            id,
            xss('friend'),
            xss('ticket')
        );
        res.status(200).json(deleteTicket);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

module.exports = router;
