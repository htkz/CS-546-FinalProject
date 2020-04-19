const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
var path = require('path');

router.get('/:id', async (req, res) => {
    try {
        const comment = await commentData.getCommentById(req.params.id);
        res.json(comment);
    } catch (e) {
        res.status(404).json({ message: 'Not found!' });
    }
});

router.get('/placeId/:id', async (req, res) => {
    try {
        const comment = await commentData.getCommentByPlaceId(req.params.id);
        res.json(comment);
    } catch (e) {
        res.status(404).json({ message: 'Not found!' });
    }
});

router.get('/', async (req, res) => {
    try {
        const commentList = await commentData.getAllComments();
        res.json(commentList);
    } catch (e) {
        // Something went wrong with the server!
        res.status(500).send();
    }
});

router.post('/', async (req, res) => {
    let commentInfo = req.body;

    if (!commentInfo) {
        res.status(400).json({
            error: 'You must provide data to create a place',
        });
    }

    try {
        const newComment = await commentData.addComment(
            commentInfo.userId,
            commentInfo.placeId,
            commentInfo.comment
        );
        res.status(200).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
});

router.put('/:id', async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);

    try {
        await commentData.getCommentById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: 'Comment not found' });
        return;
    }

    try {
        const updatedComment = await commentData.updateComment(
            req.params.id,
            requestBody.votedCount,
            requestBody.votedUserId
        );
        res.json(updatedComment);
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
        await commentData.getCommentById(id);
    } catch (error) {
        res.status(404).json({ error: 'Comment not found' });
    }

    try {
        const deleteComment = await commentData.removeComment(id);
        res.json(deleteComment);
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
});

module.exports = router;
