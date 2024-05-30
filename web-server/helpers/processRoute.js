const mongoose = require('mongoose');
const RouteModel = require('../models/routeModel');

async function processRoute(routeId) {
    try {
        const route = await RouteModel.findById(routeId);
        if (!route) {
            throw new Error('Route not found');
        }

        let { data } = route;
        data = data.filter(entry => entry.moving);

        if (data.length < 2) {
            throw new Error('Not enough data points to process');
        }

        const numEntries = data.length;
        const quartileSize = Math.ceil(numEntries / 4);

        const stats = {
            distance: 0,
            elevation: 0,
            travelTime: 0
        };

        const quartiles = [
            { distance: 0, elevation: 0, travelTime: 0 },
            { distance: 0, elevation: 0, travelTime: 0 },
            { distance: 0, elevation: 0, travelTime: 0 },
            { distance: 0, elevation: 0, travelTime: 0 }
        ];

        for (let i = 1; i < data.length; i++) {
            const prev = data[i - 1];
            const curr = data[i];

            const dist = calculateDistance(prev.gps, curr.gps);
            const elev = Math.max(0, curr.gps.altitude - prev.gps.altitude);
            const time = (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;

            stats.distance += dist;
            stats.elevation += elev;
            stats.travelTime += time;

            const quartileIndex = Math.floor(i / quartileSize);
            quartiles[quartileIndex].distance += dist;
            quartiles[quartileIndex].elevation += elev;
            quartiles[quartileIndex].travelTime += time;
        }

        stats.avgSpeed = stats.distance / (stats.travelTime / 3600);

        quartiles.forEach(q => {
            q.avgSpeed = q.distance / (q.travelTime / 3600);
        });
    } catch (err) {
        console.error(err);
    }
}

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

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

module.exports = processRoute;
