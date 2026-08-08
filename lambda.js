"use strict";
require("dotenv").config();

// Same resilience backstop as server/index.js — a peripheral failure must never take the function down.
process.on("unhandledRejection", (reason) => console.error("[unhandledRejection]", (reason && reason.message) || reason));
process.on("uncaughtException", (err) => console.error("[uncaughtException]", (err && err.stack) || err));

const serverless = require("serverless-http");
const app = require("./server/app");

// Wrap the (unchanged) Express app for Lambda. CloudFront routes /api/* here; static goes to S3.
module.exports.handler = serverless(app);
