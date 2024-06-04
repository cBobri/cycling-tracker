import api from "./service";
import { APIResponse } from "../Types";

export const fetchUserRides = async (): Promise<APIResponse> => {
    try {
        const response = await api.get("/routes/user");

        return {
            error: false,
            status: response.status,
            data: response.data,
        };
    } catch (err: any) {
        console.log(err);

        return {
            error: true,
            status: err.response.status,
            data: err.response.data.message,
        };
    }
};

export const fetchPublicRides = async (): Promise<APIResponse> => {
    try {
        const response = await api.get("/routes");

        return {
            error: false,
            status: response.status,
            data: response.data,
        };
    } catch (err: any) {
        console.log(err);

        return {
            error: true,
            status: err.response.status,
            data: err.response.data.message,
        };
    }
};
