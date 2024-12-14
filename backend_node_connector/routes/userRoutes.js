const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/', authMiddleware, userController.getCurrentUser);
router.put('/', authMiddleware, userController.updateCurrentUser);
router.patch('/', authMiddleware, userController.updateCurrentUser);
router.delete('/', authMiddleware, userController.deleteCurrentUser);

module.exports = router;
