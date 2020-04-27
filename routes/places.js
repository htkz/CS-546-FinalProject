const express = require('express');
const router = express.Router();
const data = require('../data');
const placeData = data.places;
const commentData = data.comments;
const userData = data.users;

router.get('/:id', async (req, res) => {
    try {
        const place = await placeData.getPlaceById(req.params.id);
        res.status(200).json(place);
    } catch (e) {
        res.status(404).json({ error: 'Place not found' });
    }
});

router.get('/', async (req, res) => {
    try {
        const placeList = await placeData.getAllPlaces();
        res.status(200).json(placeList);
    } catch (error) {
        res.status(500).json({ error: 'No place in the database' });
    }
});

router.get('/placeComments/:id', async (req, res) => {
    try {
        const allComments = await commentData.getCommentByPlaceId(
            req.params.id
        );
        for (let i = 0; i < allComments.length; i++) {
            const thisUser = await userData.getUserById(allComments[i].user);
            allComments[i].user = thisUser.userName;
        }
        res.status(200).json(allComments);
    } catch (e) {
        res.status(404).json({ error: 'Comment not found by placeId' });
    }
});

router.post('/', async (req, res) => {
    let placeInfo = req.body;
    console.log(placeInfo);

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
            placeInfo.placeName,
            placeInfo.description,
            placeInfo.placeAddress,
            placeInfo.placeZipCode,
            placeInfo.placePrice,
            placeInfo.category.split(','),
            placeInfo.displayTime,
            placeInfo.remainNum,
            placeInfo.images.split(',')
        );
        res.status(200).json(newPlace);
    } catch (error) {
        res.status(500).json({ error: 'Add place failed' });
        console.log(error);
    }
});

router.patch('/:id', async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);

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
            updatedObject.placeName = requestBody.newPlaceName;
        }

        if (
            requestBody.newDescription &&
            requestBody.newDescription !== oldPlace.description
        ) {
            updatedObject.description = requestBody.newDescription;
        }

        if (
            requestBody.newPlaceAddress &&
            requestBody.newPlaceAddress !== oldPlace.placeAddress
        ) {
            updatedObject.placeAddress = requestBody.newPlaceAddress;
        }

        if (
            requestBody.newPlaceZipCode &&
            requestBody.newPlaceZipCode !== oldPlace.placeZipCode
        ) {
            updatedObject.placeZipCode = requestBody.newPlaceZipCode;
        }

        if (
            requestBody.newPlacePrice &&
            requestBody.newPlacePrice !== oldPlace.placePrice
        ) {
            updatedObject.placePrice = requestBody.newPlacePrice;
        }

        if (
            requestBody.newCategory &&
            requestBody.newCategory !== oldPlace.category
        ) {
            updatedObject.category = requestBody.newCategory.split(',');
        }

        if (
            requestBody.newDisplayTime &&
            requestBody.newDisplayTime !== oldPlace.displayTime
        ) {
            updatedObject.displayTime = requestBody.newDisplayTime;
        }

        if (
            requestBody.newRemainNum &&
            requestBody.newRemainNum !== oldPlace.remainNum
        ) {
            updatedObject.remainNum = requestBody.newRemainNum;
        }

        if (
            requestBody.newImages &&
            requestBody.newImages !== oldPlace.images
        ) {
            updatedObject.images = requestBody.newImages.split(',');
        }
    } catch (error) {
        res.status(404).json({ error: 'Place not found' });
        return;
    }

    try {
        if (JSON.stringify(updatedObject) === '{}') {
            res.status(400).json({ error: 'No information need to update' });
            return;
        }
        const updatedPlace = await placeData.updatedPlace(
            req.params.id,
            updatedObject
        );
        res.status(200).json(updatedPlace);
    } catch (error) {
        res.status(500).json({ error: 'Update place failed' });
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    if (!id) {
        throw 'You must specify an ID to delete';
    }

    try {
        await placeData.getAllPlaces(id);
    } catch (error) {
        res.status(404).json({ error: 'Place not found' });
    }

    try {
        const deletePlace = await placeData.removePlace(id);
        res.status(200).json(deletePlace);
    } catch (error) {
        res.status(500).json({ error: 'Delete place failed' });
        console.log(error);
    }
});

module.exports = router;
