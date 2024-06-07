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

export const fetchRideById = async (id: string): Promise<APIResponse> => {
    try {
        const response = await api.get(`/routes/${id}`);

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

export const editRide = async (formData: any): Promise<APIResponse> => {
    try {
        const response = await api.put("/routes", formData);

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

export const importRide = async (formData: any): Promise<APIResponse> => {
    try {
        const response = await api.post("/routes/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

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
            data: err.response.data,
        };
    }
};
