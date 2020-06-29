const express = require('express');
const router = express.Router();
const data = require('../data');
const placeData = data.places;
const commentData = data.comments;
const ticketData = data.tickets;
const userData = data.users;
const xss = require('xss');
const { comments } = require('../config/mongoCollection');

router.get('/:id', async (req, res) => {
    try {
        const place = await placeData.getPlaceById(xss(req.params.id));
        res.status(200).json(place);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

router.get('/', async (req, res) => {
    try {
        const placeList = await placeData.getAllPlaces();
        res.status(200).json(placeList);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/placeComments/:id', async (req, res) => {
    try {
        await placeData.getPlaceById(xss(req.params.id));

        const allComments = await commentData.getCommentByPlaceId(
            xss(req.params.id)
        );
        for (let i = 0; i < allComments.length; i++) {
            const thisUser = await userData.getUserById(allComments[i].user);
            allComments[i].userName = thisUser.userName;
        }
        res.status(200).json(allComments);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

router.post('/', async (req, res) => {
    let placeInfo = req.body;

    if (!placeInfo) {
        res.status(400).json({
            error: 'You must provide data to create a place',
        });
        return;
    }

    if (!placeInfo.description) {
        res.status(400).json({
            error: 'You must provide description to create a place',
        });
        return;
    }

    if (!placeInfo.placeName) {
        res.status(400).json({
            error: 'You must provide placeName to create a place',
        });
        return;
    }

    if (!placeInfo.placeAddress) {
        res.status(400).json({
            error: 'You must provide placeAddress to create a place',
        });
        return;
    }

    if (!placeInfo.placeZipCode) {
        res.status(400).json({
            error: 'You must provide placeZipCode to create a place',
        });
        return;
    }

    if (!placeInfo.placePrice) {
        res.status(400).json({
            error: 'You must provide placePrice to create a place',
        });
        return;
    }

    if (!placeInfo.category) {
        res.status(400).json({
            error: 'You must provide category to create a place',
        });
        return;
    }

    if (!placeInfo.displayTime) {
        res.status(400).json({
            error: 'You must provide displayTime to create a place',
        });
        return;
    }

    if (!placeInfo.remainNum) {
        res.status(400).json({
            error: 'You must provide remainNum to create a place',
        });
        return;
    }

    if (!placeInfo.images) {
        res.status(400).json({
            error: 'You must provide images to create a place',
        });
        return;
    }

    try {
        const newPlace = await placeData.addPlace(
            xss(placeInfo.placeName),
            xss(placeInfo.description),
            xss(placeInfo.placeAddress),
            xss(placeInfo.placeZipCode),
            xss(placeInfo.placePrice),
            xss(placeInfo.category.split(',')),
            xss(placeInfo.displayTime),
            xss(placeInfo.remainNum),
            xss(placeInfo.images.split(','))
        );
        res.status(200).json(newPlace);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.patch('/:id', async (req, res) => {
    const requestBody = req.body;

    let updatedObject = {};

    if (
        !requestBody.newPlaceName &&
        !requestBody.newDescription &&
        !requestBody.newPlaceAddress &&
        !requestBody.newPlaceZipCode &&
        !requestBody.newPlacePrice &&
        !requestBody.newCategory &&
        !requestBody.newDisplayTime &&
        !requestBody.newRemainNum &&
        !requestBody.newImages
    ) {
        res.status(400).json({
            error:
                'You must provide place name, description, place address, \
                place zip code, place price, category, display time, remain number or image name',
        });
        return;
    } else if (requestBody.newPlaceZipCode) {
        if ((typeof requestBody.newPlaceZipCode == 'string') == false) {
            res.status(400).json({
                error: 'The type of zipCode must be string',
            });
            return;
        }
    }

    try {
        const oldPlace = await placeData.getPlaceById(req.params.id);

        if (
            requestBody.newPlaceName &&
            requestBody.newPlaceName !== oldPlace.placeName
        ) {
            updatedObject.placeName = xss(requestBody.newPlaceName);
        }

        if (
            requestBody.newDescription &&
            requestBody.newDescription !== oldPlace.description
        ) {
            updatedObject.description = xss(requestBody.newDescription);
        }

        if (
            requestBody.newPlaceAddress &&
            requestBody.newPlaceAddress !== oldPlace.placeAddress
        ) {
            updatedObject.placeAddress = xss(requestBody.newPlaceAddress);
        }

        if (
            requestBody.newPlaceZipCode &&
            requestBody.newPlaceZipCode !== oldPlace.placeZipCode
        ) {
            updatedObject.placeZipCode = xss(requestBody.newPlaceZipCode);
        }

        if (
            requestBody.newPlacePrice &&
            requestBody.newPlacePrice !== oldPlace.placePrice
        ) {
            updatedObject.placePrice = xss(requestBody.newPlacePrice);
        }

        if (
            requestBody.newCategory &&
            requestBody.newCategory !== oldPlace.category
        ) {
            updatedObject.category = xss(requestBody.newCategory).split(',');
            console.log(updatedObject);
        }

        if (
            requestBody.newDisplayTime &&
            requestBody.newDisplayTime !== oldPlace.displayTime
        ) {
            updatedObject.displayTime = xss(requestBody.newDisplayTime);
        }

        if (requestBody.newRemainNum !== oldPlace.remainNum) {
            updatedObject.remainNum = xss(requestBody.newRemainNum);
        }

        if (
            requestBody.newImages &&
            requestBody.newImages !== oldPlace.images
        ) {
            updatedObject.images = xss(requestBody.newImages).split(',');
        }
    } catch (error) {
        res.status(404).json({ error: error });
    }

    try {
        if (JSON.stringify(updatedObject) === '{}') {
            res.status(400).json({ error: 'No information need to update' });
            return;
        }
        const updatedPlace = await placeData.updatedPlace(
            xss(req.params.id),
            updatedObject
        );
        res.status(200).json(updatedPlace);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete('/:id', async (req, res) => {
    let id = xss(req.params.id);
    let place = null;

    if (!id) {
        res.status(400).json({ error: 'You must specify an ID to delete' });
        return;
    }

    try {
        place = await placeData.getPlaceById(id);
    } catch (error) {
        res.status(404).json({ error: 'Place not found' });
    }

    try {
        const deletePlace = await placeData.removePlace(id);
        // delete comment
        for (let i = 0; i < place.placeUserComments.length; i++) {
            await commentData.removeComment(
                place.placeUserComments[i],
                xss('comments')
            );
        }
        // make ticket invalid
        allTickets = await ticketData.getTicketByPlaceId(xss(id));
        console.log(allTickets);
        if (allTickets.length !== 0) {
            for (let i = 0; i < allTickets.length; i++) {
                await ticketData.changeValidTicket(
                    allTickets[i]._id,
                    'invalid',
                    'delete'
                );
            }
        }
        res.status(200).json({ place: deletePlace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
