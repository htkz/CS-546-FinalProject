const express = require('express');
const router = express.Router();
const data = require('../data');
const ticketData = data.tickets;
const friendData = data.friends;
const xss = require('xss');

router.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketData.getTicketById(xss(req.params.id));
        res.status(200).json(ticket);
    } catch (e) {
        res.status(404).json({ error: 'Ticket not found' });
    }
});

router.get('/', async (req, res) => {
    try {
        const ticketList = await ticketData.getAllTictets();
        res.status(200).json(ticketList);
    } catch (error) {
        res.status(500).json({ error: 'No tickets in database' });
    }
});

router.post('/user', async (req, res) => {
    let ticketInfo = req.body;
    console.log(ticketInfo);

    const url = req.url;

    if (!ticketInfo) {
        res.status(400).json({
            error: 'You must provide data to create a ticket',
        });
        return;
    }

    if (!ticketInfo.userId) {
        res.status(400).json({
            error: 'You must provide userId to create a ticket',
        });
        return;
    }

    if (!ticketInfo.placeId) {
        res.status(400).json({
            error: 'You must provide placeId to create a ticket',
        });
        return;
    }

    if (!ticketInfo.orderedDate) {
        res.status(400).json({
            error: 'You must provide orderedDate to create a ticket',
        });
        return;
    }

    if (!ticketInfo.effectDate) {
        res.status(400).json({
            error: 'You must provide effectDate to create a ticket',
        });
        return;
    }

    if (!ticketInfo.price) {
        res.status(400).json({
            error: 'You must provide price to create a ticket',
        });
        return;
    }

    try {
        const newTicket = await ticketData.addTicket(
            xss(ticketInfo.userId),
            xss(ticketInfo.placeId),
            xss(ticketInfo.orderedDate),
            xss(ticketInfo.effectDate),
            xss(ticketInfo.price),
            xss(url)
        );
        res.status(200).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: 'Add ticket failed' });
        console.log(error);
    }
});

router.post('/friends', async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);

    const url = req.url;
    const friends = requestBody.friends;
    const placeId = requestBody.placeId;
    const orderedDate = requestBody.orderedDate;
    const effectDate = requestBody.effectDate;
    const price = requestBody.price;

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide data to create a ticket',
        });
        return;
    }

    if (!friends) {
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

    if (!orderedDate) {
        res.status(400).json({
            error: 'You must provide orderedDate to create a ticket',
        });
        return;
    }

    if (!effectDate) {
        res.status(400).json({
            error: 'You must provide effectDate to create a ticket',
        });
        return;
    }

    if (!price) {
        res.status(400).json({
            error: 'You must provide price to create a ticket',
        });
        return;
    }

    for (friend of friends) {
        try {
            await friendData.getFriendById(friend);
        } catch {
            res.status(404).json({ error: `Friend ${friend} not found` });
        }
    }

    try {
        for (let i = 0; i < friends.length; i++) {
            const newTicket = await ticketData.addTicket(
                xss(friends[i]),
                xss(placeId),
                xss(orderedDate),
                xss(effectDate),
                xss(price),
                xss(url)
            );
            friends[i] = newTicket;
        }
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ error: 'Add ticket failed' });
        console.log(error);
    }
});

router.put('/:id', async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);

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
        res.status(500).json({ error: 'Update ticket failed' });
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
    let id = xss(req.params.id);
    if (!id) {
        throw 'You must specify an ID to delete';
    }

    try {
        await ticketData.getTicketById(id);
    } catch (error) {
        res.status(404).json({ error: 'Ticket not found' });
    }

    try {
        const deleteTicket = await ticketData.removeTicket(id);
        res.status(200).json(deleteTicket);
    } catch (error) {
        res.status(500).json({ error: 'Delete ticket failed' });
        console.log(error);
    }
});

module.exports = router;
