import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRideById } from "../../api/rides";
import { BiEdit, BiLoader } from "react-icons/bi";
import Map from "../components/map";
import { formatTime } from "../../helpers/timeFormatters";
import { FaClock, FaMountain, FaRoute, FaScaleBalanced } from "react-icons/fa6";
import { IoMdSpeedometer } from "react-icons/io";
import { ImPower } from "react-icons/im";

const View = () => {
    const { id } = useParams();

    const [ride, setRide] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const stats = ride
        ? [
              {
                  label: "Travelled",
                  unit: "km",
                  value: (ride.stats?.distance / 1000).toFixed(2) || 0,
                  icon: <FaRoute />,
              },
              {
                  label: "Elevation",
                  unit: "m",
                  value: ride.stats?.elevation?.toFixed(0) || 0,
                  icon: <FaMountain />,
              },
              {
                  label: "Time",
                  unit: "",
                  value: formatTime(ride.stats?.travelTime) || "",
                  icon: <FaClock />,
              },
              {
                  label: "Speed",
                  unit: "km/h",
                  value: ride.stats?.avgSpeed?.toFixed(2) || 0,
                  icon: <IoMdSpeedometer />,
              },
              {
                  label: "Power",
                  unit: "W",
                  value: ride.stats?.power?.toFixed(0) || 0,
                  icon: <ImPower />,
              },
              {
                  label: "Power Ratio",
                  unit: "W/kg",
                  value: ride.stats?.powerRatio?.toFixed(2) || 0,
                  icon: <FaScaleBalanced />,
              },
              {
                  label: "Energy",
                  unit: "kcal",
                  value: ride.stats?.energy?.toFixed(1) || 0,
                  icon: <ImPower />,
              },
          ]
        : [];

    useEffect(() => {
        const fetchRide = async () => {
            const response = await fetchRideById(id || "");

            if (!response) {
                setError("No response from server");
                return;
            }

            if (response.error) {
                console.log(response);
                setError(response.data);
                return;
            }
            console.log(response.data);

            setRide(response.data);
            setLoading(false);
        };

        fetchRide();
    }, [id]);

    if (loading || !ride) {
        return (
            <BiLoader className="animate-spin text-7xl mx-auto block mt-20" />
        );
    }

    if (error) {
        return (
            <p className="text-red-500 text-center text-xl font-robotoCondensed">
                {error}
            </p>
        );
    }

    const coordinates = ride?.data?.map((data: any) => {
        return {
            lat: data.gps.latitude,
            lng: data.gps.longitude,
        };
    });

    const markers = [
        {
            lat: ride.data[0].gps.latitude,
            lng: ride.data[0].gps.longitude,
        },
        {
            lat: ride.data[ride.data.length - 1].gps.latitude,
            lng: ride.data[ride.data.length - 1].gps.longitude,
        },
    ];

    return (
        <>
            <section className="py-16 px-6 xl:px-2 max-w-screen-xl mx-auto">
                <h1 className="text-primary-300 text-5xl font-semibold font-robotoCondensed mb-6 uppercase flex justify-between flex-wrap">
                    <span>{ride.title}</span>
                    <button>
                        <BiEdit />
                    </button>
                </h1>

                <div className="h-[500px]">
                    <Map coordinates={coordinates} markers={markers} />
                </div>
            </section>

            <section className="bg-darkLight-800">
                <div className="py-20 px-6 xl:px-2 max-w-screen-xl mx-auto text-darkLight-200">
                    <h2
                        className="text-5xl font-semibold font-robotoCondensed mb-16 uppercase text-center"
                        id="statistics"
                    >
                        Stats
                    </h2>

                    <div className="flex justify-around gap-10 flex-wrap">
                        {stats.map(({ label, unit, value, icon }) => (
                            <article
                                key={label}
                                className="bg-darkLight-900 border-2 border-darkLight-600 rounded-3xl p-5 mb-5 relative w-[350px] h-[350px] flex flex-col justify-center items-center"
                            >
                                <p className="text-6xl uppercase font-robotoCondensed text-darkLight-100 text-center font-semibold">
                                    {value} {unit}
                                </p>

                                <div className="h-[2px] w-full my-7 bg-darkLight-500 rounded-full"></div>

                                <h3 className="text-4xl text-darkLight-300 text-center flex gap-3">
                                    {icon}
                                    <span>{label}</span>
                                </h3>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default View;
