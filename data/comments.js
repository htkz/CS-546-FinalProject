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
                { $addToSet: { upVotedUsers: votedUserId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `Could not update comment successfully with id: ${id}`;
            }
            await users.addVotedCommentToUser(votedUserId, id, type);
        }

        return await this.getCommentById(id);
    },

    async updateCancelComment(id, votedUserId, type) {
        const commentCollection = await comments();

        id = await this.checkId(id);
        canceledUserId = await this.checkId(canceledUserId);

        comment = await this.getCommentById(id);

        if (type === 'up') {
            const updatedInfo = await commentCollection.updateOne(
                { _id: id },
                { $pull: { upVotedUsers: votedUserId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `Could not update cancel comment successfully with id: ${id}`;
            }
            await users.addVotedCommentToUser(votedUserId, id, type);
        } else if (type === 'down') {
            const updatedInfo = await commentCollection.updateOne(
                { _id: id },
                { $pull: { upVotedUsers: votedUserId.toString() } }
            );

            if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
                throw `Could not update cancel comment successfully with id: ${id}`;
            }
            await users.addVotedCommentToUser(votedUserId, id, type);
        }

        return await this.getCommentById(id);
    },

    async removeComment(id) {
        const commentCollection = await comments();
        let comment = null;

        id = await this.checkId(id);

        try {
            comment = await this.getCommentById(id);
        } catch (error) {
            throw error;
        }

        if (comment.upVotedUsers.length !== 0) {
            await users.removeVotedCommentFromUser(comment.user, id, 'up');
        }

        if (comment.downVotedUsers.length !== 0) {
            await users.removeVotedCommentFromUser(comment.user, id, 'down');
        }

        const deleteInfo = await commentCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete comment with id: ${id}`;
        }

        await users.removeCommentFromUser(comment.user, id);
        await places.removeCommentFromPlace(comment.placeId, id);

        // if the comments have votes, delete all user vote from users
        if (comment.votedUsers !== null) {
            for (let item in comment.votedUsers) {
                await users.removeVodedCommentFromUser(
                    await this.checkId(comment.votedUsers[item]),
                    id
                );
            }
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
