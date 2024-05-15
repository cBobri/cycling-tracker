const axios = require("axios");
const cheerio = require("cheerio");

const calculateWattage = require("./calculateWattage");
const RaceModel = require("../models/raceModel");

const BASE_URL = "https://www.procyclingstats.com/";

Object.defineProperty(String.prototype, "capitalize", {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false,
});

const scraper = {
    scrapeRecentRaces: async () => {
        let response;

        try {
            response = await axios.get(
                BASE_URL + "calendar/uci/latest-results"
            );
        } catch (err) {
            console.log("Error scraping recent races", err);
            return;
        }

        const HTML = response.data;
        const $ = cheerio.load(HTML);

        let count = 0;

        $("table > tbody > tr").each(async (index, row) => {
            const raceClass = $(row).children("td:nth-child(3)").text();
            if (raceClass == "NC") return;

            const link = $(row)
                .children("td:nth-child(2)")
                .children("a")
                .attr("href");

            const linkSplit = link.split("/");
            if (linkSplit[linkSplit.length - 1] == "gc") return;

            const date = $(row).children("td:nth-child(1)").text();

            const name = $(row)
                .children("td:nth-child(2)")
                .children("a")
                .text();

            const alreadyExists = await RaceModel.exists({
                name: name,
                date: date,
            });
            if (alreadyExists) return false;

            const ago = $(row).children("td:nth-child(5)").text();
            if (ago == "") return;

            const split = ago
                .split(" ")
                .reverse()
                .map((str) => parseInt(str));
            let secondsDifference = 0;
            split.forEach(
                (value, index) =>
                    (secondsDifference += Math.pow(60, index + 1) * value)
            );

            const details = await scraper.scrapeRace(BASE_URL + link);

            const race = new RaceModel({
                name: name,
                date: date,
                category: details.category,
                distance: details.distance,
                verticalMeters: details.verticalMeters,
                winner: details.winner,
                winnerWattage: details.winnerWattage,
                averageWattage: details.averageWattage,
                postedAt: Date.now() - secondsDifference,
            });

            console.log("New race:", race);

            try {
                await race.save();
                count++;
            } catch (err) {
                console.log("Failed to save race:", err);
            }
        });

        console.log(`Finished scraping - ${count} races were added`);
    },
    scrapeRace: async (URL) => {
        let response;

        try {
            response = await axios.get(URL);
        } catch (err) {
            console.log("Error scraping specific race:", err);
            return;
        }

        const HTML = response.data;
        const $ = cheerio.load(HTML);

        const category = $(
            "ul.infolist > li:nth-child(4) > div:nth-child(2)"
        ).text();

        const distance = parseFloat(
            $("ul.infolist > li:nth-child(5) > div:nth-child(2)")
                .text()
                .replace(" km", "")
        );

        const verticalMeters = parseInt(
            $("ul.infolist > li:nth-child(10) > div:nth-child(2)").text()
        );

        const riders = [];

        let fastestTime = 0;
        let previousTime = 0;

        const positions = {
            rank: null,
            rider: null,
            time: null,
        };

        $("table > thead > tr > th").each((index, th) => {
            const text = $(th).text();

            if (text == "Rnk") positions.rank = index + 1;
            if (text == "Rider") positions.rider = index + 1;
            if (text == "Time") positions.time = index + 1;

            if (
                positions.rank != null &&
                positions.rider != null &&
                positions.time != null
            )
                return false;
        });

        $("table > tbody > tr").each((index, row) => {
            //if (index > 10) return false;
            const rank = $(row)
                .children(`td:nth-child(${positions.rank})`)
                .text();

            if (rank === "DNF" || rank != index + 1) return false;

            const rider = $(row)
                .children(`td:nth-child(${positions.rider})`)
                .children("div")
                .children("a")
                .text();

            const link = $(row)
                .children(`td:nth-child(${positions.rider})`)
                .children("div")
                .children("a")
                .attr("href");

            let time = $(row)
                .children(`td:nth-child(${positions.time})`)
                .children("div.hide")
                .text();

            if (time == "") {
                time = $(row)
                    .children(`td:nth-child(${positions.time})`)
                    .contents()
                    .first()
                    .text();
            }

            let seconds = 0;
            time.split(":")
                .reverse()
                .forEach((value, index) => {
                    seconds += Math.pow(60, index) * value;
                });

            seconds += fastestTime;

            if (seconds < previousTime) return;

            if (index === 0) {
                fastestTime = seconds;
            }
            previousTime = seconds;

            const firstname = rider.split(" ").slice(1).join(" ");
            const lastname = rider
                .split(" ")[0]
                .toLocaleLowerCase()
                .capitalize();

            riders.push({
                firstname,
                lastname,
                link,
                seconds,
            });
        });

        let winner;
        let winnerWattage;
        const averageWattage = {
            power: 0,
            powerRatio: 0,
            energy: 0,
        };

        riders.forEach(async (rider, index) => {
            const riderWattage = calculateWattage(
                distance * 1000,
                verticalMeters,
                rider.seconds,
                70,
                true
            );

            if (index === 0) {
                winner = rider.firstname + " " + rider.lastname;
                winnerWattage = riderWattage;
            }

            averageWattage.power += riderWattage.power;
            averageWattage.powerRatio += riderWattage.powerRatio;
            averageWattage.energy += riderWattage.energy;
        });

        averageWattage.power /= riders.length;
        averageWattage.powerRatio /= riders.length;
        averageWattage.energy /= riders.length;

        const details = {
            category,
            distance,
            verticalMeters,
            winner,
            winnerWattage,
            averageWattage,
        };

        return details;
    },
};

module.exports = scraper;
