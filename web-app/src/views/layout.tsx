import Header from "./components/header";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/sidebar";

export default function Layout() {
    const [sidebar, setSidebar] = useState<boolean>(false);

    const handleToggleSidebar = () => {
        setSidebar((prev) => !prev);
    };

    return (
        <>
            <div className="bg-white min-h-screen max-w-[100vw] overflow-hidden font-roboto">
                <div className="max-w-screen-xl mx-auto shadow-md">
                    <Header onToggleSidebar={handleToggleSidebar} />
                    <main className="min-h-[600px] bg-gray-50">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
            <Sidebar isOpened={sidebar} onToggleSidebar={handleToggleSidebar} />
        </>
    );
}
