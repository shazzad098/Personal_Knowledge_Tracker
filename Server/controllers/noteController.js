const Note = require('../models/noteModel');

// GET /api/notes - All notes
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/notes - Create new note
exports.createNote = async (req, res) => {
    const { title, content } = req.body;

    // ✅ এখন JWT থেকে userId পাওয়া যাচ্ছে
    const userId = req.user.userId; // ✅ userId নামে আছে

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const newNote = new Note({ title, content, userId });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        console.error(err.message);
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