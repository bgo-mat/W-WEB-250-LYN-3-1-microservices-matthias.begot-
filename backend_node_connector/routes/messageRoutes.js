const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/conversation/:conv_id', authMiddleware, messageController.getMessagesByConversation);
router.post('/', authMiddleware, messageController.createMessage);
router.put('/:id', authMiddleware, messageController.updateMessage);
router.delete('/:id', authMiddleware, messageController.deleteMessage);

module.exports = router;
