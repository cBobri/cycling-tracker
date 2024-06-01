import { useState } from "react";
import { FormControl, LoginFormData } from "../../Types";
import { BiSolidKey, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";

type FormData = LoginFormData;

const Login = () => {
    const [formData, setFormData] = useState<FormData>({
        email_username: "",
        password: "",
    });

    const [error, setError] = useState("");

    const [formControls, setFormControls] = useState<
        Array<FormControl<FormData>>
    >([
        {
            label: "Username or E-mail",
            name: "email_username",
            type: "text",
            error: null,
            check: ({ email_username }) => {
                if (email_username.trim() === "") return "Field is empty!";
                return null;
            },
        },
        {
            label: "Password",
            name: "password",
            type: "password",
            error: null,
            check: ({ password }) => {
                if (password === "") return "Field is empty!";
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
            (formControl) => formControl.error !== null
        );

        if (hasError) return;

        console.log("log in", formData);

        //const { error, data } = await loginUser(formData);

        // if (error) {
        //     setError(data);
        //     console.log(error, data);
        //     return;
        // }

        // setUserData(data.username);
        // localStorage.setItem("token", data.token);
        // navigate("/");
    };

    const getIcon = (name: keyof FormData) => {
        if (name === "email_username") {
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
                    Login
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

                        {formControl.error ? (
                            <p className="mt-1 text-red-500 font-semibold">
                                {formControl.error}
                            </p>
                        ) : (
                            ""
                        )}
                    </div>
                ))}

                {error !== "" && (
                    <p className="mt-1 text-red-500 font-semibold">{error}</p>
                )}

                <button
                    type="submit"
                    className="p-3 mt-6 uppercase font-semibold text-xl text-darkLight-200 rounded-md bg-primary-200 hover:bg-primary-300 transition-colors"
                >
                    Sign In
                </button>
            </form>

            <section className="text-center text-lg">
                <p>Don't have an account?</p>
                <Link
                    to="/register"
                    className="font-semibold text-primary-100 hover:underline"
                >
                    Register Here
                </Link>
            </section>
        </div>
    );
};

export default Login;
