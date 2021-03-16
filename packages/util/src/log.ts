/* istanbul ignore next */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}
/* istanbul ignore next */
export const Logger = {
    ENABLED:
        typeof window !== 'undefined' &&
        typeof location !== 'undefined' &&
        location.search.indexOf('giphy-debug') !== -1,
    LEVEL: 0,
    PREFIX: 'GiphyJS',
    debug: (...msg: any) => {
        if (Logger.ENABLED && Logger.LEVEL <= LogLevel.DEBUG) {
            console.debug(Logger.PREFIX, ...msg) // eslint-disable-line no-console
        }
    },
    info: (...msg: any) => {
        if (Logger.ENABLED && Logger.LEVEL <= LogLevel.INFO) {
            console.info(Logger.PREFIX, ...msg) // eslint-disable-line no-console
        }
    },
    warn: (...msg: any) => {
        if (Logger.ENABLED && Logger.LEVEL <= LogLevel.WARN) {
            console.warn(Logger.PREFIX, ...msg) // eslint-disable-line no-console
        }
    },
    error: (...msg: any) => {
        if (Logger.ENABLED && Logger.LEVEL <= LogLevel.ERROR) {
            console.error(Logger.PREFIX, ...msg) // eslint-disable-line no-console
        }
    },
}
