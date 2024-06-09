const RouteModel = require("../models/routeModel");
const { calculateDistance } = require("./calculateDistance");
const calculateWattage = require("./calculateWattage");
const getSimilarRaces = require("./getSimilarRaces");

async function processRoute(routeId) {
    try {
        const route = await RouteModel.findById(routeId);
        if (!route) {
            throw new Error("Route not found");
        }

        let { data } = route;

        if (data.length < 2) {
            throw new Error("Not enough data points to process");
        }

        const numEntries = data.length;
        const numSegments = 10;

        const segmentSize = Math.ceil(numEntries / numSegments);

        const segments = [];
        for (let i = 0; i < numSegments; i++) {
            segments.push({
                distance: 0,
                elevation: 0,
                travelTime: 0,
                power: 0,
                powerRatio: 0,
                energy: 0,
                maxSpeed: 0,
            });
        }

        for (let i = 1; i < data.length; i++) {
            const prev = data[i - 1];
            const curr = data[i];

            if (!curr.moving && i != data.length - 1) {
                continue;
            }

            const dist = calculateDistance(prev.gps, curr.gps);
            const elev = Math.max(0, curr.gps.altitude - prev.gps.altitude);
            const time = new Date(curr.timestamp) - new Date(prev.timestamp);
            const seconds = time / 1000;
            const speed = (dist / seconds) * 3.6;

            const segmentIndex = Math.floor(i / segmentSize);
            const segment = segments[segmentIndex];
            segment.distance += dist;
            segment.elevation += elev;
            segment.travelTime += time;

            segment.maxSpeed = Math.max(segment.maxSpeed, speed);

            if ((i + 1) % segmentSize === 0 || i === data.length - 1) {
                const firstEntry = data[segmentIndex * segmentSize];
                const lastEntry = curr;
                const elevationDiff =
                    lastEntry.gps.altitude - firstEntry.gps.altitude;
                const { power, powerRatio, energy } = calculateWattage(
                    segment.distance,
                    elevationDiff,
                    segment.travelTime / 1000,
                    route.cyclistWeight,
                    route.bikeWeight
                );
                segment.power = power;
                segment.powerRatio = powerRatio;
                segment.energy = energy;
            }
        }

        const centerCalculations = {
            minLat: Infinity,
            maxLat: 0,
            minLong: Infinity,
            maxLong: 0,
        };

        const center = {
            latitude: 0,
            longitude: 0,
        };

        data.forEach((entry) => {
            centerCalculations.minLat = Math.min(
                entry.gps.latitude,
                centerCalculations.minLat
            );
            centerCalculations.minLong = Math.min(
                entry.gps.longitude,
                centerCalculations.minLong
            );
            centerCalculations.maxLat = Math.max(
                entry.gps.latitude,
                centerCalculations.maxLat
            );
            centerCalculations.maxLong = Math.max(
                entry.gps.longitude,
                centerCalculations.maxLong
            );
        });

        center.latitude =
            (centerCalculations.minLat + centerCalculations.maxLat) / 2;
        center.longitude =
            (centerCalculations.minLong + centerCalculations.maxLong) / 2;

        segments.forEach((s) => {
            s.avgSpeed = (s.distance / (s.travelTime / 1000)) * 3.6;
        });

        const percentageStats = [];

        for (let i = 0; i < segments.length; i++) {
            const stats = {
                distance: 0,
                elevation: 0,
                travelTime: 0,
                power: 0,
                powerRatio: 0,
                energy: 0,
                avgSpeed: 0,
                maxSpeed: 0,
            };

            for (let j = 0; j <= i; j++) {
                const segment = segments[j];

                for (const key in segment) {
                    if (key === "maxSpeed") continue;

                    stats[key] += segment[key];
                }

                stats.maxSpeed = Math.max(stats.maxSpeed, segment.maxSpeed);
            }

            stats.avgSpeed /= i + 1;
            stats.power /= i + 1;
            stats.powerRatio /= i + 1;

            percentageStats.push(stats);
        }

        route.centerCoordinates = {
            longitude: center.longitude,
            latitude: center.latitude,
        };

        route.stats = percentageStats[percentageStats.length - 1];
        route.percentageStats = percentageStats;
        route.segments = segments;
        route.isProcessed = true;

        const similarRaces = await getSimilarRaces(route);

        if (similarRaces && similarRaces.length > 0) {
            route.referencedRaces = similarRaces.map((race) => race._id);

            let totalWinnerPowerRatio = 0;
            let totalAvgPowerRatio = 0;
            for (let race of similarRaces) {
                totalWinnerPowerRatio += race.winnerWattage.powerRatio;
                totalAvgPowerRatio += race.averageWattage.powerRatio;
            }
            const avgAvgRacePowerRatio =
                totalAvgPowerRatio / similarRaces.length;
            const avgWinnerRacePowerRatio =
                totalWinnerPowerRatio / similarRaces.length;

            route.proIndex = route.stats.powerRatio / avgAvgRacePowerRatio;
            route.winnerIndex =
                route.stats.powerRatio / avgWinnerRacePowerRatio;
        } else {
            route.referencedRaces = [];
            route.proIndex = null;
            route.winnerIndex = null;
        }

        await route.save();
        console.log("Route processed successfully");
    } catch (err) {
        throw err; // Re-throw the error to be caught by the test
    }
}

module.exports = processRoute;
