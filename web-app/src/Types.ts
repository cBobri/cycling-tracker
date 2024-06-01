export type FormControl<FormData> = {
    label: string;
    name: keyof FormData;
    type: "text" | "email" | "password" | "textarea" | "file";
    error: string | null;
    check: (data: FormData) => string | null;
};

export type RegisterFormData = {
    email: string;
    username: string;
    password: string;
    passwordRepeat: string;
};

export type LoginFormData = {
    email_username: string;
    password: string;
};
