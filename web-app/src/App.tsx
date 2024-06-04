import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./views/layout";
import Home from "./views/pages/home";
import Register from "./views/pages/register";
import Login from "./views/pages/login";
import { UserProvider } from "./userContext";
import Rides from "./views/pages/rides";
import Profile from "./views/pages/profile";
import Dashboard from "./views/pages/dashboard";
import UserRides from "./views/pages/userRides";
import View from "./views/pages/view";

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            { path: "/rides", element: <Rides /> },
            { path: "/profile", element: <Profile /> },
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/profile/rides", element: <UserRides /> },
            { path: "/view/:id", element: <View /> },
        ],
    },
]);

function App() {
    return (
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    );
}

export default App;
