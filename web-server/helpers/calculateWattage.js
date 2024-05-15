const calculateWattage = (
    distanceMeters,
    verticalMeters,
    timeSeconds,
    cyclistWeightKilograms
) => {
    const bikeWeightKilograms = 7;
    const gravity = 9.81;
    const rollingCoefficient = 0.004;

    const weightNewtons = (cyclistWeightKilograms + bikeWeightKilograms) * 10;

    const forceGravity = weightNewtons * verticalMeters * gravity;

    const inclinationAngle = Math.atan(verticalMeters / distanceMeters);

    const forceRolling =
        rollingCoefficient * weightNewtons * Math.cos(inclinationAngle);

    const totalForce = forceGravity + forceRolling;

    const work = totalForce * distanceMeters;
    const power = work / timeSeconds;
    const powerPerKg = power / cyclistWeightKilograms;

    return {
        work,
        power,
        powerPerKg,
    };
};

module.exports = calculateWattage;
