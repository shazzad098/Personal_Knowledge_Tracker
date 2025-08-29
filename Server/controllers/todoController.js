const Todo = require('../models/todoModel');

// GET /api/todos - All todos
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/todos - Create todo
exports.createTodo = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Todo text is required' });
    }

    try {
        const newTodo = new Todo({ text });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PATCH /api/todos/:id - Update todo
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (text) todo.text = text;
        if (completed !== undefined) todo.completed = completed;

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

// DELETE /api/todos/:id - Delete todo
exports.deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Todo ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};