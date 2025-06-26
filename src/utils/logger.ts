import { toJSON_safe } from "@/lib/json";

export class Logger {
  private static getMessage(message: any, title = '') {
    return `${
      (title.trim())
      ? title.trim().concat(' => ')
      : ''
    }${(typeof message === 'string') ? message : toJSON_safe(message)}`
  }

  /**
   * Debug, show in console as log at development mode
   */
  public static debug(message: any, title = '') {
    if(process.env.NODE_ENV == 'development') {
      console.log('DEBUG :', Logger.getMessage(message, title));
    }
  }

  /**
   * Info, show in console info
   */
  public static info(message: any, title = '') {
    console.info(Logger.getMessage(message, title));
  }

  /**
   * Warning, show in console warn
   */
  public static warning(message: any, title = '') {
    console.warn(Logger.getMessage(message, title));
  }

  /**
   * Error, show in console error
   */
  public static error(message: string, title = '') {
    console.error(Logger.getMessage(message, title));
  }
}