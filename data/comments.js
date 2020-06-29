const mongoCollections = require('../config/mongoCollection');
const comments = mongoCollections.comments;
const users = require('./users');
const places = require('./places');
const ObjectId = require('mongodb').ObjectId;

let exportedMethods = {
    async getAllComments() {
        const commentCollection = await comments();

        const allComments = await commentCollection.find({}).toArray();

        if (!allComments) {
            throw 'No comments in system!';
        }

        return allComments;
    },

    async getCommentById(id) {
        const commentCollection = await comments();

        id = await this.checkId(id);

        const comment = await commentCollection.findOne({ _id: id });
        if (!comment) {
            throw `No comment with id: ${id}`;
        }

        return comment;
    },

    async getCommentByPlaceId(placeId) {
        const commentCollection = await comments();

        placeId = await this.checkId(placeId);

        const allComments = await commentCollection
            .find({ placeId: placeId.toString() })
            .toArray();

        return allComments;
    },

    async addComment(userId, placeId, comment) {
        const commentCollection = await comments();

        let newComment = {
            user: userId,
            placeId: placeId,
            comment: comment,
            upVotedUsers: [],
            downVotedUsers: [],
        };

        const insertInfo = await commentCollection.insertOne(newComment);

        if (insertInfo.insertedCount === 0) {
            throw 'Insert comment failed!';
        }

        const newID = insertInfo.insertedId;

        await users.addCommentToUser(userId, newID);
        await places.addCommentToPlace(placeId, newID);

        return await this.getCommentById(newID);
    },

    async updateComment(id, votedUserId, type) {
        const commentCollection = await comments();

        id = await this.checkId(id);
        votedUserId = await this.checkId(votedUserId);

        comment = await this.getCommentById(id);

        if (type === 'up') {
            const updatedInfo = await commentCollection.updateOne(
                { _id: id },
                { $addToSet: { upVotedUsers: votedUserId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `Could not update comment successfully with id: ${id}`;
            }
            await users.addVotedCommentToUser(votedUserId, id, type);
        } else if (type === 'down') {
            const updatedInfo = await commentCollection.updateOne(
                { _id: id },
                { $addToSet: { downVotedUsers: votedUserId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `Could not update comment successfully with id: ${id}`;
            }
            await users.addVotedCommentToUser(votedUserId, id, type);
        }

        return await this.getCommentById(id);
    },

    async updateCancelComment(id, votedUserId, type, deleteType) {
        const commentCollection = await comments();

        id = await this.checkId(id);
        votedUserId = await this.checkId(votedUserId);

        comment = await this.getCommentById(id);

        if (type === 'up') {
            const updatedInfo = await commentCollection.updateOne(
                { _id: id },
                { $pull: { upVotedUsers: votedUserId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `Could not update cancel comment successfully with id: ${id}`;
            }
            if (deleteType === 'comment') {
                await users.removeVotedCommentFromUser(votedUserId, id, type);
            }
        } else if (type === 'down') {
            const updatedInfo = await commentCollection.updateOne(
                { _id: id },
                { $pull: { downVotedUsers: votedUserId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `Could not update cancel comment successfully with id: ${id}`;
            }
            if (deleteType === 'comment') {
                await users.removeVotedCommentFromUser(votedUserId, id, type);
            }
        }

        return await this.getCommentById(id);
    },

    async removeComment(id, type) {
        const commentCollection = await comments();
        let comment = null;

        id = await this.checkId(id);

        try {
            comment = await this.getCommentById(id);
        } catch (error) {
            throw error;
        }

        const deleteInfo = await commentCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete comment with id: ${id}`;
        }

        // remove comment from posted user
        if (type === 'comment' || type === 'comments') {
            await users.removeCommentFromUser(comment.user, id);
        }

        // remove comment from up voted user
        if (comment.upVotedUsers.length !== 0) {
            for (let i = 0; i < comment.upVotedUsers.length; i++) {
                await users.removeVotedCommentFromUser(
                    comment.upVotedUsers[i],
                    id,
                    'up'
                );
            }
        }

        // remove comment from down voted user
        if (comment.downVotedUsers.length !== 0) {
            for (let i = 0; i < comment.downVotedUsers.length; i++) {
                await users.removeVotedCommentFromUser(
                    comment.downVotedUsers[i],
                    id,
                    'down'
                );
            }
        }

        // remove comment from places
        if (type === 'comment') {
            await places.removeCommentFromPlace(comment.placeId, id);
        }

        return true;
    },

    async checkId(id) {
        try {
            if (typeof id == 'string') {
                return ObjectId(id);
            } else if (typeof id == 'object') {
                return id;
            }
        } catch (error) {
            throw error.message;
        }
    },
};

module.exports = exportedMethods;
