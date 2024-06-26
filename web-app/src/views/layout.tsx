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
            <div className="min-h-screen flex flex-col max-w-[100vw] overflow-hidden font-roboto">
                <Header onToggleSidebar={handleToggleSidebar} />
                <main className="flex-1 flex flex-col">
                    <Outlet />
                </main>
                <Footer />
            </div>
            <Sidebar isOpened={sidebar} onToggleSidebar={handleToggleSidebar} />
        </>
    );
}
