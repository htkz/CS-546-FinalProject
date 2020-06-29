const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const placeData = data.places;
const userData = data.users;
const xss = require('xss');

router.get('/:id', async (req, res) => {
    try {
        const comment = await commentData.getCommentById(xss(req.params.id));
        res.status(200).json(comment);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

router.get('/', async (req, res) => {
    try {
        const commentList = await commentData.getAllComments();
        res.status(200).json(commentList);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.post('/', async (req, res) => {
    let commentInfo = req.body;

    if (!commentInfo) {
        res.status(400).json({
            error: 'You must provide data to create a comment',
        });
        return;
    }

    if (!commentInfo.user) {
        res.status(400).json({
            error: 'You must provide userId to create a comment',
        });
        return;
    }

    if (!commentInfo.placeId) {
        res.status(400).json({
            error: 'You must provide placeId to create a comment',
        });
        return;
    }

    if (!commentInfo.comment) {
        res.status(400).json({
            error: 'You must provide comment to create a comment',
        });
        return;
    }

    try {
        await placeData.getPlaceById(commentInfo.placeId);
        await userData.getUserById(commentInfo.user);
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const newComment = await commentData.addComment(
            xss(commentInfo.user),
            xss(commentInfo.placeId),
            xss(commentInfo.comment)
        );
        res.status(200).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// upvote comment
router.put('/upvote/:id', async (req, res) => {
    const requestBody = req.body;

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide data to update a comment',
        });
        return;
    }

    if (!requestBody.votedUserId) {
        res.status(400).json({
            error: 'You must provide votedUserId to update a comment',
        });
        return;
    }

    try {
        await commentData.getCommentById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const updatedComment = await commentData.updateComment(
            xss(req.params.id),
            xss(requestBody.votedUserId),
            xss('up')
        );
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// cancel upvote comment
router.put('/cancelupvote/:id', async (req, res) => {
    const requestBody = req.body;

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide data to update a comment',
        });
        return;
    }

    if (!requestBody.votedUserId) {
        res.status(400).json({
            error: 'You must provide votedUserId to update a comment',
        });
        return;
    }

    try {
        await commentData.getCommentById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const updatedComment = await commentData.updateCancelComment(
            xss(req.params.id),
            xss(requestBody.votedUserId),
            xss('up')
        );
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// downvote comment
router.put('/downvote/:id', async (req, res) => {
    const requestBody = req.body;

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide data to update a comment',
        });
        return;
    }

    if (!requestBody.votedUserId) {
        res.status(400).json({
            error: 'You must provide votedUserId to update a comment',
        });
        return;
    }

    try {
        await commentData.getCommentById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const updatedComment = await commentData.updateComment(
            xss(req.params.id),
            xss(requestBody.votedUserId),
            xss('down')
        );
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// cancel downvote comment
router.put('/canceldownvote/:id', async (req, res) => {
    const requestBody = req.body;

    if (!requestBody) {
        res.status(400).json({
            error: 'You must provide data to update a comment',
        });
        return;
    }

    if (!requestBody.votedUserId) {
        res.status(400).json({
            error: 'You must provide votedUserId to update a comment',
        });
        return;
    }

    try {
        await commentData.getCommentById(req.params.id);
    } catch (error) {
        res.status(404).json({ error: error });
        return;
    }

    try {
        const updatedComment = await commentData.updateCancelComment(
            xss(req.params.id),
            xss(requestBody.votedUserId),
            xss('down'),
            xss('comment')
        );
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete('/:id', async (req, res) => {
    let id = xss(req.params.id);
    if (!id) {
        throw 'You must specify an ID to delete';
    }

    try {
        await commentData.getCommentById(id);
    } catch (error) {
        res.status(404).json({ error: error });
    }

    try {
        const deleteComment = await commentData.removeComment(id, 'comment');
        res.status(200).json(deleteComment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

module.exports = router;
