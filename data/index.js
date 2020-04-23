const userData = require('./users');
const ticketData = require('./tickets');
const commentData = require('./comments');
const placeData = require('./places');
const countData = require('./counts');
const bandData = require('./banks');
const friendData = require('./friends');

module.exports = {
    users: userData,
    tickets: ticketData,
    comments: commentData,
    places: placeData,
    counts: countData,
    bands: bandData,
    friends: friendData,
};
