const express = require('express');
const router = express.Router();
const data = require('../data');
const ticketData = data.tickets;

router.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketData.getTicketById(req.params.id);
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

router.post('/', async (req, res) => {
    let ticketInfo = req.body;
    console.log(ticketInfo);

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
            ticketInfo.userId,
            ticketInfo.placeId,
            ticketInfo.orderedDate,
            ticketInfo.effectDate,
            ticketInfo.price
        );
        res.status(200).json(newTicket);
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
            requestBody.effectDate
        );
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ error: 'Update ticket failed' });
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
    let id = req.params.id;
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
