const DEV_LOGGING_ON = false;

export const DEV_LOG = (message) => {
  if (DEV_LOGGING_ON) {
    console.log(message);
  }
};

export const DEV_WARN = (message) => {
  if (DEV_LOGGING_ON) {
    console.warn(message);
  }
};
