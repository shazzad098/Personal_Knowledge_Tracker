import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const stats = [
    { name: 'Total Notes', value: 128, icon: '📝' },
    { name: 'Total Bookmarks', value: 87, icon: '🔖' },
    { name: 'Outstanding To-Dos', value: 15, icon: '📋' },
    { name: 'Completed Tasks', value: 420, icon: '✅' },
];

const recentActivity = [
    { title: 'Project Brainstorming Notes', desc: 'Meeting summary and action items.', time: '2 hours ago', icon: '📄' },
    { title: 'AI Research Article', desc: 'Understanding the latest LLM advancements.', time: 'Yesterday', icon: '🔗' },
    { title: 'Client Follow-up Task', desc: 'Prepare for next week\'s presentation.', time: '2 days ago', icon: '📋' },
    { title: 'Design System Bookmark', desc: 'Resources for UI component libraries.', time: '3 days ago', icon: '🔗' },
    { title: 'Learning React Hooks Note', desc: 'Deep dive into useEffect and useContext.', time: '4 days ago', icon: '📄' },
];

const productivityData = [
    { month: 'Jan', value: 25 },
    { month: 'Feb', value: 30 },
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 35 },
    { month: 'May', value: 48 },
    { month: 'Jun', value: 40 },
    { month: 'Jul', value: 55 },
];

// Mock User Data (later this will come from backend)
const user = {
    name: 'Sarah',
    email: 'sarah@example.com',
}; // ← এটা পরে API থেকে আসবে

const Dashboard = () => {
    // Dynamic Welcome Message
    const welcomeMessage = user ? (
        <div className="bg-blue-50 p-6 rounded-xl">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
            <p className="text-gray-600 mt-2">Your personal knowledge hub for seamless productivity and learning.</p>
        </div>
    ) : null;

    return (
        <div className="space-y-8">
            {/* Dynamic Welcome */}
            {welcomeMessage}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <ul className="space-y-4">
                    {recentActivity.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <span className="text-xs text-gray-400">{item.time}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Weekly Productivity Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Weekly Productivity</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0066cc" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* CTA Card */}
            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14h2v-2h9v2h2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm8 0h-2v-2h2v2zm-4 0H7v-2h6v2zm0-4H7V9h6v4zm8 0h-2V9h2v4zm-4 0H7V9h6v4zm0-4H7V5h6v4zm8 0h-2V5h2v4z"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Capture New Ideas</h2>
                    <p className="text-gray-600 mb-4">Start a new note, log a task, or save a useful link instantly.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                        Add New Note
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;