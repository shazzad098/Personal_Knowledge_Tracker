// controllers/bookmarkController.js
const Bookmark = require('../models/bookmarkModel');

// GET /api/bookmarks - Get all bookmarks for the logged-in user
exports.getBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(bookmarks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/bookmarks - Create a new bookmark
exports.createBookmark = async (req, res) => {
    const { title, url, description, tags } = req.body;
    const userId = req.user.id;

    if (!title || !url) {
        return res.status(400).json({ message: 'Title and URL are required' });
    }

    try {
        const newBookmark = new Bookmark({ title, url, description, tags, userId });
        const savedBookmark = await newBookmark.save();
        res.status(201).json(savedBookmark);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// PATCH /api/bookmarks/:id - Update a bookmark
exports.updateBookmark = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    try {
        const bookmark = await Bookmark.findOne({ _id: id, userId });
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        // Update fields if provided
        if (updates.title !== undefined) bookmark.title = updates.title;
        if (updates.url !== undefined) bookmark.url = updates.url;
        if (updates.description !== undefined) bookmark.description = updates.description;
        if (updates.tags !== undefined) bookmark.tags = updates.tags; // Expects array

        const updatedBookmark = await bookmark.save();
        res.status(200).json(updatedBookmark);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Bookmark ID' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE /api/bookmarks/:id - Delete a bookmark
exports.deleteBookmark = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const bookmark = await Bookmark.findOne({ _id: id, userId });
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        await Bookmark.deleteOne({ _id: id, userId }); // Use deleteOne for better clarity
        res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Bookmark ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};