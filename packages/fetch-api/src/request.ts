import { serverUrl } from './constants'
import FetchError, { GeoFetchError } from './fetch-error'
import { ErrorResult, Result } from './result-types'

export const ERROR_PREFIX = `@giphy/js-fetch-api: `
export const DEFAULT_ERROR = 'Error fetching'

export type RequestOptions = {
    apiVersion?: number
    noCache?: boolean
    normalizer?: (a: any) => any
}

const identity = (i: any) => i
const requestMap: {
    [key: string]: {
        request: Promise<Result>
        ts: number // timestamp
        isError?: boolean
    }
} = {}

const maxLife = 60000 // clear memory cache every minute
const errorMaxLife = 6000 // clear error memory cache after a second

const purgeCache = () => {
    const now = Date.now()
    Object.keys(requestMap).forEach((key: string) => {
        const ttl = requestMap[key].isError ? errorMaxLife : maxLife
        if (now - requestMap[key].ts >= ttl) {
            delete requestMap[key]
        }
    })
}

function request(url: string, options: RequestOptions = {}) {
    const { apiVersion = 1, noCache = false, normalizer = identity } = options
    const serverUrl_ = serverUrl.replace(/\/v\d+\/$/, `/v${apiVersion}/`)
    purgeCache()
    if (!requestMap[url] || noCache) {
        const fullUrl = `${serverUrl_}${url}`
        const makeRequest = async (): Promise<Result> => {
            let fetchError: FetchError
            try {
                const response = await fetch(fullUrl, {
                    method: 'get',
                })
                if (response.ok) {
                    const result = (await response.json()) as Result
                    // no response id is an indiication of a synthetic response
                    if (!result.meta?.response_id) {
                        throw { message: `synthetic response` } as ErrorResult
                    } else {
                        // if everything is successful, we return here, otherwise an error will be thrown
                        return normalizer(result)
                    }
                } else {
                    let message = DEFAULT_ERROR
                    try {
                        // error results have a different format than regular results
                        const result = (await response.json()) as ErrorResult
                        if (result.message) message = result.message
                        if (result.meta?.msg) message = result.meta.msg
                    } catch (_) {}
                    if (requestMap[url]) {
                        // we got a specific error,
                        // normally, you'd want to not fetch this again,
                        // but the api goes down and sends 400s, so allow a refetch after errorMaxLife
                        requestMap[url].isError = true
                    }

                    // we got an error response, throw with the message in the response body json
                    let Cls = FetchError
                    if (message === 'This content is not available in your location') {
                        Cls = GeoFetchError
                    }
                    fetchError = new Cls(`${ERROR_PREFIX}${message}`, fullUrl, response.status, response.statusText)
                }
            } catch (unexpectedError: any) {
                fetchError = new FetchError(unexpectedError.message, fullUrl)
                // if the request fails with an unspecfied error,
                // the user can request again after the error timeout
                if (requestMap[url]) {
                    requestMap[url].isError = true
                }
            }
            throw fetchError
        }
        requestMap[url] = { request: makeRequest(), ts: Date.now() }
    }
    return requestMap[url].request
}

export default request
