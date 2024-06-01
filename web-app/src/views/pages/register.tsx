import { useState } from "react";
import { BiAt, BiSolidKey, BiUser } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { APIResponse, FormControl, RegisterFormData } from "../../Types";
import { registerUser } from "../../api/auth";

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
        <div className="py-20 px-4 sm:px-10 max-w-screen-xl mx-auto">
            <form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto flex flex-col gap-5 p-5 border-2 border-primary-200 rounded-xl shadow-lg mb-10"
            >
                <h1 className="text-center text-3xl font-robotoCondensed font-semibold uppercase text-primary-300">
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

                        <div className="flex border-2 border-primary-300 rounded-md">
                            <div className="text-2xl bg-primary-300 text-darkLight-200 p-2">
                                {getIcon(formControl.name)}
                            </div>

                            <input
                                type={formControl.type}
                                id={formControl.name}
                                name={formControl.name}
                                value={formData[formControl.name]}
                                placeholder={formControl.label}
                                onChange={(e) => handleChange(e, formControl)}
                                className="w-full px-3 outline-none focus:bg-darkLight-100"
                            />
                        </div>

                        <p className="mt-2 text-red-500 font-semibold text-center">
                            {formControl.error}
                        </p>
                    </div>
                ))}

                <p className="mt-1 text-red-500 font-semibold text-center">
                    {error}
                </p>

                <button
                    type="submit"
                    className="p-3 mt-6 uppercase font-semibold text-xl text-darkLight-200 rounded-md bg-primary-200 hover:bg-primary-300 transition-colors"
                >
                    Sign Up
                </button>
            </form>

            <section className="text-center text-lg">
                <p>Already have an account?</p>
                <Link
                    to="/login"
                    className="font-semibold text-primary-100 hover:underline"
                >
                    Log In Here
                </Link>
            </section>
        </div>
    );
};

export default Register;
