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

export type APIResponse = {
    error: boolean;
    status: number;
    data: any;
};

export type UserDetails = {
    email: string;
    username: string;
    weight: number | null;
    bikeWeight: number | null;
};

export type EditProfileFormData = {
    username: string;
    weight: number | null;
    bikeWeight: number | null;
};

export type ProfileDetails = {
    email: string;
    username: string;
    weight: number | null;
    bikeWeight: number | null;
    distanceTravelled: number;
    travelTime: number;
    elevationTravelled: number;
    avgSpeed: number;
    avgPower: number;
    avgPowerRatio: number;
    totalCalories: number;
    avgProIndex: number;
    avgWinnerIndex: number;
    routesRecorded: number;
};
