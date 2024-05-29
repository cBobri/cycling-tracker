export type GPSData = {
    latitude: number;
    longitude: number;
    altitude: number;
};

export type magnitudeSensorsData = {
    ax: number;
    ay: number;
    az: number;
    gx: number;
    gy: number;
    gz: number;
};

export type magnitudeData = {
    value: number;
    level: number | null;
    data: magnitudeSensorsData[];
};

export type dataEntry = {
    timestamp: number;
    gps: GPSData;
    magnitude: magnitudeData | null;
    moving: boolean;
};

export type Route = {
    recordingStart: Date;
    recordingEnd: Date;
    distance: number;
    data: dataEntry[];
};

// Type guard function to check if an object is of type GPSData
export const isGPSData = (data: any): data is GPSData => {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof data.latitude === "number" &&
        typeof data.longitude === "number" &&
        typeof data.altitude === "number"
    );
};
