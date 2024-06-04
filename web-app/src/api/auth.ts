import api from "./service";
import {
    APIResponse,
    EditProfileFormData,
    LoginFormData,
    RegisterFormData,
} from "../Types";

export const registerUser = async (
    formData: RegisterFormData
): Promise<APIResponse> => {
    try {
        const response = await api.post("/users/register", formData);

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

export const loginUser = async (
    formData: LoginFormData
): Promise<APIResponse> => {
    try {
        const response = await api.post("/users/login", formData);

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

export const fetchUserDetails = async (): Promise<APIResponse> => {
    try {
        const response = await api.get("/users/details");

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

export const fetchUserProfile = async (): Promise<APIResponse> => {
    try {
        const response = await api.get("/users/profile");

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

export const editUserProfile = async (
    formData: EditProfileFormData
): Promise<APIResponse> => {
    try {
        console.log(formData);
        const response = await api.put("/users/profile", formData);

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
