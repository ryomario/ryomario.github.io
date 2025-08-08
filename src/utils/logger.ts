import { sendLog } from "./logger.server";
import { getErrorMessage } from "./errorMessage";
import { toJSON_safe } from "@/lib/json";

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export class Logger {
  private static getMessage(message: unknown, title = '') {
    const finalMessage = `${(title.trim())
      ? title.trim().concat(' => ')
      : ''
    }${getErrorMessage(message)}`;

    return toJSON_safe(finalMessage, '').slice(1, -1);
  }

  public static sendLog(level: LogLevel, message: string) {
    if (process.env.NODE_ENV == 'development') {
      sendLog(level, message);
    } else {
      switch (level) {
        case LogLevel.DEBUG: console.debug(message);
        case LogLevel.ERROR: console.error(message);
        case LogLevel.INFO: console.info(message);
        case LogLevel.WARN: console.warn(message);
        default: console.info(message);
      }
    }
  }

  /**
   * Debug, show in console as log at development mode
   */
  public static debug(message: unknown, title = '') {
    if (process.env.NODE_ENV == 'development') {
      this.sendLog(LogLevel.DEBUG, `DEBUG : ${Logger.getMessage(message, title)}`);
    }
  }

  /**
   * Info, show in console info
   */
  public static info(message: unknown, title = '') {
    this.sendLog(LogLevel.INFO, Logger.getMessage(message, title));
  }

  /**
   * Warning, show in console warn
   */
  public static warning(message: unknown, title = '') {
    this.sendLog(LogLevel.INFO, Logger.getMessage(message, title));
  }

  /**
   * Error, show in console error
   */
  public static error(message: unknown, title = '') {
    this.sendLog(LogLevel.ERROR, Logger.getMessage(message, title));
  }
}