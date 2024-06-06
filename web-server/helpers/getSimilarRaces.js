const RaceModel = require('../models/raceModel');

// Calculate the Euclidean distance between two points.
function calculateSimilarity(distance1, elevation1, distance2, elevation2) {
    return Math.sqrt(Math.pow(distance1 - distance2, 2) + Math.pow(elevation1 - elevation2, 2));
}

// Find the most similar races to a given route.
async function findSimilarRaces(route) {
    try {
        const races = await RaceModel.find();
        if (!races.length) {
            throw new Error('No races found');
        }

        // Use an array to keep track of the three most similar races
        const similarRaces = [
            { race: null, similarity: Infinity },
            { race: null, similarity: Infinity },
            { race: null, similarity: Infinity }
        ];

        races.forEach(race => {
            const similarity = calculateSimilarity(
                route.stats.distance,
                route.stats.elevation,
                race.distance * 1000,
                race.verticalMeters * 1000
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

        return similarRaces.map(entry => entry.race);
    } catch (error) {
        console.error('Failed to find similar races:', error);
        throw error;
    }
}

module.exports = findSimilarRaces;
