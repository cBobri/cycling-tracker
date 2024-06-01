import Header from "./components/header";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="bg-white min-h-screen max-w-[100vw] overflow-hidden">
            <div className="max-w-screen-xl mx-auto shadow-sm">
                <Header />
                <main className="bg-darkLight-100 min-h-[600px]">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}
