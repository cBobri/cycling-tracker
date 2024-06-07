const RaceModel = require("../models/raceModel");

// Constants for normalization (these should be determined based on your data)
const MAX_DISTANCE = 100000; // e.g., 100 km in meters
const MAX_RATIO = 0.025; // e.g., 10% elevation gain per distance

// Weights for the factors
const DISTANCE_WEIGHT = 3 / 4;
const RATIO_WEIGHT = 1 / 4;

// Calculate the Euclidean distance between two points, including the elevation/distance ratio.
function calculateSimilarity(distance1, elevation1, distance2, elevation2) {
    const ratio1 = elevation1 / distance1;
    const ratio2 = elevation2 / distance2;

    // Normalize the factors
    const normalizedDistance1 = distance1 / MAX_DISTANCE;
    const normalizedDistance2 = distance2 / MAX_DISTANCE;
    const normalizedRatio1 = ratio1 / MAX_RATIO;
    const normalizedRatio2 = ratio2 / MAX_RATIO;

    return Math.sqrt(
        DISTANCE_WEIGHT *
            Math.pow(normalizedDistance1 - normalizedDistance2, 2) +
            RATIO_WEIGHT * Math.pow(normalizedRatio1 - normalizedRatio2, 2)
    );
}
// Find the most similar races to a given route.
async function findSimilarRaces(route) {
    try {
        const races = await RaceModel.find();
        if (!races.length) {
            throw new Error("No races found");
        }

        // Use an array to keep track of the three most similar races
        const similarRaces = [
            { race: null, similarity: Infinity },
            { race: null, similarity: Infinity },
            { race: null, similarity: Infinity },
        ];

        races.forEach((race) => {
            const duplicates = similarRaces.filter(
                (addedRace) =>
                    addedRace?.race?.winner == race.winner &&
                    addedRace?.race?.name == race.name &&
                    addedRace?.race?.distance == race.distance &&
                    addedRace?.race?.date == race.date
            );

            if (duplicates.length > 0 || race.averageWattage.power > 700)
                return;

            const similarity = calculateSimilarity(
                route.stats.distance,
                route.stats.elevation,
                race.distance * 1000,
                race.verticalMeters
            );

            // Check if the current race should be in the top 3
            for (let i = 0; i < similarRaces.length; i++) {
                if (similarity < similarRaces[i].similarity) {
                    // Shift the lower ranked races down the list
                    similarRaces.splice(i, 0, { race, similarity });
                    similarRaces.pop();
                    break;
                }
            }
        });

        return similarRaces.map((entry) => entry.race);
    } catch (error) {
        console.error("Failed to find similar races:", error);
        throw error;
    }
}

module.exports = findSimilarRaces;
