import { FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { useUserContext } from "../../userContext";
import { FaRoute } from "react-icons/fa6";

interface Props {
    depth: number;
    editableRide?: boolean;
    currentPage: string;
}

const BreadCrumbs = ({ currentPage, depth, editableRide }: Props) => {
    const context = useUserContext();

    if (currentPage === "Dashboard") {
        return (
            <p className="mb-10 text-2xl flex gap-4 flex-wrap">
                <Link
                    to={"/"}
                    className="flex gap-2 items-center hover:text-primary-100 transition-colors"
                >
                    <FaHome />
                    Home
                </Link>
                <span>&gt;</span>
                <span>{currentPage}</span>
            </p>
        );
    }

    if (depth === 2) {
        return (
            <p className="mb-10 text-2xl flex gap-4 flex-wrap">
                <Link
                    to={"/"}
                    className="flex gap-2 items-center hover:text-primary-100 transition-colors"
                >
                    <FaHome />
                    Home
                </Link>
                {context.user && (
                    <>
                        <span>&gt;</span>
                        <Link
                            to={"/dashboard"}
                            className="flex gap-2 items-center hover:text-primary-100 transition-colors"
                        >
                            <MdDashboard />
                            Dashboard
                        </Link>
                    </>
                )}
                <span>&gt;</span>
                <span>{currentPage}</span>
            </p>
        );
    }

    return (
        <p className="mb-10 text-2xl flex gap-4 flex-wrap">
            <Link
                to={"/"}
                className="flex gap-2 items-center hover:text-primary-100 transition-colors"
            >
                <FaHome />
                Home
            </Link>

            {context.user && (
                <>
                    <span>&gt;</span>
                    <Link
                        to={"/dashboard"}
                        className="flex gap-2 items-center hover:text-primary-100 transition-colors"
                    >
                        <MdDashboard />
                        Dashboard
                    </Link>
                </>
            )}

            {editableRide ? (
                <>
                    <span>&gt;</span>
                    <Link
                        to={"/profile/rides"}
                        className="flex gap-2 items-center hover:text-primary-100 transition-colors"
                    >
                        <FaRoute />
                        Your Rides
                    </Link>
                </>
            ) : (
                <>
                    <span>&gt;</span>
                    <Link
                        to={"/rides"}
                        className="flex gap-2 items-center hover:text-primary-100 transition-colors"
                    >
                        <FaRoute />
                        Public Rides
                    </Link>
                </>
            )}

            <span>&gt;</span>
            <span>{currentPage}</span>
        </p>
    );
};

export default BreadCrumbs;
