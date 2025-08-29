import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg h-screen p-6 fixed">
                <div className="text-2xl font-bold text-blue-600 mb-8">MindVault</div>
                <nav className="space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                    >
                        <span>🏠</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/notes"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                    >
                        <span>📝</span>
                        <span>Notes</span>
                    </Link>
                    <Link
                        to="/bookmarks"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                    >
                        <span>🔖</span>
                        <span>Bookmarks</span>
                    </Link>
                    <Link
                        to="/todo"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                    >
                        <span>✅</span>
                        <span>To-Do List</span>
                    </Link>
                    <Link
                        to="/progress"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                    >
                        <span>📈</span>
                        <span>Progress Tracker</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 mt-20 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;