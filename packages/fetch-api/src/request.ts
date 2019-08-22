import { Result, ErrorResult } from './result-types'
import { PingbackEventType } from '@giphy/js-types'
export const ERROR_PREFIX = `@giphy/js-fetch-api: `
export const DEFAULT_ERROR = 'Error fetching'
const serverUrl = 'https://api.giphy.com/v1/'
const identity = (i: any) => i
const requestMap: { [key: string]: Promise<Result> } = {}
function request(
    url: string,
    normalizer: (a: any, pingbackType?: PingbackEventType) => any = identity,
    pingbackType?: PingbackEventType,
) {
    if (!requestMap[url]) {
        requestMap[url] = new Promise<Result>(async (resolve, reject) => {
            try {
                const response = await fetch(`${serverUrl}${url}`, { method: 'get' })
                if (response.ok) {
                    const result = (await response.json()) as Result
                    resolve(normalizer(result, pingbackType))
                } else {
                    let message = DEFAULT_ERROR
                    try {
                        // error results have a different format than regular results
                        const result = (await response.json()) as ErrorResult
                        if (result.message) message = result.message
                    } catch (_) {}
                    reject({
                        status: response.status,
                        statusText: response.statusText,
                        message: `${ERROR_PREFIX}${message}`,
                    })
                }
            } catch (error) {
                reject({ message: error.message })
                // if the request fails with an unspecfied error,
                // the user can request again
                // TODO: perhaps we can return a function to clear
                // { clearCache: () => delete requestMap[url] }
                delete requestMap[url]
            }
        })
    }
    return requestMap[url]
}

export default request
