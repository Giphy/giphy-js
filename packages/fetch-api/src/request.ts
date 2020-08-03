import { PingbackEventType } from '@giphy/js-types'
import FetchError from './fetch-error'
import { ErrorResult, Result } from './result-types'
export const ERROR_PREFIX = `@giphy/js-fetch-api: `
export const DEFAULT_ERROR = 'Error fetching'
const serverUrl = 'https://api.giphy.com/v1/'
const identity = (i: any) => i
const requestMap: { [key: string]: Promise<Result> } = {}

function request(
    url: string,
    normalizer: (a: any, pingbackType?: PingbackEventType) => any = identity,
    pingbackType?: PingbackEventType,
    noCache: boolean = false
) {
    if (!requestMap[url] || noCache) {
        const makeRequest = async (): Promise<Result> => {
            let fetchError: FetchError
            try {
                const response = await fetch(`${serverUrl}${url}`, {
                    method: 'get',
                })
                if (response.ok) {
                    const result = (await response.json()) as Result
                    // if everything is successful, we return here, otherwise an error will be thrown
                    return normalizer(result, pingbackType)
                } else {
                    let message = DEFAULT_ERROR
                    try {
                        // error results have a different format than regular results
                        const result = (await response.json()) as ErrorResult
                        if (result.message) message = result.message
                    } catch (_) {}
                    // we got an error response, throw with the message in the response body json
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
