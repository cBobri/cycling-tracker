import { Link } from "react-router-dom";
import {
    BiLogInCircle,
    BiMenuAltRight,
    BiSolidUserAccount,
    BiUserPlus,
} from "react-icons/bi";
import Logo from "../../assets/images/logo.png";
import { useUserContext } from "../../userContext";

type HeaderProps = {
    onToggleSidebar: () => void;
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
    const context = useUserContext();

    const handleLogout = () => {
        localStorage.removeItem("token");
        context.setUserData(null);
    };

    const userNav = () => {
        if (!context.user) {
            return (
                <>
                    <Link
                        to={"/register"}
                        aria-label="To account registration"
                        className="flex justify-center gap-2 px-5 py-2 border-2 border-darkLight-200 rounded-3xl hover:bg-darkLight-200 hover:text-darkLight-900 transition-colors duration-300"
                    >
                        <BiUserPlus className="text-3xl" />
                        <span>Sign up</span>
                    </Link>

                    <Link
                        to={"/login"}
                        aria-label="To login"
                        className="flex justify-center gap-2 px-5 py-2 border-2 border-darkLight-200 rounded-3xl hover:bg-darkLight-200 hover:text-darkLight-900 transition-colors duration-300"
                    >
                        <BiLogInCircle className="text-3xl" />
                        <span>Sign in</span>
                    </Link>
                </>
            );
        }

        return (
            <>
                <Link
                    to={"/profile"}
                    aria-label="To your profile"
                    className="flex justify-center gap-2 px-3 py-2 border-b-2 border-darkLight-200 hover:-translate-y-1 transition-transform duration-100"
                >
                    <BiSolidUserAccount className="text-3xl" />
                    <span>Profile</span>
                </Link>

                <button
                    className="flex justify-center gap-2 px-5 py-2 border-2 border-darkLight-200 rounded-3xl hover:bg-darkLight-200 hover:text-darkLight-900 transition-colors duration-300"
                    onClick={handleLogout}
                >
                    <BiLogInCircle className="text-3xl" />
                    <span>Sign out</span>
                </button>
            </>
        );
    };

    return (
        <header className="px-6 py-4 bg-primary-200 text-darkLight-200">
            <div className="flex flex-row justify-between items-center max-w-screen-xl mx-auto">
                <Link to={"/"} aria-label="To homepage">
                    <img src={Logo} alt="Logo" className="w-[150px]" />
                </Link>

                <nav className="hidden lg:flex flex-row items-center gap-12">
                    <div className="flex flex-row gap-8 text-2xl uppercase">
                        <Link
                            to={"/"}
                            aria-label="To homepage"
                            className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-darkLight-200 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-200 after:origin-right"
                        >
                            Home
                        </Link>
                    </div>

                    <div className="flex flex-row gap-8 text-2xl uppercase">
                        <Link
                            to={"/rides"}
                            aria-label="To users rides"
                            className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-darkLight-200 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-200 after:origin-right"
                        >
                            Routes
                        </Link>
                    </div>

                    <div className="flex flex-row items-center gap-6 text-2xl uppercase">
                        {userNav()}
                    </div>
                </nav>

                <button
                    className="block lg:hidden text-7xl hover:text-tertiary transition-colors"
                    aria-label="Open Sidebar"
                    onClick={onToggleSidebar}
                >
                    <BiMenuAltRight />
                </button>
            </div>
        </header>
    );
};

export default Header;
