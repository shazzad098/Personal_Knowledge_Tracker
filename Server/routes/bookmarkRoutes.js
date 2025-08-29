// routes/bookmarkRoutes.js
const express = require('express');
const router = express.Router();
const {
    getBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark
} = require('../controllers/bookmarkController');
const protect = require('../middleware/authMiddleware');

// Apply middleware to protected routes
router.get('/', protect, getBookmarks);
router.post('/', protect, createBookmark);
router.patch('/:id', protect, updateBookmark);
router.delete('/:id', protect, deleteBookmark);

module.exports = router;