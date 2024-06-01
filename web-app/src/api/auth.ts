import api from "./service";
import { APIResponse, LoginFormData, RegisterFormData } from "../Types";

export const registerUser = async (
    formData: RegisterFormData
): Promise<APIResponse> => {
    try {
        const res = await api.post("/users/register", formData);

        return {
            error: false,
            data: res.data,
        };
    } catch (err: any) {
        console.log(err);

        return {
            error: true,
            data: err.response.data.message,
        };
    }
};

export const loginUser = async (
    formData: LoginFormData
): Promise<APIResponse> => {
    try {
        const res = await api.post("/users/login", formData);

        return {
            error: false,
            data: res.data,
        };
    } catch (err: any) {
        console.log(err);

        return {
            error: true,
            data: err.response.data.message,
        };
    }
};

export const fetchUserDetails = async (): Promise<APIResponse> => {
    try {
        const response = await api.get("/users/details");

        return {
            error: false,
            data: response.data,
        };
    } catch (err: any) {
        console.log(err);
        return {
            error: true,
            data: err.response.data.message,
        };
    }
};
