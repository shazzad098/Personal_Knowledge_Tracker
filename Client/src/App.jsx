import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Bookmarks from './pages/Bookmarks';
import Todo from './pages/Todo';
import Layout from './layouts/Layouts';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'notes', element: <Notes /> },
            { path: 'bookmarks', element: <Bookmarks /> },
            { path: 'todo', element: <Todo /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;