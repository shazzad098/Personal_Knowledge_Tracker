// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');
const protect = require('../middleware/authMiddleware');

// Apply middleware to protected routes
router.get('/', protect, getTodos);
router.post('/', protect, createTodo);
router.patch('/:id', protect, updateTodo);
router.delete('/:id', protect, deleteTodo);

module.exports = router;