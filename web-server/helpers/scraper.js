const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://www.procyclingstats.com/";

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

        const races = [];

        $("table > tbody > tr").each((index, row) => {
            if (index >= 1) return false;

            const link = $(row)
                .children("td:nth-child(2)")
                .children("a")
                .attr("href");

            const name = $(row)
                .children("td:nth-child(2)")
                .children("a")
                .text();

            const ago = $(row).children("td:nth-child(5)").text();
            const split = ago
                .split(" ")
                .reverse()
                .map((str) => parseInt(str));
            let secondsDifference = 0;
            split.forEach(
                (value, index) =>
                    (secondsDifference += Math.pow(60, index + 1) * value)
            );

            console.log(
                "-------------------------------------------------------------------------------------------------------"
            );
            console.log(BASE_URL + link);
            console.log(name);
            console.log(Date.now() - secondsDifference);
        });

        return;
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

        const races = [];

        $("table > tbody > tr").each((index, row) => {
            if (index >= 2) return false;

            const link = $(row)
                .children("td:nth-child(2)")
                .children("a")
                .attr("href");
            const name = $(row)
                .children("td:nth-child(2)")
                .children("a")
                .text();
            const ago = $(row).children("td:nth-child(5)").text();

            console.log(
                "-------------------------------------------------------------------------------------------------------"
            );
            console.log(BASE_URL + link);
            console.log(name);
            console.log(ago);
        });

        return;
    },
};

module.exports = scraper;
