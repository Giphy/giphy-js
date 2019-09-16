import { Result, ErrorResult } from './result-types'
import { PingbackEventType } from '@giphy/js-types'
export const ERROR_PREFIX = `@giphy/js-fetch-api: `
export const DEFAULT_ERROR = 'Error fetching'
const serverUrl = 'https://api.giphy.com/v1/'
const identity = (i: any) => i
const requestMap: { [key: string]: Promise<Result> } = {}

class FetchError extends Error {
    statusText: string
    status: number
    constructor(message: string, status: number = 0, statusText: string = '') {
        super(message) // (1)
        this.status = status
        this.statusText = statusText
    }
}
function request(
    url: string,
    normalizer: (a: any, pingbackType?: PingbackEventType) => any = identity,
    pingbackType?: PingbackEventType,
) {
    if (!requestMap[url]) {
        const makeRequest = async (): Promise<Result> => {
            let fetchError: FetchError
            try {
                const response = await fetch(`${serverUrl}${url}`, { method: 'get' })
                if (response.ok) {
                    const result = (await response.json()) as Result
                    return normalizer(result, pingbackType)
                } else {
                    // handle errors
                    let message = DEFAULT_ERROR
                    try {
                        // error results have a different format than regular results
                        const result = (await response.json()) as ErrorResult
                        if (result.message) message = result.message
                    } catch (_) {}
                    fetchError = new FetchError(`${ERROR_PREFIX}${message}`, response.status, response.statusText)
                }
            } catch (unexpectedError) {
                fetchError = new FetchError(unexpectedError.message)
                // if the request fails with an unspecfied error,
                // the user can request again
                // TODO: perhaps we can return a function to clear
                // { clearCache: () => delete requestMap[url] }
                delete requestMap[url]
            }
            throw fetchError
        }
        requestMap[url] = makeRequest()
    }
    return requestMap[url]
}

export default request
