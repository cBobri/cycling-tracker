import DefaultAvatar from "../../assets/images/default_avatar.jpg";
import { useEffect, useState } from "react";
import { EditProfileFormData, ProfileDetails } from "../../Types";
import { editUserProfile, fetchUserProfile } from "../../api/auth";
import { BiCycling, BiUser } from "react-icons/bi";
import {
    FaBicycle,
    FaClock,
    FaMountainSun,
    FaRoute,
    FaScaleBalanced,
    FaWeightHanging,
} from "react-icons/fa6";
import { MdFastfood } from "react-icons/md";
import { IoMdSpeedometer } from "react-icons/io";
import { ImPower } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { formatTimeWithUnits } from "../../helpers/timeFormatters";
import clsx from "clsx";
import CircularProgressBar from "../components/circularProgressBar";
import BreadCrumbs from "../components/breadCrumbs";

const Profile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<ProfileDetails | null>(null);

    const [userForm, setUserForm] = useState<EditProfileFormData>({
        username: "",
        weight: null,
        bikeWeight: null,
    });

    const [info, setInfo] = useState("");
    const [error, setError] = useState("");

    const stats = profile
        ? [
              {
                  label: "Rides",
                  unit: " ",
                  value: profile?.routesRecorded || 0,
                  icon: <BiCycling />,
              },
              {
                  label: "Travelled",
                  unit: "km",
                  value: profile?.distanceTravelled.toFixed(2) || 0,
                  icon: <FaRoute />,
              },
              {
                  label: "Elevation",
                  unit: "m",
                  value: profile?.elevationTravelled.toFixed(0) || 0,
                  icon: <FaMountainSun />,
              },
              {
                  label: "Time Cycling",
                  unit: "",
                  value:
                      formatTimeWithUnits(profile?.travelTime * 1000 || 0) ||
                      "",
                  icon: <FaClock />,
              },
              {
                  label: "Speed",
                  unit: "km/h",
                  value: profile?.avgSpeed?.toFixed(2) || 0,
                  icon: <IoMdSpeedometer />,
              },
              {
                  label: "Power",
                  unit: "W",
                  value: profile?.avgPower?.toFixed(0) || 0,
                  icon: <ImPower />,
              },
              {
                  label: "Power Ratio",
                  unit: "W/kg",
                  value: profile?.avgPowerRatio?.toFixed(2) || 0,
                  icon: <FaScaleBalanced />,
              },
              {
                  label: "Energy",
                  unit: "kcal",
                  value: profile?.totalCalories?.toFixed(1) || 0,
                  icon: <MdFastfood />,
              },
          ]
        : [];

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetchUserProfile();

            if (!response) {
                return;
            }

            if (response.error) {
                console.log(response);
                setError(response.data);
                if (response.status === 401) {
                    navigate("/login");
                }
                return;
            }

            setProfile(response.data);
        };

        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        if (!profile) return;

        setUserForm({
            username: profile.username,
            weight: profile.weight,
            bikeWeight: profile.bikeWeight,
        });
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (["weight", "bikeWeight"].includes(e.target.name)) {
            setUserForm({
                ...userForm,
                [e.target.name]: +e.target.value || null,
            });
            return;
        }

        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userForm.username) {
            return;
        }

        const response = await editUserProfile(userForm);

        if (!response) {
            setError("Could not get a response from the server");
            return;
        }

        if (response.error) {
            setError(response.data);
            return;
        }

        const profile = response?.data;

        setProfile(profile);

        setInfo("Profile has been updated!");

        setTimeout(() => {
            setInfo("");
        }, 3000);
    };

    return (
        <>
            <section className="py-16 px-6 xl:px-2 max-w-screen-xl mx-auto w-full">
                <BreadCrumbs currentPage="Profile" depth={2} />

                <h1 className="text-primary-300 text-5xl font-semibold font-robotoCondensed mb-6 text-center uppercase">
                    Profile
                </h1>

                <form
                    className="p-5 flex gap-24 flex-wrap justify-around items-center text-xl"
                    onSubmit={handleSubmit}
                >
                    <img
                        src={DefaultAvatar}
                        alt="Avatar"
                        className="w-[350px] rounded-full"
                    />

                    <div>
                        <div className="mb-5">
                            <p className="block mb-1 font-robotoCondensed font-semibold text-2xl ">
                                E-Mail:
                            </p>
                            <p>{profile?.email}</p>
                        </div>
                        <div className="mb-5">
                            <label
                                className="block mb-1 font-robotoCondensed font-semibold text-2xl "
                                htmlFor="username"
                            >
                                Username:
                            </label>

                            <div className="flex border-2 bg-primary-200 focus-within:bg-primary-100 border-primary-200 focus-within:border-primary-100 rounded-md transition-colors">
                                <div className="text-2xl text-darkLight-200 p-2">
                                    {<BiUser />}
                                </div>

                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={userForm.username}
                                    onChange={handleChange}
                                    required
                                    className="px-3 outline-none w-[300px]"
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label
                                className="block mb-1 font-robotoCondensed font-semibold text-2xl "
                                htmlFor="weight"
                            >
                                Weight (kg):
                            </label>

                            <div className="flex border-2 bg-primary-200 focus-within:bg-primary-100 border-primary-200 focus-within:border-primary-100 rounded-md transition-colors">
                                <div className="text-darkLight-200 p-2 text-2xl ">
                                    {<FaWeightHanging />}
                                </div>

                                <input
                                    type="number"
                                    name="weight"
                                    id="weight"
                                    value={userForm.weight?.toString() || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 outline-none"
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label
                                className="block mb-1 font-robotoCondensed font-semibold text-2xl "
                                htmlFor="bikeWeight"
                            >
                                Bike Weight (kg):
                            </label>

                            <div className="flex border-2 bg-primary-200 focus-within:bg-primary-100 border-primary-200 focus-within:border-primary-100 rounded-md transition-colors">
                                <div className="text-darkLight-200 p-2 text-2xl ">
                                    {<FaBicycle />}
                                </div>

                                <input
                                    type="number"
                                    name="bikeWeight"
                                    id="bikeWeight"
                                    value={
                                        userForm.bikeWeight?.toString() || ""
                                    }
                                    onChange={handleChange}
                                    className="w-full px-3 outline-none"
                                />
                            </div>
                        </div>

                        <p className="my-3 text-primary-200 font-semibold text-center">
                            {info}
                        </p>

                        <p className="my-3 text-red-600 font-semibold text-center">
                            {error}
                        </p>

                        <button
                            type="submit"
                            className="px-4 py-3 font-semibold w-full bg-primary-200 hover:bg-primary-100 transition-colors text-darkLight-200 rounded-md"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </section>

            <section className="bg-darkLight-800">
                <div className="py-20 px-6 xl:px-2 max-w-screen-xl mx-auto text-darkLight-200">
                    <h2
                        className="text-5xl font-semibold font-robotoCondensed mb-16 uppercase text-center"
                        id="statistics"
                    >
                        Statistics
                    </h2>

                    <div className="mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stats.map(({ label, unit, icon, value }) => (
                            <article
                                className="bg-darkLight-900 border-2 mx-auto border-darkLight-600 rounded-3xl p-5 mb-5 relative w-[300px] h-[300px] flex justify-center items-center"
                                key={label}
                            >
                                <span className="mx-auto text-[200px] mb-4 text-darkLight-800 absolute">
                                    {icon}
                                </span>

                                <div className="w-full z-50">
                                    <p
                                        className={clsx(
                                            "uppercase font-robotoCondensed text-darkLight-100 text-center font-semibold",
                                            unit && "text-5xl",
                                            unit || "text-[2.25rem]"
                                        )}
                                    >
                                        {value} {unit}
                                    </p>

                                    <div className="h-[2px] my-4 bg-darkLight-500 rounded-full"></div>

                                    <h3 className="text-3xl text-darkLight-300 text-center">
                                        {label}
                                    </h3>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="flex justify-around flex-wrap gap-20 mb-20">
                        <div className="">
                            <h3 className="mb-10 text-center text-5xl uppercase font-robotoCondensed font-semibold">
                                Pro Index
                            </h3>
                            <CircularProgressBar
                                value={profile?.avgProIndex || 0}
                            />
                        </div>
                        <div className="">
                            <h3 className="mb-10 text-center text-5xl uppercase font-robotoCondensed font-semibold">
                                Winner Index
                            </h3>
                            <CircularProgressBar
                                value={profile?.avgWinnerIndex || 0}
                            />
                        </div>
                    </div>

                    <Link
                        to={"/profile/rides"}
                        className="block mx-auto w-fit text-3xl py-4 px-6 border-2 border-darkLight-200 rounded-3xl hover:bg-darkLight-200 hover:text-darkLight-900 transition-colors"
                    >
                        View your rides
                    </Link>
                </div>
            </section>
        </>
    );
};

export default Profile;
