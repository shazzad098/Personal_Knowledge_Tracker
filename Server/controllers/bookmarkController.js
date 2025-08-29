const Bookmark = require('../models/bookmarkModel');

// GET /api/bookmarks - All bookmarks
exports.getBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
        res.status(200).json(bookmarks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/bookmarks - Create bookmark
exports.createBookmark = async (req, res) => {
    const { title, url, description, tags } = req.body;

    if (!title || !url) {
        return res.status(400).json({ message: 'Title and URL are required' });
    }

    try {
        const newBookmark = new Bookmark({ title, url, description, tags });
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

// PATCH /api/bookmarks/:id - Update bookmark
exports.updateBookmark = async (req, res) => {
    const { id } = req.params;
    const { title, url, description, tags } = req.body;

    try {
        const bookmark = await Bookmark.findById(id);
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        if (title) bookmark.title = title;
        if (url) bookmark.url = url;
        if (description) bookmark.description = description;
        if (tags) bookmark.tags = tags;

        const updatedBookmark = await bookmark.save();
        res.status(200).json(updatedBookmark);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Bookmark ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE /api/bookmarks/:id - Delete bookmark
exports.deleteBookmark = async (req, res) => {
    const { id } = req.params;

    try {
        const bookmark = await Bookmark.findById(id);
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        await Bookmark.findByIdAndDelete(id);
        res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Bookmark ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};