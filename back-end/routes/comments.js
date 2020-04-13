const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
var path = require('path');

router.get('/', async (req, res) => {
  try {
    const commentList = await commentData.getAllComments();
    res.sendFile(path.join(__dirname + '/personal_formation.html'));
  } catch (e) {
    // Something went wrong with the server!
    res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  new_comment = req.body;
  await new_comment;
});

module.exports = router;
