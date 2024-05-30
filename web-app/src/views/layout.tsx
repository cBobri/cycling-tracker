import Header from "./components/header";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="">
            <div className="">
                <Header />
                <main className="">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}
