const express = require('express');
const router = express.Router();
const data = require('../data');
const ticketData = data.tickets;

router.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketData.getTicketById(req.params.id);
        res.json(ticket);
    } catch (e) {
        res.status(404).json({ message: 'Not found!' });
    }
});

router.get('/', async (req, res) => {
    try {
        const ticketList = await ticketData.getAllTictets();
        res.json(ticketList);
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/', async (req, res) => {
    let ticketInfo = req.body;
    console.log(ticketInfo);

    if (!ticketInfo) {
        res.status(400).json({
            error: 'You must provide data to create a ticket',
        });
    }

    try {
        const newTicket = await ticketData.addTicket(
            ticketInfo.userId,
            ticketInfo.placeId,
            ticketInfo.ticketNo,
            ticketInfo.orderedDate,
            ticketInfo.effectDate,
            ticketInfo.price
        );
        res.status(200).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
});

router.put('/:id', async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);

    try {
        await ticketData.getTicketById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    try {
        const updatedTicket = await ticketData.updateTicket(
            req.params.id,
            requestBody.effectDate
        );
        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ error: error });
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
        res.json(deleteTicket);
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
});

module.exports = router;
