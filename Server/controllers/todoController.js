// controllers/todoController.js
const Todo = require('../models/todoModel');

// GET /api/todos - Get all todos for the logged-in user
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/todos - Create a new todo
exports.createTodo = async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
        return res.status(400).json({ message: 'Todo text is required' });
    }

    try {
        const newTodo = new Todo({ text, userId });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PATCH /api/todos/:id - Update a todo
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    try {
        const todo = await Todo.findOne({ _id: id, userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Update fields if provided
        if (updates.text !== undefined) todo.text = updates.text;
        if (updates.completed !== undefined) todo.completed = updates.completed;

        const updatedTodo = await todo.save();
        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Todo ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE /api/todos/:id - Delete a todo
exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const todo = await Todo.findOne({ _id: id, userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await Todo.deleteOne({ _id: id, userId }); // Use deleteOne for better clarity
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Todo ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};