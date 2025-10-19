// for logging if production mode is not turned on

// src/utils/logger.ts

type LogLevel = "log" | "info" | "warn" | "error";

export const logger = (level: LogLevel = "log", data: unknown): void => {
  if (process.env.NODE_ENV === "production") return;

  const timestamp = new Date().toISOString();

  switch (level) {
    case "info":
      console.info(`[INFO] [${timestamp}]`, data);
      break;
    case "warn":
      console.warn(`[WARN] [${timestamp}]`, data);
      break;
    case "error":
      console.error(`[ERROR] [${timestamp}]`, data);
      break;
    default:
      console.log(`[LOG] [${timestamp}]`, data);
  }
};
