import { FaEye, FaGear } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { formatTime } from "../../helpers/timeFormatters";
import { BiLock } from "react-icons/bi";

const RidesList = ({ rides }: any) => {
    if (!rides || rides.length === 0) {
        return (
            <h2 className="text-center text-3xl mt-20 font-robotoCondensed">
                No rides found :(
            </h2>
        );
    }

    return (
        <div className="grid gap-10 p-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
            {rides?.map((ride: any) => (
                <Link
                    to={`/view/${ride._id}`}
                    className="bg-darkLight-200 p-5 rounded-xl shadow-md hover:scale-110 transition-transform"
                    key={ride._id}
                >
                    <h2 className="text-2xl font-robotoCondensed font-semibold mb-2 flex justify-between">
                        <span>{ride.title}</span>
                        <span className="flex items-center gap-2">
                            {ride.isPublic ? (
                                <>
                                    <FaEye />
                                    <span>Public</span>
                                </>
                            ) : (
                                <>
                                    <BiLock />
                                    <span>Private</span>
                                </>
                            )}
                        </span>
                    </h2>

                    <p className="mb-5">
                        {ride.description || "No description set..."}
                    </p>

                    {ride.stats?.distance ? (
                        <div className="flex justify-between gap-4 text-lg font-robotoCondensed text-darkLight-600 font-semibold">
                            <span>
                                {(ride.stats?.distance / 1000).toFixed(2)} KM
                            </span>
                            <span>
                                {(ride.stats?.avgSpeed).toFixed(2)} KM/H
                            </span>
                            <span>{(ride.stats?.power).toFixed(2)} W</span>
                            <span>{formatTime(ride.stats?.travelTime)}</span>
                        </div>
                    ) : (
                        <p className="flex items-center gap-3 text-lg font-robotoCondensed text-darkLight-600 font-semibold">
                            <FaGear className="animate-spin" />
                            <span>Processing...</span>
                        </p>
                    )}
                </Link>
            ))}
        </div>
    );
};

export default RidesList;
