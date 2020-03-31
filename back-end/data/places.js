const mongoCollections = require('../config/mongoCollection');
const places = mongoCollections.places;
const ObjectId = require('mongodb').ObjectId;

let exportedMethods = {
    async getAllPlaces() {
        const placeCollection = await places();

        const allPlaces = await placeCollection.find({}).toArray();

        if (!allPlaces) {
            throw 'No places in system!';
        }

        return allPlaces;
    },

    async getPlaceById(id) {
        const placeCollection = await places();

        id = await this.checkId(id);

        const place = await placeCollection.findOne({ _id: id });
        if (!place) {
            throw `No place with that ${id}`;
        }

        return place;
    },

    async addPlace(
        description,
        placeName,
        placeAddress,
        placeZipCode,
        placeUserComments
    ) {
        const placeCollection = await places();

        let newPlace = {
            description: description,
            placeName: placeName,
            placeAddress: placeAddress,
            placeZipCode: placeZipCode,
            placeUserComments: placeUserComments,
        };

        const insertInfo = await placeCollection.insertOne(newPlace);

        if (insertInfo.insertedCount === 0) {
            throw 'Insert failed!';
        }

        const newID = insertInfo.insertedId;

        return await this.getPlaceById(newID);
    },

    async removePlace(id) {
        const placeCollection = await places();

        id = await this.checkId(id);

        const deleteInfo = await placeCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete place with id of ${id}`;
        }

        return true;
    },

    async updatePlace(
        id,
        description,
        placeName,
        placeAddress,
        placeZipCode,
        placeUserComments
    ) {
        const placeCollection = await places();

        id = await this.checkId(id);

        const updatePlace = {
            description: description,
            placeName: placeName,
            placeAddress: placeAddress,
            placeZipCode: placeZipCode,
            placeUserComments: placeUserComments,
        };

        const updateInfo = await placeCollection.updateOne(
            { _id: id },
            { $set: updatePlace }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'could not update place successfully';
        }

        return await this.getPlaceById(id);
    },

    async checkId(id) {
        if (typeof id == 'string') {
            return ObjectId(id);
        } else if (typeof id == 'object') {
            return id;
        } else {
            throw new Error('You must provide valid id to search for.');
        }
    },
};

module.exports = exportedMethods;
