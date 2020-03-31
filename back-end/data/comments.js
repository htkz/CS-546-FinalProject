const mongoCollections = require('../config/mongoCollection');
const comments = mongoCollections.comments;
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

    async addComment(commentName, comment, votedCount) {
        const commentCollection = await comments();

        let newComment = {
            commentName: commentName,
            comment: comment,
            votedCount: votedCount,
        };

        const insertInfo = await commentCollection.insertOne(newComment);

        if (insertInfo.insertedCount === 0) {
            throw 'Insert failed!';
        }

        const newID = insertInfo.insertedId;

        return await this.getCommentById(newID);
    },

    async removeComment(id) {
        const commentCollection = await comments();

        id = await this.checkId(id);

        const deleteInfo = await commentCollection.removeOne({ _id: id });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete comment with id of ${id}`;
        }

        return true;
    },

    async updateComment(id, votedCount) {
        const commentCollection = await comments();

        id = await this.checkId(id);

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
