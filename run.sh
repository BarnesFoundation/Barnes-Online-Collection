#!/bin/bash
# Lambda Web Adapter entrypoint (Handler: run.sh).
# Starts the unmodified Express server; the LWA layer (AWS_LAMBDA_EXEC_WRAPPER=/opt/bootstrap)
# proxies Function URL invocations to it on PORT 8080. No application code change vs. the old container.
exec node server/index.js
