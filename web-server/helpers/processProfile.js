const RouteModel = require("../models/routeModel");

const processProfile = async (user) => {
    const routes = await RouteModel.find({ user: user._id });

    const profileDetails = {
        email: user.email,
        username: user.username,
        weight: user.weight,
        bikeWeight: user.bikeWeight,
        distanceTravelled: 0,
        travelTime: 0,
        elevationTravelled: 0,
        avgSpeed: 0,
        avgPower: 0,
        avgPowerRatio: 0,
        totalCalories: 0,
        avgProIndex: 0,
        maxProIndex: 0,
    };

    if (!routes || routes.length === 0) {
        return profileDetails;
    }

    for (const route of routes) {
        profileDetails.distanceTravelled += route.stats?.distance / 1000 || 0;
        profileDetails.travelTime += route.stats?.travelTime / 1000 || 0;
        profileDetails.elevationTravelled += route.stats?.elevation || 0;
        profileDetails.totalCalories += route.stats?.energy || 0;
        profileDetails.avgPower +=
            route.stats?.power * (route.stats?.travelTime / 1000) || 0;
        profileDetails.avgPowerRatio +=
            route.stats?.powerRatio * (route.stats?.travelTime / 1000) || 0;
        profileDetails.avgProIndex += route.proIndex || 0;

        profileDetails.maxProIndex =
            route.proIndex > profileDetails.maxProIndex
                ? route.proIndex
                : profileDetails.maxProIndex;
    }

    profileDetails.avgSpeed =
        (profileDetails.distanceTravelled /
            (profileDetails.travelTime / 1000)) *
        3.6;
    profileDetails.avgProIndex /= routes.length;
    profileDetails.avgPower /= profileDetails.travelTime;
    profileDetails.avgPowerRatio /= profileDetails.travelTime;

    return profileDetails;
};

module.exports = processProfile;
