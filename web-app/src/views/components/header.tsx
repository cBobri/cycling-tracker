import { Link } from "react-router-dom";
import { BiLogInCircle, BiSolidUserPlus } from "react-icons/bi";
import Logo from "../../assets/images/logo.png";

const Header = () => {
    return (
        <header className="flex flex-row justify-between items-center px-6 py-4 bg-primary-300 text-darkLight-200">
            <Link to={"/"} aria-label="To homepage">
                <img src={Logo} alt="Logo" className="w-[150px]" />
            </Link>

            <nav className="flex flex-row gap-12 items-center">
                <div className="flex flex-row gap-8 text-2xl uppercase">
                    <Link
                        to={"/"}
                        aria-label="To homepage"
                        className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-darkLight-200 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-200 after:origin-right"
                    >
                        Home
                    </Link>
                </div>

                <div className="flex flex-row gap-6 text-2xl uppercase">
                    <Link
                        to={"/register"}
                        aria-label="To account registration"
                        className="flex items-center justify-center gap-3 px-5 py-2 border-2 border-darkLight-200 rounded-3xl hover:bg-darkLight-200 hover:text-darkLight-900 transition-colors duration-300"
                    >
                        <BiSolidUserPlus />
                        <span>Register</span>
                    </Link>
                    <Link
                        to={"/login"}
                        aria-label="To login"
                        className="flex items-center justify-center gap-3 px-5 py-2 border-2 border-darkLight-200 rounded-3xl hover:bg-darkLight-200 hover:text-darkLight-900 transition-colors duration-300"
                    >
                        <BiLogInCircle />
                        <span>Login</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
