const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, discussionController.createDiscussion);
router.get('/', authMiddleware, discussionController.getAllDiscussions);
router.get('/:id', authMiddleware, discussionController.getDiscussionById);
router.put('/:id', authMiddleware, discussionController.updateDiscussion);
router.delete('/:id', authMiddleware, discussionController.deleteDiscussion);

router.post('/join', authMiddleware, discussionController.joinDiscussion);
router.get('/newJoin', authMiddleware, discussionController.getNewJoinRequests);
router.post('/acceptJoin', authMiddleware, discussionController.acceptJoin);

module.exports = router;
