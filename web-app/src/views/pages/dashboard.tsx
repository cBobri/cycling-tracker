import { Link } from "react-router-dom";
import { useUserContext } from "../../userContext";
import { BiUpload, BiUser } from "react-icons/bi";
import { FaBicycle, FaRoute } from "react-icons/fa6";

const Dashboard = () => {
    const context = useUserContext();

    return (
        <section className="py-16 px-6 xl:px-2 max-w-screen-xl mx-auto">
            <h1 className="text-5xl mb-6">
                Welcome,{" "}
                <span className="text-primary-300">
                    {context.user?.username}
                </span>
                !
            </h1>

            <nav className="grid gap-10 p-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center text-darkLight-200">
                <Link
                    to={"/profile"}
                    className="bg-primary-300 p-6 flex flex-col items-center justify-center gap-4 rounded-3xl hover:scale-110 transition-transform"
                >
                    <BiUser className="text-7xl" />
                    <h2 className="text-4xl">Profile</h2>
                </Link>

                <Link
                    to={"/profile/rides"}
                    className="bg-primary-300 p-6 flex flex-col items-center justify-center gap-4 rounded-3xl hover:scale-110 transition-transform"
                >
                    <FaRoute className="text-7xl" />
                    <h2 className="text-4xl">Your Rides</h2>
                </Link>

                <Link
                    to={"/rides"}
                    className="bg-primary-300 p-6 flex flex-col items-center justify-center gap-4 rounded-3xl hover:scale-110 transition-transform"
                >
                    <FaBicycle className="text-7xl" />
                    <h2 className="text-4xl">Public Rides</h2>
                </Link>

                <Link
                    to={"/import"}
                    className="bg-primary-300 p-6 flex flex-col items-center justify-center gap-4 rounded-3xl hover:scale-110 transition-transform"
                >
                    <BiUpload className="text-7xl" />
                    <h2 className="text-4xl">Import Route</h2>
                </Link>
            </nav>
        </section>
    );
};

export default Dashboard;
