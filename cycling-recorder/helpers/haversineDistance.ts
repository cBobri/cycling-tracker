export const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

export const haversineDistance = (coords1: any, coords2: any): number => {
    const R = 6371e3; // Radius of the Earth in meters
    const lat1 = toRadians(coords1.latitude);
    const lat2 = toRadians(coords2.latitude);
    const deltaLat = toRadians(coords2.latitude - coords1.latitude);
    const deltaLon = toRadians(coords2.longitude - coords1.longitude);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};
