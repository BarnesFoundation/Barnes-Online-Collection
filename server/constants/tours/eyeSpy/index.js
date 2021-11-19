const test = require("./test.json");

// Key is the slug/tourId of the tour
module.exports = {
    // Tour for test suite
    test,
}

/**
 * Eye spy clues should be saved as a CSV file without column headers
 * The first column of each row should be the inventory number of each artwork
 * included in the tour. Each clue should be wrapped in double quotes.
 */