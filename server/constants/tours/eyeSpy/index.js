const test = require("./test.json");
const dec2021 = require("./dec-2021.json");
const feb2022 = require("./feb-2022.json");
const mar2022 = require("./mar-2022.json");

// Key is the slug/tourId of the tour
module.exports = {
    "dec-2021": dec2021,
    "feb-2022": feb2022, 
    "mar-2022": mar2022, 
    // Tour for test suite
    test,
}

/**
 * Eye spy clues should be saved as a CSV file without column headers
 * The first column of each row should be the inventory number of each artwork
 * included in the tour. Each clue should be wrapped in double quotes.
 */