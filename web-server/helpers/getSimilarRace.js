const RaceModel = require('../models/raceModel');

// Calculate the Euclidean distance between two points.
function calculateSimilarity(distance1, elevation1, distance2, elevation2) {
    return Math.sqrt(Math.pow(distance1 - distance2, 2) + Math.pow(elevation1 - elevation2, 2));
}

// Find the most similar race to a given route.
async function findSimilarRace(route) {
    try {
        const races = await RaceModel.find();
        if (!races.length) {
            throw new Error('No races found');
        }

        let minSimilarity = Infinity;
        let mostSimilarRace = null;

        races.forEach(race => {
            const similarity = calculateSimilarity(
                route.stats.distance,
                route.stats.elevation,
                race.distance,
                race.verticalMeters
            );

            if (similarity < minSimilarity) {
                minSimilarity = similarity;
                mostSimilarRace = race;
            }
        });

        return mostSimilarRace;
    } catch (error) {
        console.error('Failed to find similar race:', error);
        throw error;
    }
}

module.exports = findSimilarRace;
