import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL: "http://192.168.0.20:5000",
    // baseURL: "https://cycling-tracker-bobri-fe58b44c0738.herokuapp.com",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const djangoApi = axios.create({
    baseURL: "https://face-authentication-cbobri-5b555f4980ee.herokuapp.com/",
    headers: {
        "Content-Type": "application/json",
    },
});

djangoApi.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            console.log("token", token);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const localApi = axios.create({
    baseURL: "http://192.168.31.229:8000/",
    headers: {
        "Content-Type": "application/json",
    },
});
localApi.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setToken = async (token: any) => {
    await AsyncStorage.setItem("token", token);
};

export { api, djangoApi, localApi };
