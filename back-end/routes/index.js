const userRoutes = require('./users');
const ticketRoutes = require('./tickets');
const commentRoutes = require('./comments');
const placeRoutes = require('./places');
const express = require('express');

const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('/tickets', ticketRoutes);
    app.use('/comments', commentRoutes);
    app.use('/places', placeRoutes);

    app.use(express.static('front-end'));

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;
