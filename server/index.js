"use strict";
require("dotenv").config();

// Resilience backstop: a failure in any single request handler (e.g. a peripheral CMS call to an
// unreachable host) must NEVER take down the whole server. Log and keep serving.
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", (reason && reason.message) || reason);
});
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", (err && err.stack) || err);
});

const app = require("./app");

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
