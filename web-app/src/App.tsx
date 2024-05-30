import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./views/layout";
import Home from "./views/pages/home";
import Register from "./views/pages/register";
import Login from "./views/pages/login";

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
