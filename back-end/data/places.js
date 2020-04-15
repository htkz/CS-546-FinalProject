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
        placeName,
        description,
        placeAddress,
        placeZipCode,
        placePrice,
        category,
        displayTime,
        remainNum
    ) {
        const placeCollection = await places();

        let newPlace = {
            placeName: placeName,
            description: description,
            placeAddress: placeAddress,
            placeZipCode: placeZipCode,
            placePrice: placePrice,
            category: category,
            displayTime: displayTime,
            remainNum: remainNum,
            placeUserComments: [],
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

    async updatedPlace(id, updatePlace) {
        const placeCollection = await places();

        id = await this.checkId(id);

        const updatePlaceData = {};

        if (updatePlace.description) {
            updatePlaceData.description = updatePlace.description;
        }

        if (updatePlace.placeName) {
            updatePlaceData.placeName = updatePlace.placeName;
        }

        if (updatePlace.placeAddress) {
            updatePlaceData.placeAddress = updatePlace.placeAddress;
        }

        if (updatePlace.placeZipCode) {
            updatePlaceData.placeZipCode = updatePlace.placeZipCode;
        }

        if (updatePlace.placePrice) {
            updatePlaceData.placePrice = updatePlace.placePrice;
        }

        if (updatePlace.category) {
            updatePlaceData.category = updatePlace.category;
        }

        if (updatePlace.displayTime) {
            updatePlaceData.displayTime = updatePlace.displayTime;
        }

        if (updatePlace.remainNum) {
            updatePlaceData.remainNum = updatePlace.remainNum;
        }

        const updateInfo = await placeCollection.updateOne(
            { _id: id },
            { $set: updatePlaceData }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'could not update place successfully';
        }

        return await this.getPlaceById(id);
    },

    async addCommentToPlace(placeId, commentId) {
        const placeCollection = await places();

        placeId = await this.checkId(placeId);
        commentId = await this.checkId(commentId);

        const updateInfo = await placeCollection.updateOne(
            { _id: placeId },
            { $addToSet: { placeUserComments: commentId.toString() } }
        );

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'Update failed';
        }

        return await this.getPlaceById(placeId);
    },

    async removeCommentFromPlace(placeId, commentId) {
        const placeCollection = await places();

        placeId = await this.checkId(placeId);
        commentId = await this.checkId(commentId);

        const updateInfo = await placeCollection.updateOne(
            { _id: placeId },
            { $pull: { placeUserComments: commentId.toString() } }
        );

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'Update failed';
        }

        return await this.getPlaceById(placeId);
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
