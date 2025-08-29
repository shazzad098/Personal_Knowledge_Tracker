import { useState, useEffect, useMemo } from 'react';
import { FaStickyNote, FaEdit, FaTrashAlt, FaFilter, FaSort, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api.js'

const CATEGORIES = ['All', 'Work', 'Personal', 'Learning', 'Ideas'];

const Notes = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('date');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', category: 'Personal' });
    const [notes, setNotes] = useState([]); // State for notes
    const [loading, setLoading] = useState(true);

    // Fetch Notes from Backend
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get('/notes');
                setNotes(res.data);
            } catch (err) {
                console.error('Failed to fetch notes:', err);
                alert('Failed to load notes');
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    // Handle Create New Note
    const handleCreateNewNote = () => {
        setEditingNote(null);
        setForm({ title: '', content: '', category: 'Personal' });
        setIsModalOpen(true);
    };

    // Handle Edit Note
    const handleEditNote = (note) => {
        setEditingNote(note);
        setForm({ title: note.title, content: note.content, category: note.category });
        setIsModalOpen(true);
    };

    // Handle Delete Note
    const handleDeleteNote = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`/notes/${id}`);
                setNotes(notes.filter(note => note._id !== id));
                alert('Note deleted');
            } catch (err) {
                console.error(err);
                alert('Delete failed');
            }
        }
    };

    // Handle Form Change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle Save Note
    const handleSaveNote = async () => {
        if (!form.title.trim()) {
            alert('Title is required!');
            return;
        }

        try {
            if (editingNote) {
                const res = await api.patch(`/notes/${editingNote._id}`, form);
                setNotes(notes.map(n => n._id === editingNote._id ? res.data : n));
                alert('Note updated');
            } else {
                const res = await api.post('/notes', form);
                setNotes([res.data, ...notes]); // New note on top
                alert('Note created');
            }
            setIsModalOpen(false);
            setForm({ title: '', content: '', category: 'Personal' });
        } catch (err) {
            console.error(err);
            alert('Save failed');
        }
    };

    // Filtered & Sorted Notes
    const filteredNotes = useMemo(() => {
        let filtered = notes;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(note => note.category.includes(selectedCategory));
        }

        if (sortBy === 'date') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'title') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        return filtered;
    }, [notes, selectedCategory, sortBy]);

    if (loading) {
        return <div className="text-center py-8">Loading notes...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaStickyNote />
                    <span>Notes Library</span>
                </h1>
                <button
                    onClick={handleCreateNewNote}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <FaPlus size={14} />
                    <span>Create New Note</span>
                </button>
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FaFilter />
                    <span>Filter by:</span>
                </div>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm ${
                            selectedCategory === cat
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}

                <div className="flex items-center gap-2 ml-auto">
                    <FaSort size={14} className="text-gray-500" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="title">Sort by Title</option>
                    </select>
                </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 col-span-full">
                        No notes found.
                    </p>
                ) : (
                    filteredNotes.map((note) => (
                        <div
                            key={note._id}
                            className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer"
                            onClick={() => handleEditNote(note)}
                        >
                            <h3 className="font-semibold text-gray-800 mb-2">{note.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <span>{note.category.join(', ') || 'Uncategorized'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaCalendarAlt size={12} />
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Edit & Delete Icons */}
                            <div className="flex justify-end gap-3 mt-4 text-gray-500">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditNote(note);
                                    }}
                                    className="hover:text-blue-600 transition"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNote(note._id);
                                    }}
                                    className="hover:text-red-600 transition"
                                >
                                    <FaTrashAlt size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Create/Edit Note */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">
                            {editingNote ? 'Edit Note' : 'Create New Note'}
                        </h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Note Title"
                                value={form.title}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />

                            <textarea
                                name="content"
                                placeholder="Write your note..."
                                rows="6"
                                value={form.content}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                            />

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Learning">Learning</option>
                                <option value="Ideas">Ideas</option>
                            </select>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleSaveNote}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    {editingNote ? 'Update' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;