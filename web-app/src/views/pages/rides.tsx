import { useEffect, useState } from "react";
import { fetchPublicRides } from "../../api/rides";
import RidesList from "../components/ridesList";
import { BiLoader } from "react-icons/bi";

const Rides = () => {
    const [rides, setRides] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRides = async () => {
            const response = await fetchPublicRides();

            if (!response) {
                setError("No response from server");
                return;
            }

            if (response.error) {
                console.log(response);
                setError(response.data);
                return;
            }

            setRides(response.data);
            setLoading(false);
        };

        fetchRides();
    }, []);

    return (
        <section className="py-16 px-6 xl:px-2 max-w-screen-xl mx-auto">
            <h1 className="text-primary-300 text-5xl font-semibold font-robotoCondensed mb-6 text-center uppercase">
                Public Rides
            </h1>

            {loading && (
                <BiLoader className="animate-spin text-7xl mx-auto block mt-20" />
            )}

            <p className="text-red-500 text-center text-xl font-robotoCondensed">
                {error}
            </p>

            {loading || <RidesList rides={rides} />}
        </section>
    );
};

export default Rides;
