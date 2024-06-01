import clsx from "clsx";
import { BiHome, BiLogInCircle, BiUserPlus, BiX } from "react-icons/bi";
import Logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

type SidebarProps = {
    isOpened: boolean;
    onToggleSidebar: () => void;
};

const Sidebar = ({ isOpened, onToggleSidebar }: SidebarProps) => {
    return (
        <>
            <div
                className={clsx(
                    "fixed top-0 left-0 w-full h-full bg-black transition-opacity",
                    !isOpened && "opacity-0 hidden",
                    isOpened && "opacity-50"
                )}
                onMouseUp={onToggleSidebar}
            ></div>

            <aside
                className={clsx(
                    "fixed top-0 left-0 h-screen shadow-lg bg-primary-300 shadow-black z-50 transition-transform ease-in duration-200 overflow-hidden origin-left min-w-[350px] text-darkLight-200 font-roboto uppercase",
                    !isOpened && "scale-x-0",
                    isOpened && "scale-x-100"
                )}
            >
                <div className="flex flex-row justify-between bg-darkLight-800 px-6 py-4 border-b border-primary-100 text-darkLight-200">
                    <Link
                        to={"/"}
                        aria-label="To homepage"
                        onClick={onToggleSidebar}
                    >
                        <img src={Logo} alt="Logo" className="w-[150px]" />
                    </Link>

                    <button
                        className="text-7xl hover:text-tertiary transition-colors"
                        aria-label="Close Sidebar"
                        onClick={onToggleSidebar}
                    >
                        <BiX />
                    </button>
                </div>

                <nav className="flex flex-col gap-4 p-6 text-2xl">
                    <Link
                        to={"/"}
                        aria-label="To homepage"
                        className="flex gap-2 pb-3 border-b-2 border-darkLight-200 border-opacity-0 hover:border-opacity-100 transition-colors duration-500 ease-out"
                        onClick={onToggleSidebar}
                    >
                        <BiHome className="text-3xl" />
                        <span>Home</span>
                    </Link>
                    <Link
                        to={"/register"}
                        aria-label="To account registration"
                        className="flex gap-2 pb-3 border-b-2 border-darkLight-200 border-opacity-0 hover:border-opacity-100 transition-colors duration-500 ease-out"
                        onClick={onToggleSidebar}
                    >
                        <BiUserPlus className="text-3xl" />
                        <span>Sign Up</span>
                    </Link>
                    <Link
                        to={"/login"}
                        aria-label="To login"
                        className="flex gap-2 pb-3 border-b-2 border-darkLight-200 border-opacity-0 hover:border-opacity-100 transition-colors duration-500 ease-out"
                        onClick={onToggleSidebar}
                    >
                        <BiLogInCircle className="text-3xl" />
                        <span>Sign In</span>
                    </Link>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
