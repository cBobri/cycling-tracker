const RouteModel = require('../models/routeModel');
const processRoute = require('../helpers/processRoute');
const { calculateDistance } = require('../helpers/calculateDistance');
const calculateWattage = require('../helpers/calculateWattage');
const getSimilarRaces = require('../helpers/getSimilarRaces');

jest.mock('../models/routeModel');
jest.mock('../helpers/calculateDistance');
jest.mock('../helpers/calculateWattage');
jest.mock('../helpers/getSimilarRaces');

describe('processRoute', () => {
    it('should throw an error if route is not found', async () => {
        RouteModel.findById.mockResolvedValue(null);

        await expect(processRoute('nonexistentRouteId')).rejects.toThrow('Route not found');
    });

    it('should throw an error if not enough data points to process', async () => {
        const route = { data: [{}] };
        RouteModel.findById.mockResolvedValue(route);

        await expect(processRoute('routeIdWithOneDataPoint')).rejects.toThrow('Not enough data points to process');
    });

    it('should process the route correctly with realistic data', async () => {
        const route = {
            _id: 'validRouteId',
            data: [],
            cyclistWeight: 70,
            bikeWeight: 10,
            save: jest.fn(), // Mock the save method
        };

        // Create 20 data points with timestamps at 5-second intervals and realistic changes
        const startTime = new Date('2023-01-01T00:00:00Z');
        let currentLat = 10;
        let currentLong = 10;
        let currentAltitude = 100;
        for (let i = 0; i < 20; i++) {
            route.data.push({
                gps: {
                    latitude: currentLat,
                    longitude: currentLong,
                    altitude: currentAltitude,
                },
                timestamp: new Date(startTime.getTime() + i * 5000).toISOString(),
                moving: true,
            });

            // Update the values for the next data point
            currentLat += 0.0001; // Small increment
            currentLong += 0.0001; // Small increment
            currentAltitude += 0.5; // Small increment in altitude
        }

        RouteModel.findById.mockResolvedValue(route);
        calculateDistance.mockReturnValue(14); // Approx 14 meters between points
        calculateWattage.mockReturnValue({ power: 200, powerRatio: 2.5, energy: 1000 });
        getSimilarRaces.mockResolvedValue([
            { _id: 'race1', winnerWattage: { powerRatio: 3 }, averageWattage: { powerRatio: 2 } }
            // Add more similar races as needed for the test
        ]);

        await processRoute('validRouteId');

        // Add assertions to check if the route was processed correctly
        const { power, powerRatio, energy, avgSpeed, maxSpeed, distance, elevation, travelTime } = route.stats;
        expect({ power, powerRatio, energy }).toEqual({
            power: 200,
            powerRatio: 2.5,
            energy: 10000, // Adjusted expected value based on logic
        });

        // Check the average speed
        expect(avgSpeed).toBeCloseTo(10.08, 1); // Approx 10.08 km/h (14 meters per 5 seconds)
        expect(distance).toBeCloseTo(266, 0); // Total distance: 19 segments * 14 meters
        expect(elevation).toBeCloseTo(9.5, 0); // Total elevation gain
        expect(travelTime).toBeCloseTo(95000, 0); // Total travel time in milliseconds
        expect(maxSpeed).toBeCloseTo(10.08, 1); // Max speed should be similar to avgSpeed in this simple case

        expect(route.referencedRaces).toContain('race1');
        expect(route.proIndex).toBeGreaterThan(0);
        expect(route.winnerIndex).toBeGreaterThan(0);

        // Check that the save method was called
        expect(route.save).toHaveBeenCalled();
    });
});
