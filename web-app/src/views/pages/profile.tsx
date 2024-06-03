import { useUserContext } from "../../userContext";
import DefaultAvatar from "../../assets/images/default_avatar.jpg";
import { useState } from "react";
import { EditableUserDetails } from "../../Types";

const Profile = () => {
    const context = useUserContext();

    console.log(context);

    const [userForm, setUserForm] = useState<EditableUserDetails>({
        username: context.user?.username || "",
        weight: context.user?.weight || null,
        bikeWeight: context.user?.bikeWeight || null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="py-16 px-6 xl:px-2 max-w-screen-xl mx-auto">
            <h1 className="text-primary-300 text-5xl font-semibold font-robotoCondensed mb-6 text-center uppercase">
                Profile
            </h1>

            <form className="p-5 flex gap-24 flex-wrap justify-around items-center">
                <img
                    src={DefaultAvatar}
                    alt="Avatar"
                    className="w-[350px] rounded-full"
                />

                <div>
                    <div>
                        <p className="block text-xl mb-1 font-robotoCondensed font-semibold">
                            E-Mail:
                        </p>
                        <p>{context.user?.email}</p>
                    </div>
                    <div>
                        <label
                            className="block text-xl mb-1 font-robotoCondensed font-semibold"
                            htmlFor="username"
                        >
                            Username:
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={userForm.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label
                            className="block text-xl mb-1 font-robotoCondensed font-semibold"
                            htmlFor="weight"
                        >
                            Weight:
                        </label>
                        <input
                            type="number"
                            name="weight"
                            id="weight"
                            value={userForm.weight?.toString() || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label
                            className="block text-xl mb-1 font-robotoCondensed font-semibold"
                            htmlFor="bikeWeight"
                        >
                            Bike Weight:
                        </label>
                        <input
                            type="number"
                            name="bikeWeight"
                            id="bikeWeight"
                            value={userForm.bikeWeight?.toString() || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
