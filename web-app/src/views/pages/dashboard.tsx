import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../userContext";
import { BiUser } from "react-icons/bi";
import { FaBicycle, FaRoute } from "react-icons/fa6";
import { useState } from "react";
import { importRide } from "../../api/rides";

interface FormData {
    title: string;
    description: string;
    cyclistWeight: number | null;
    bikeWeight: number | null;
    isPublic: boolean;
    gpxFile: undefined | File;
}

const Dashboard = () => {
    const context = useUserContext();
    const navigate = useNavigate();

    const [form, setForm] = useState<FormData>({
        title: "",
        description: "",
        cyclistWeight: null,
        bikeWeight: null,
        isPublic: false,
        gpxFile: undefined,
    });

    const [formError, setFormError] = useState("");
    const [info, setInfo] = useState("");

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setForm({
            ...form,
            gpxFile: file,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.title) {
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("cyclistWeight", String(form.cyclistWeight));
        formData.append("bikeWeight", String(form.bikeWeight));
        formData.append("isPublic", String(form.isPublic));
        if (form.gpxFile) {
            formData.append("gpxFile", form.gpxFile);
        }

        const response = await importRide(formData);

        if (!response) {
            setFormError("Could not get a response from the server");
            return;
        }

        if (response.error) {
            setFormError(response.data.message);
            return;
        }

        setInfo(response.data.message);
        setTimeout(() => {
            navigate(`/view/${response.data.id}`);
        }, 2000);
    };

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
            </nav>

            <form
                className="p-5 max-w-lg mx-auto mt-20"
                onSubmit={handleSubmit}
            >
                <h2 className="text-center font-robotoCondensed text-4xl uppercase font-semibold mb-6">
                    Import GPX
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
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="shadow-md p-2 border-b-2 border-primary-300 focus:border-primary-100 focus:bg-darkLight-100 outline-none text-lg w-full transition-colors"
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
                        placeholder="Description"
                        onChange={handleChange}
                        value={form.description}
                        className="shadow-md p-2 border-b-2 border-primary-300 focus:border-primary-100 focus:bg-darkLight-100 outline-none text-lg w-full transition-colors"
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
                        placeholder="Your weight"
                        value={form.cyclistWeight || ""}
                        onChange={handleChange}
                        className="shadow-md p-2 border-b-2 border-primary-300 focus:border-primary-100 focus:bg-darkLight-100 outline-none text-lg w-full transition-colors"
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
                        placeholder="Your bike's weight"
                        value={form.bikeWeight || ""}
                        onChange={handleChange}
                        className="shadow-md p-2 border-b-2 border-primary-300 focus:border-primary-100 focus:bg-darkLight-100 outline-none text-lg w-full transition-colors"
                    />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="gpxFile"
                        className="block mb-1 text-xl font-robotoCondensed font-semibold"
                    >
                        GPX File:
                    </label>
                    <input
                        type="file"
                        id="gpxFile"
                        name="gpxFile"
                        accept=".gpx"
                        onChange={handleFileChange}
                        className="shadow-md p-2 border-b-2 border-primary-300 focus:border-primary-100 focus:bg-darkLight-100 outline-none text-lg w-full transition-colors"
                    />
                </div>

                <p className="my-3 font-semibold text-center">{info}</p>

                <p className="my-3 text-red-600 font-semibold text-center">
                    {formError}
                </p>

                <button
                    type="submit"
                    className="w-full mt-6 p-4 border-2 text-xl uppercase font-semibold bg-primary-300 text-darkLight-200 hover:bg-primary-200 rounded-xl transition-colors duration-300"
                >
                    Import
                </button>
            </form>
        </section>
    );
};

export default Dashboard;
