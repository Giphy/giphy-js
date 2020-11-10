import { PingbackEventType } from '@giphy/js-types'
import FetchError from './fetch-error'
import { ErrorResult, Result } from './result-types'
export const ERROR_PREFIX = `@giphy/js-fetch-api: `
export const DEFAULT_ERROR = 'Error fetching'

const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any
const serverUrl = gl.GIPHY_API_URL || 'https://api.giphy.com/v1/'

const identity = (i: any) => i
const requestMap: {
    [key: string]: {
        request: Promise<Result>
        ts: number // timestamp
    }
} = {}

const maxLife = 60000 // clear memory cache every minute

const purgeCache = () => {
    const now = Date.now()
    Object.keys(requestMap).forEach((key: string) => {
        if (now - requestMap[key].ts >= maxLife) {
            delete requestMap[key]
        }
    })
}

function request(
    url: string,
    normalizer: (a: any, pingbackType?: PingbackEventType) => any = identity,
    pingbackType?: PingbackEventType,
    noCache: boolean = false
) {
    purgeCache()
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
        requestMap[url] = { request: makeRequest(), ts: Date.now() }
    }
    return requestMap[url].request
}

export default request
