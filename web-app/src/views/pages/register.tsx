import { useState } from "react";
import { BiAt, BiSolidKey, BiUser } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { APIResponse, FormControl, RegisterFormData } from "../../Types";
import { registerUser } from "../../api/auth";
import clsx from "clsx";

type FormData = RegisterFormData;

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        email: "",
        username: "",
        password: "",
        passwordRepeat: "",
    });

    const [error, setError] = useState("");

    const [formControls, setFormControls] = useState<
        Array<FormControl<FormData>>
    >([
        {
            label: "E-Mail",
            name: "email",
            type: "text",
            error: null,
            check: (data) => {
                if (data.email.trim() === "") return "Field is empty!";

                const regex =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!regex.test(data.email)) return "Invalid E-Mail address!";

                return null;
            },
        },
        {
            label: "Username",
            name: "username",
            type: "text",
            error: null,
            check: (data) => {
                if (data.username.trim() === "") return "Field is empty!";
                return null;
            },
        },
        {
            label: "Password",
            name: "password",
            type: "password",
            error: null,
            check: (data) => {
                if (data.password === "") return "Field is empty!";
                return null;
            },
        },
        {
            label: "Repeat Password",
            name: "passwordRepeat",
            type: "password",
            error: null,
            check: (data) => {
                if (data.password !== data.passwordRepeat)
                    return "Passwords don't match!";
                return null;
            },
        },
    ]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        formControl: FormControl<FormData>
    ) => {
        const updatedFormData = {
            ...formData,
            [formControl.name]: e.target.value,
        };
        setFormData(updatedFormData);

        const newFormControl = formControl;
        newFormControl.error = formControl.check(updatedFormData);

        const index = formControls.findIndex(
            (control) => control.name === formControl.name
        );

        if (index !== -1) {
            const updatedFormControls = [...formControls];
            updatedFormControls[index] = newFormControl;
            setFormControls(updatedFormControls);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedFormControls = formControls.map((formControl) => ({
            ...formControl,
            error: formControl.check(formData),
        }));

        setFormControls(updatedFormControls);

        const hasError = updatedFormControls.some(
            (formControl) => formControl.error
        );

        if (hasError) return;

        console.log("send request", formData);

        const response: APIResponse = await registerUser(formData);

        if (!response) {
            setError("Could not get a response from the server");
            return;
        }

        if (response.error) {
            setError(response.data);
            return;
        }

        navigate("/login");
    };

    const getIcon = (name: keyof FormData) => {
        if (name === "email") {
            return <BiAt />;
        }

        if (name === "username") {
            return <BiUser />;
        }

        return <BiSolidKey />;
    };

    return (
        <section className="background-image-section">
            <div className="bg-darkLight-900 bg-opacity-25 ">
                <div className="py-20 px-4 sm:px-10 max-w-screen-xl mx-auto text-darkLight-200">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-darkLight-900 bg-opacity-80 max-w-lg mx-auto flex flex-col gap-4 p-5 rounded-xl shadow-md mb-10 border-2 border-darkLight-600"
                    >
                        <h1 className="text-center text-3xl font-robotoCondensed font-semibold uppercase text-primary-50">
                            Register
                        </h1>

                        {formControls.map((formControl) => (
                            <div key={formControl.name}>
                                <label
                                    htmlFor={formControl.name}
                                    className="block text-xl mb-1 font-robotoCondensed font-semibold"
                                >
                                    {formControl.label}:
                                </label>

                                <div
                                    className={clsx(
                                        formControl.error &&
                                            "bg-red-700 border-red-700",
                                        !formControl.error &&
                                            "bg-primary-100 border-primary-100",
                                        "flex border-2 bg-primary-100 focus-within:bg-primary-50 border-primary-100 focus-within:border-primary-50 rounded-md transition-colors"
                                    )}
                                >
                                    <div className="text-2xl text-darkLight-200 p-2">
                                        {getIcon(formControl.name)}
                                    </div>

                                    <input
                                        type={formControl.type}
                                        id={formControl.name}
                                        name={formControl.name}
                                        value={formData[formControl.name]}
                                        placeholder={formControl.label}
                                        onChange={(e) =>
                                            handleChange(e, formControl)
                                        }
                                        className="w-full px-3 outline-none bg-darkLight-900"
                                    />
                                </div>

                                <p className="mt-2 text-red-600 text-center">
                                    {formControl.error}
                                </p>
                            </div>
                        ))}

                        <p className="mt-1 text-red-600 font-semibold text-center">
                            {error}
                        </p>

                        <button
                            type="submit"
                            className="p-3 mt-6 uppercase font-semibold text-xl text-darkLight-200 rounded-md bg-primary-100 hover:bg-primary-50 transition-colors"
                        >
                            Sign Up
                        </button>

                        <section className="text-center text-lg">
                            <p>Already have an account?</p>
                            <Link
                                to="/login"
                                className="font-semibold text-primary-50 hover:underline"
                            >
                                Log In Here
                            </Link>
                        </section>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;
