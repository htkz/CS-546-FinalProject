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
            throw `No comment with that ${id}`;
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
            votedCount: 0,
            votedUsers: [],
        };

        const insertInfo = await commentCollection.insertOne(newComment);

        if (insertInfo.insertedCount === 0) {
            throw 'Insert failed!';
        }

        const newID = insertInfo.insertedId;

        await users.addCommentToUser(userId, newID);
        await places.addCommentToPlace(placeId, newID);

        return await this.getCommentById(newID);
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

        const deleteInfo = await commentCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete comment with id of ${id}`;
        }

        await users.removeCommentFromUser(comment.userId, id);
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

    async updateComment(id, votedCount, votedUserId) {
        const commentCollection = await comments();

        id = await this.checkId(id);
        votedUserId = await this.checkId(votedUserId);

        comment = await this.getCommentById(id);

        const updateComment = {
            votedCount: votedCount,
        };

        const updateInfo = await commentCollection.updateOne(
            { _id: id },
            { $set: updateComment }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'could not update comment successfully';
        }

        // If user cancel the vote, remove it from votedUsers list.
        if (comment.votedCount > votedCount) {
            const updateInfo_1 = await commentCollection.updateOne(
                { _id: id },
                { $pull: { votedUsers: votedUserId.toString() } }
            );
            if (!updateInfo_1.matchedCount && !updateInfo_1.modifiedCount) {
                throw 'could not update comment successfully';
            }
            await users.removeVodedCommentFromUser(votedUserId, id);
        }
        // If user vote the vote, add it to votedUsers list.
        else {
            const updateInfo_1 = await commentCollection.updateOne(
                { _id: id },
                { $addToSet: { votedUsers: votedUserId.toString() } }
            );
            if (!updateInfo_1.matchedCount && !updateInfo_1.modifiedCount) {
                throw 'could not update comment successfully';
            }
            await users.addVotedCommentToUser(votedUserId, id);
        }

        return await this.getCommentById(id);
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
