const RouteModel = require('../models/routeModel');
const calculateWattage = require('./calculateWattage');

async function processRoute(routeId) {
    try {
        const route = await RouteModel.findById(routeId);
        if (!route) {
            throw new Error('Route not found');
        }

        let { data } = route;

        if (data.length < 2) {
            throw new Error('Not enough data points to process');
        }

        const numEntries = data.length;
        const quartileSize = Math.ceil(numEntries / 4);

        const stats = {
            distance: 0,
            elevation: 0,
            travelTime: 0,
            power: 0,
            energy: 0
        };

        const quartiles = [
            { distance: 0, elevation: 0, travelTime: 0, power: 0, energy: 0 },
            { distance: 0, elevation: 0, travelTime: 0, power: 0, energy: 0 },
            { distance: 0, elevation: 0, travelTime: 0, power: 0, energy: 0 },
            { distance: 0, elevation: 0, travelTime: 0, power: 0, energy: 0 }
        ];

        for (let i = 1; i < data.length; i++) {
            const prev = data[i - 1];
            const curr = data[i];

            if (!curr.moving) {
                continue;
            }

            const dist = calculateDistance(prev.gps, curr.gps);
            const elev = Math.max(0, curr.gps.altitude - prev.gps.altitude);
            const time = new Date(curr.timestamp) - new Date(prev.timestamp);

            stats.distance += dist;
            stats.elevation += elev;
            stats.travelTime += time;

            const quartileIndex = Math.floor(i / quartileSize);
            quartiles[quartileIndex].distance += dist;
            quartiles[quartileIndex].elevation += elev;
            quartiles[quartileIndex].travelTime += time;

            if ((i + 1) % quartileSize === 0 || i === data.length - 1) {
                const quartile = quartiles[quartileIndex];
                const { power, energy } = calculateWattage(
                    quartile.distance,
                    quartile.elevation,
                    quartile.travelTime / 1000,
                    route.cyclistWeight,
                    route.pro
                );
                quartile.power = power / quartileSize;
                quartile.energy = energy / quartileSize;
            }
        }

        const { power, energy } = calculateWattage(
            stats.distance,
            stats.elevation,
            stats.travelTime / 1000,
            route.cyclistWeight,
            route.pro
        );
        stats.power = power / numEntries;
        stats.energy = energy / numEntries;

       
        stats.avgSpeed = (stats.distance / (stats.travelTime / 1000)) * 3.6;
        quartiles.forEach(q => {
            q.avgSpeed = (q.distance / (q.travelTime / 1000)) * 3.6; 
        });

        const percentages = [25, 50, 75, 100];
        const percentageStats = percentages.map(percentage => {
            const endIndex = Math.floor((percentage / 100) * numEntries);
            const subset = data.slice(0, endIndex);

            const subsetStats = {
                distance: 0,
                elevation: 0,
                travelTime: 0,
                power: 0,
                energy: 0
            };

            subset.forEach((curr, index) => {
                if (index === 0 || !curr.moving) return;
                const prev = subset[index - 1];

                const dist = calculateDistance(prev.gps, curr.gps);
                const elev = Math.max(0, curr.gps.altitude - prev.gps.altitude);
                const time = new Date(curr.timestamp) - new Date(prev.timestamp);

                subsetStats.distance += dist;
                subsetStats.elevation += elev;
                subsetStats.travelTime += time;
            });

            const { power, energy } = calculateWattage(
                subsetStats.distance,
                subsetStats.elevation,
                subsetStats.travelTime / 1000,
                route.cyclistWeight,
                route.pro
            );
            subsetStats.power = power / subset.length;
            subsetStats.energy = energy / subset.length;

            subsetStats.avgSpeed = (subsetStats.distance / (subsetStats.travelTime / 1000)) * 3.6;

            return subsetStats;
        });

        route.stats = stats;
        route.q1 = quartiles[0];
        route.q2 = quartiles[1];
        route.q3 = quartiles[2];
        route.q4 = quartiles[3];
        route.percentageStats = percentageStats;
        route.isProcessed = true;

        await route.save();
        console.log('Route processed successfully');
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
