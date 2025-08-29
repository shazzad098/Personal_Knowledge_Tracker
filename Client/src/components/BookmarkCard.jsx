import { fetchLinkPreview } from 'link-preview-js';
import { useEffect, useState } from 'react';

const BookmarkCard = ({ bookmark, onDelete }) => {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPreview = async () => {
            try {
                const data = await fetchLinkPreview(bookmark.url);
                setPreview(data);
            } catch (err) {
                console.error('Failed to fetch preview:', err);
                setPreview({
                    title: bookmark.url,
                    siteName: 'Unknown',
                    imageUrl: null,
                    description: 'No description available',
                });
            } finally {
                setLoading(false);
            }
        };
        loadPreview();
    }, [bookmark.url]);

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {preview?.imageUrl && (
                <img
                    src={preview.imageUrl}
                    alt="preview"
                    className="w-full h-36 object-cover"
                />
            )}

            <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                    {preview?.favicons?.[0] && (
                        <img
                            src={preview.favicons[0]}
                            alt="favicon"
                            className="w-5 h-5"
                        />
                    )}
                    <h3 className="font-semibold text-gray-800 truncate">
                        {preview.title || 'No title'}
                    </h3>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {preview.description || 'No description'}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{preview.siteName || new URL(bookmark.url).hostname}</span>
                    <span>{bookmark.category}</span>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                        Visit
                    </a>
                    <button
                        onClick={() => onDelete(bookmark.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookmarkCard;