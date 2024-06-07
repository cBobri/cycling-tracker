function calculateDistance(gps1, gps2) {
    const { latitude: lat1, longitude: lon1 } = gps1;
    const { latitude: lat2, longitude: lon2 } = gps2;

    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
        return 0;
    }

    const R = 6371000; // Radius of the Earth in meters
    const rad = Math.PI / 180; // Factor to convert degrees to radians
    const phi1 = lat1 * rad;
    const phi2 = lat2 * rad;
    const deltaPhi = (lat2 - lat1) * rad;
    const deltaLambda = (lon2 - lon1) * rad;

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) *
            Math.cos(phi2) *
            Math.sin(deltaLambda / 2) *
            Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

module.exports = { calculateDistance };
