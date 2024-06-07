import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { editRide, fetchRideById } from "../../api/rides";
import { BiEdit, BiLoader } from "react-icons/bi";
import Map from "../components/map";
import { formatTime } from "../../helpers/timeFormatters";
import { FaClock, FaMountain, FaRoute, FaScaleBalanced } from "react-icons/fa6";
import { IoMdSpeedometer } from "react-icons/io";
import { ImPower } from "react-icons/im";
import clsx from "clsx";
import CircularProgressBar from "../components/circularProgressBar";
import AltitudeLineChart from "../components/altitudeLineChart";
import StatsLineChart from "../components/statsLineChart";

const View = () => {
    const { id } = useParams();

    const [ride, setRide] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        cyclistWeight: null,
        bikeWeight: null,
        isPublic: false,
    });
    const [formError, setFormError] = useState("");
    const [info, setInfo] = useState("");

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

            setRide(response.data);
            console.log(response.data);

            const { title, description, cyclistWeight, bikeWeight, isPublic } =
                response.data;

            setForm({
                title,
                description,
                cyclistWeight,
                bikeWeight,
                isPublic,
            });

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

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        if (["weight", "bikeWeight"].includes(e.target.name)) {
            setForm({
                ...form,
                [e.target.name]: +e.target.value || null,
            });
            return;
        }

        if (e.target.name === "public") {
            setForm({
                ...form,
                isPublic: !form.isPublic,
            });
            return;
        }

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.title) {
            return;
        }

        const response = await editRide({
            ...form,
            id: ride._id,
        });

        if (!response) {
            setFormError("Could not get a response from the server");
            return;
        }

        if (response.error) {
            setFormError(response.data);
            return;
        }

        const updatedRide = response?.data;

        setRide(updatedRide);

        setInfo("Ride has been updated!");

        setTimeout(() => {
            setInfo("");
        }, 3000);

        setEditing(false);
    };

    const getRaceDetailsString = (race: any) => {
        const formattedDate = new Date(race.date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        return `${race.distance} KM | ${race.verticalMeters} M Altitude | ${formattedDate}`;
    };

    return (
        <>
            <section className="py-10 px-6 xl:px-2 max-w-screen-xl mx-auto">
                <h1 className="text-darkLight-800 text-5xl font-semibold font-robotoCondensed mb-3 uppercase flex justify-between flex-wrap">
                    <span>{ride.title}</span>
                    {ride.editable && (
                        <button
                            aria-label="Open edit modal"
                            onClick={() => setEditing(true)}
                        >
                            <BiEdit />
                        </button>
                    )}
                </h1>

                <p className="text-xl text-darkLight-700">
                    {ride.description || "No description set..."}
                </p>
            </section>

            <section className={clsx("h-[600px]")}>
                <Map
                    coordinates={coordinates}
                    markers={markers}
                    center={ride.centerCoordinates}
                />
            </section>

            <section className="bg-darkLight-100">
                <div className="py-20 px-6 xl:px-2 max-w-screen-xl mx-auto">
                    <h2
                        className="text-5xl font-semibold font-robotoCondensed mb-16 uppercase text-center"
                        id="statistics"
                    >
                        Stats
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 flex-wrap">
                        {stats.map(({ label, unit, value, icon }) => (
                            <article
                                key={label}
                                className="flex items-center justify-center gap-5 p-5 border-b-2 border-darkLight-400"
                            >
                                <span className="text-6xl text-primary-200">
                                    {icon}
                                </span>
                                <p className="text-5xl uppercase font-robotoCondensed text-darkLight-700 font-semibold">
                                    {value} {unit}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-darkLight-800 text-darkLight-200">
                <div className="py-20 px-6 xl:px-2 max-w-screen-xl mx-auto">
                    <div className="flex justify-around flex-wrap gap-20 mb-20">
                        <div className="">
                            <h3 className="mb-10 text-center text-5xl uppercase font-robotoCondensed font-semibold">
                                Pro Index
                            </h3>
                            <CircularProgressBar value={ride.proIndex} />
                        </div>
                        <div className="">
                            <h3 className="mb-10 text-center text-5xl uppercase font-robotoCondensed font-semibold">
                                Winner Index
                            </h3>
                            <CircularProgressBar value={ride.winnerIndex} />
                        </div>
                    </div>

                    <h3 className="mb-10 text-center text-5xl uppercase font-robotoCondensed font-semibold">
                        Referenced Races
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
                        {ride.referencedRaces.map((race: any) => (
                            <div
                                key={race._id}
                                className="bg-darkLight-700 p-5 rounded-lg shadow-md"
                            >
                                <h3 className="text-2xl font-semibold">
                                    {race.name}
                                </h3>

                                <p className="text-xl font-robotoCondensed text-darkLight-400 font-semibold mb-6">
                                    {getRaceDetailsString(race)}
                                </p>

                                <div className="flex justify-start gap-10 flex-wrap">
                                    <div>
                                        <p className="font-semibold">
                                            Average stats:
                                        </p>
                                        <ul className="list-disc ml-6">
                                            <li>
                                                {race.averageWattage.power.toFixed(
                                                    0
                                                )}{" "}
                                                W
                                            </li>
                                            <li>
                                                {race.averageWattage.powerRatio.toFixed(
                                                    1
                                                )}{" "}
                                                W/kg
                                            </li>
                                            <li>
                                                {race.averageWattage.energy.toFixed(
                                                    0
                                                )}{" "}
                                                kcal
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-semibold">
                                            {race.winner}:
                                        </p>
                                        <ul className="list-disc ml-6">
                                            <li>
                                                {race.winnerWattage.power.toFixed(
                                                    0
                                                )}{" "}
                                                W
                                            </li>
                                            <li>
                                                {race.winnerWattage.powerRatio.toFixed(
                                                    1
                                                )}{" "}
                                                W/kg
                                            </li>
                                            <li>
                                                {race.winnerWattage.energy.toFixed(
                                                    0
                                                )}{" "}
                                                kcal
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-darkLight-100">
                <div className="py-20 px-6 xl:px-2 max-w-screen-xl mx-auto">
                    <h2
                        className="text-5xl font-semibold font-robotoCondensed mb-16 uppercase text-center"
                        id="statistics"
                    >
                        Details
                    </h2>

                    <div className="mb-10">
                        <AltitudeLineChart data={ride.data} />
                    </div>

                    <div className="mb-10">
                        <StatsLineChart data={ride.percentageStats} />
                    </div>
                </div>
            </section>

            {editing && (
                <>
                    <div
                        className="fixed top-0 left-0 z-40 w-screen h-screen bg-black bg-opacity-50"
                        onClick={() => setEditing(false)}
                    ></div>
                    <form
                        className="fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 bg-primary-300 z-50 rounded-2xl shadow-md p-5 text-darkLight-200"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-center font-robotoCondensed text-4xl uppercase font-semibold mb-6">
                            Edit Ride
                        </h2>

                        <div className="mb-5">
                            <label
                                htmlFor="public"
                                className="mb-1 mr-2 text-xl font-robotoCondensed font-semibold"
                            >
                                Public:
                            </label>
                            <input
                                type="checkbox"
                                name="public"
                                id="public"
                                checked={form.isPublic}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="title"
                                className="block mb-1 text-xl font-robotoCondensed font-semibold"
                            >
                                Title:
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={form.title}
                                onChange={handleChange}
                                className="bg-darkLight-900 p-2 rounded-md border-2 border-primary-200 focus:border-primary-100 outline-none text-lg min-w-[400px] transition-colors"
                            />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="description"
                                className="block mb-1 text-xl font-robotoCondensed font-semibold"
                            >
                                Description:
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                onChange={handleChange}
                                value={form.description}
                                className="bg-darkLight-900 p-2 rounded-md border-2 border-primary-200 focus:border-primary-100 outline-none text-lg min-w-[400px] transition-colors"
                            ></textarea>
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="cyclistWeight"
                                className="block mb-1 text-xl font-robotoCondensed font-semibold"
                            >
                                Your Weight (kg):
                            </label>
                            <input
                                type="number"
                                name="cyclistWeight"
                                id="cyclistWeight"
                                value={form.cyclistWeight || ""}
                                onChange={handleChange}
                                className="bg-darkLight-900 p-2 rounded-md border-2 border-primary-200 focus:border-primary-100 outline-none text-lg min-w-[400px] transition-colors"
                            />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="bikeWeight"
                                className="block mb-1 text-xl font-robotoCondensed font-semibold"
                            >
                                Bike Weight (kg):
                            </label>
                            <input
                                type="number"
                                name="bikeWeight"
                                id="bikeWeight"
                                value={form.bikeWeight || ""}
                                onChange={handleChange}
                                className="bg-darkLight-900 p-2 rounded-md border-2 border-primary-200 focus:border-primary-100 outline-none text-lg min-w-[400px] transition-colors"
                            />
                        </div>

                        <p className="my-3 text-darkLight-200 font-semibold text-center">
                            {info}
                        </p>

                        <p className="my-3 text-red-600 font-semibold text-center">
                            {formError}
                        </p>

                        <button
                            type="submit"
                            className="w-full mt-6 p-4 border-2 text-xl uppercase font-semibold border-darkLight-200 hover:bg-darkLight-200 hover:text-darkLight-900 rounded-md transition-colors duration-300"
                        >
                            Apply Changes
                        </button>
                    </form>
                </>
            )}
        </>
    );
};

export default View;
