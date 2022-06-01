const test = require("./test.json");
const dec2021 = require("./dec-2021.json");
const feb2022 = require("./feb-2022.json");
const mar2022 = require("./mar-2022.json");
const apr2022 = require("./apr-2022.json");
const may2022 = require("./may-2022.json");
const jun2022 = require("./jun-2022.json");

// Key is the slug/tourId of the tour
module.exports = {
    "dec-2021": dec2021,
    "feb-2022": feb2022, 
    "mar-2022": mar2022, 
    "apr-2022": apr2022,
    "may-2022": may2022,
    "jun-2022": jun2022,
    // Tour for test suite
    test,
}
