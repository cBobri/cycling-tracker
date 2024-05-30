import { Link } from "react-router-dom";

const Header = () => {
    return (
        <>
            <p>Header</p>
            <Link to={"/"}>Home</Link>
            <Link to={"/register"}>Register</Link>
            <Link to={"/login"}>Login</Link>
        </>
    );
};

export default Header;
