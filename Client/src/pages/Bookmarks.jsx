import { useState } from 'react';
import BookmarkCard from '../components/BookmarkCard';

// Mock Bookmarks
const mockBookmarks = [
    { id: 1, url: 'https://tailwindcss.com', category: 'CSS' },
    { id: 2, url: 'https://react.dev', category: 'React' },
    { id: 3, url: 'https://github.com', category: 'Dev' },
];

const CATEGORIES = ['CSS', 'React', 'Dev', 'Learning', 'Tools', 'Inspiration'];

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState(mockBookmarks);
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('Dev');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleAdd = () => {
        if (!url) return alert('URL is required!');
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return alert('Please enter a valid URL (with http:// or https://)');
        }

        setBookmarks([
            { id: Date.now(), url, category },
            ...bookmarks,
        ]);
        setUrl('');
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this bookmark?')) {
            setBookmarks(bookmarks.filter(b => b.id !== id));
        }
    };

    // Filtered Bookmarks
    const filteredBookmarks = bookmarks.filter(bm => {
        const matchesSearch = bm.url.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || bm.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Bookmarks</h1>

            {/* Add Bookmark */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Bookmark</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by URL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            All
                        </button>
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
                    </div>
                </div>
            </div>

            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-8">No bookmarks found.</p>
                ) : (
                    filteredBookmarks.map((bm) => (
                        <BookmarkCard
                            key={bm.id}
                            bookmark={bm}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Bookmarks;