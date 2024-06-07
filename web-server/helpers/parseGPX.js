const xml2js = require("xml2js");
const { calculateDistance } = require("./calculateDistance");

const parseGPX = async (gpxData) => {
    try {
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(gpxData);

        const recordingStart = result.gpx.metadata[0].time[0];

        const trackPoints = result.gpx.trk[0].trkseg[0].trkpt;

        const recordingEnd = trackPoints[trackPoints.length - 1].time[0];

        const data = [];

        let lastTimestamp = null;

        trackPoints.forEach((pt) => {
            const timestamp = new Date(pt.time[0]);

            if (!lastTimestamp || timestamp - lastTimestamp >= 5000) {
                data.push({
                    gps: {
                        latitude: +pt.$.lat,
                        longitude: +pt.$.lon,
                        altitude: +pt.ele[0],
                    },
                    magnitude: null,
                    timestamp,
                });
                lastTimestamp = timestamp;
            }
        });

        data.forEach((curr, index) => {
            if (index === 0) {
                curr.moving = false;
                return;
            }

            const prev = data[index - 1];

            const distance = calculateDistance(prev.gps, curr.gps);

            curr.moving = distance >= 5;
        });

        return {
            recordingStart,
            data,
            recordingEnd,
        };
    } catch (error) {
        console.error("Error parsing GPX data:", error);
        throw error;
    }
};

module.exports = { parseGPX };
