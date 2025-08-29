const Note = require('../models/noteModel');

// GET /api/notes - All notes for logged-in user
exports.getNotes = async (req, res) => {
    try {
        // ✅ শুধুমাত্র লগিন করা ইউজারের নোট ফেচ করো
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/notes - Create new note
exports.createNote = async (req, res) => {
    const { title, content, category } = req.body;

    // ✅ Check if user is logged in
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const userId = req.user.id;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        let normalizedCategory = [];
        if (Array.isArray(category)) {
            normalizedCategory = category.filter(Boolean);
        } else if (typeof category === 'string' && category.trim()) {
            normalizedCategory = [category.trim()];
        }

        const newNote = new Note({ title, content, category: normalizedCategory, userId });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        console.error('Create note error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PATCH /api/notes/:id - Update note
exports.updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (title) note.title = title;
        if (content) note.content = content;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Note ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE /api/notes/:id - Delete note
exports.deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await Note.findByIdAndDelete(id);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Note ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};