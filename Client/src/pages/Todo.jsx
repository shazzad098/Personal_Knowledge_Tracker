import { useState, useMemo } from 'react';

// Mock To-Do Data
const mockTasks = [
    {
        id: 1,
        title: 'Finish React setup',
        completed: true,
        deadline: '2025-04-05',
        priority: 'High',
        createdAt: '2025-04-01',
    },
    {
        id: 2,
        title: 'Design Notes UI',
        completed: false,
        deadline: '2025-04-10',
        priority: 'Medium',
        createdAt: '2025-04-02',
    },
    {
        id: 3,
        title: 'Learn Tailwind Animations',
        completed: false,
        deadline: '2025-04-12',
        priority: 'Low',
        createdAt: '2025-04-03',
    },
];

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUS_FILTERS = ['All', 'Pending', 'Completed'];

const Todo = () => {
    const [tasks, setTasks] = useState(mockTasks);
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Add New Task
    const handleAdd = () => {
        if (!title.trim()) return alert('Task title is required!');

        const newTask = {
            id: Date.now(),
            title,
            completed: false,
            deadline: deadline || null,
            priority,
            createdAt: new Date().toISOString().split('T')[0],
        };

        setTasks([newTask, ...tasks]);
        setTitle('');
        setDeadline('');
        setPriority('Medium');
    };

    // Toggle Complete
    const toggleComplete = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    // Delete Task
    const handleDelete = (id) => {
        if (window.confirm('Delete this task?')) {
            setTasks(tasks.filter((task) => task.id !== id));
        }
    };

    // Filtered & Searched Tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            // Search
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());

            // Status Filter
            const matchesStatus =
                statusFilter === 'All' ||
                (statusFilter === 'Pending' && !task.completed) ||
                (statusFilter === 'Completed' && task.completed);

            // Priority Filter
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, searchTerm, statusFilter, priorityFilter]);

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return 'No deadline';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Get badge color by priority
    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">To-Do List</h1>

            {/* Add Task Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        />

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            {PRIORITIES.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {STATUS_FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    statusFilter === filter
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg text-sm"
                    >
                        <option value="">All Priorities</option>
                        {PRIORITIES.map((p) => (
                            <option key={p} value={p}>Priority: {p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tasks found.</p>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition ${
                                task.completed ? 'opacity-75' : ''
                            }`}
                        >
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleComplete(task.id)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />

                            {/* Task Info */}
                            <div className="flex-1">
                                <h3
                                    className={`font-medium ${
                                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                                    }`}
                                >
                                    {task.title}
                                </h3>
                                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                    <span>Deadline: {formatDate(task.deadline)}</span>
                                    <span>Created: {formatDate(task.createdAt)}</span>
                                </div>
                            </div>

                            {/* Priority Badge */}
                            <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getPriorityColor(
                                    task.priority
                                )}`}
                            >
                {task.priority}
              </span>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Todo;