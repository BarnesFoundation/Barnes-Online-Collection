const test = require("./test.json");

const soutine = require("./soutine.json");
const bloom = require("./bloom.json");

// Key is the slug/tourId of the tour
module.exports = {
  // Tour for test suite
  "test-tour": test,
  // Tours for website
  soutine: soutine,
  bloom: bloom,
};
