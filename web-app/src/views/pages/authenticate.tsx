import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiURL } from "../../Constants";
import { useUserContext } from "../../userContext";

const Authenticate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { setUserData } = useUserContext();

    const [status, setStatus] = useState<boolean | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const eventSource = new EventSource(`${apiURL}/auth/listen/${id}`);

        eventSource.onmessage = (event) => {
            const { status, user, token, message } = JSON.parse(event.data);

            if (!status) {
                setStatus(status);
                setMessage(message);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setUserData(user);
                localStorage.setItem("token", token);
                navigate("/dashboard");
            }
        };

        return () => {
            eventSource.close();
        };
    }, [id, navigate, setUserData]);

    if (status === false) {
        return (
            <div className="py-20 px-4 sm:px-10 max-w-screen-xl mx-auto">
                <h1 className="text-center mb-10 text-4xl">
                    Authentication required
                </h1>
                <p className="text-center text-lg text-red-600">{message}</p>
            </div>
        );
    }

    return (
        <div className="py-20 px-4 sm:px-10 max-w-screen-xl mx-auto">
            <h1 className="text-center mb-10 text-4xl">
                Authentication required
            </h1>
            <p className="text-center text-lg">
                Please open your mobile application and authenticate your face.
                Do not close this tab.
            </p>
        </div>
    );
};

export default Authenticate;
