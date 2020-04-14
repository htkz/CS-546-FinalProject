const express = require('express');
const router = express.Router();
const data = require('../data');
const placeData = data.places;

router.get('/:id', async (req, res) => {
    try {
        const place = await placeData.getPlaceById(req.params.id);
        res.json(place);
    } catch (e) {
        res.status(404).json({ message: 'Not found!' });
    }
});

router.get('/', async (req, res) => {
    try {
        const placeList = await placeData.getAllPlaces();
        res.json(placeList);
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/', async (req, res) => {
    let placeInfo = req.body;
    console.log(placeInfo);

    let error = [];

    if (!placeInfo) {
        res.status(400).json({
            error: 'You must provide data to create a place',
        });
    }

    if (!placeInfo.description) {
        error.push('No description provided');
        return;
    }

    if (!placeInfo.placeName) {
        error.push('No place name provided');
        return;
    }

    if (!placeInfo.placeAddress) {
        error.push('No place address provided');
        return;
    }

    if (!placeInfo.placeZipCode) {
        error.push('No place zip code provided');
        return;
    }

    try {
        const newPlace = await placeData.addPlace(
            placeInfo.placeName,
            placeInfo.description,
            placeInfo.placeAddress,
            placeInfo.placeZipCode
        );
        res.status(200).json(newPlace);
    } catch (error) {
        res.status(500).json({ error: error });
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
        !requestBody.newPlaceZipCode
    ) {
        res.status(400).json({
            error:
                'You must provide place name, description, place address or place zip code',
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
    } catch (error) {
        res.status(404).json({ error: 'Place not found' });
        return;
    }

    try {
        const updatedPlace = await placeData.updatedPlace(
            req.params.id,
            updatedObject
        );
        res.json(updatedPlace);
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
        await placeData.getAllPlaces(id);
    } catch (error) {
        res.status(404).json({ error: 'Place not found' });
    }

    try {
        const deletePlace = await placeData.removePlace(id);
        res.json(deletePlace);
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
});

module.exports = router;
