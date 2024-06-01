import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:5000",
    baseURL: "https://cycling-tracker-bobri-fe58b44c0738.herokuapp.com",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
