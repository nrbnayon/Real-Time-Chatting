const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${message}`, data || "");
  },
  error: (message, error) => {
    // console.error(`[ERROR] ${message}`, error);
    // console.error("Stack:", error?.stack);
    console.log("Something went wrong. Please try again later.");
  },
  debug: (message, data) => {
    console.debug(`[DEBUG] ${message}`, data || "");
  },
  warn: (message, data) => {
    console.warn(`[WARN] ${message}`, data || "");
  },
};

export default logger;
