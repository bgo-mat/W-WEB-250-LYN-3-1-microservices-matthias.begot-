const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', discussionController.createDiscussion);
router.get('/', discussionController.getAllDiscussions);
router.get('/:id', discussionController.getDiscussionById);
router.put('/:id', discussionController.updateDiscussion);
router.delete('/:id', discussionController.deleteDiscussion);

module.exports = router;
