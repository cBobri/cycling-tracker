const calculateWattage = (
    distance,
    verticalDistance,
    time,
    cyclistWeight,
    pro = false
) => {
    const BIKE_WEIGHT = pro ? 7 : 11;
    const GRAVITY = 9.8067;
    const ROLLING_COEFFICIENT = 0.005;
    const HEADWIND = 0;
    const AIR_DENSITY = 1.22601;
    const CDA = pro ? 0.3 : 0.4;
    const DRIVETAIN_LOSS = pro ? 2 : 3;

    const speed = (distance + verticalDistance) / time;
    const weight = cyclistWeight + BIKE_WEIGHT;

    const hillGrade = (verticalDistance / distance) * 100;
    const forceGravity =
        GRAVITY * Math.sin(Math.atan(hillGrade / 100)) * weight;

    const forceRolling =
        GRAVITY *
        Math.cos(Math.atan(hillGrade / 100)) *
        weight *
        ROLLING_COEFFICIENT;

    const forceDrag = 0.5 * CDA * AIR_DENSITY * Math.pow(HEADWIND + speed, 2);

    const forceResistance = forceGravity + forceRolling + forceDrag;

    const power = (1 - DRIVETAIN_LOSS / 100) * forceResistance * speed;
    const powerRatio = power / cyclistWeight;
    const energy = work / 4.18 / 0.28 / 1000;

    /*
    console.log("Distance (m):", distance);
    console.log("Vertical meters (m):", verticalDistance);
    console.log("Time (s):", time);
    console.log("Speed (m/s):", speed);
    console.log("Cyclist Weight (kg):", cyclistWeight);
    console.log("Bike Weight (kg):", BIKE_WEIGHT);
    console.log("Total Weight (kg):", weight);
    console.log("---------------------------------");
    console.log("Gravity (N):", forceGravity);
    console.log("Rolling Resistance (N):", forceRolling);
    console.log("Aerodynamic Drag (N):", forceDrag);
    console.log("---------------------------------");
    console.log("Average Power (W):", power);
    console.log("Power/Weight (W/kg):", powerRatio);
    console.log("Calories burnt (kcal):", energy);
    */

    return {
        power,
        powerRatio,
        energy,
    };
};

module.exports = calculateWattage;
