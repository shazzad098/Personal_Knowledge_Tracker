const express = require('express');
const router = express.Router();
const {
    getNotes,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController');
const protect = require('../middleware/authMiddleware'); // ✅ ঠিক পাথ এবং নাম

// Apply middleware to protected routes
router.get('/', protect, getNotes);
router.post('/', protect, createNote); // ✅ ঠিক
router.patch('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;