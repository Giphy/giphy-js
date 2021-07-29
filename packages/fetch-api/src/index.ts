import { appendGiphySDKRequestHeader, getGiphySDKRequestHeaders } from '@giphy/js-util'

/* istanbul ignore next */
const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any
// GIPHY_API_URL is made to override the api url in testing environments
// must be specified before the packages load
export const serverUrl = gl.GIPHY_API_URL || 'https://api.giphy.com/v1/'

export { default as GiphyFetch } from './api'
export * from './option-types'
export { gifPaginator } from './paginator'
export * from './result-types'

const { version } = require('../package.json')
// since we have multiple SDKs, we're defining a hieracrchy
// Fetch API is lowest

if (!getGiphySDKRequestHeaders()?.get(`X-GIPHY-SDK-NAME`)) {
    // send headers with library type and version
    appendGiphySDKRequestHeader(`X-GIPHY-SDK-NAME`, 'FetchAPI')
    appendGiphySDKRequestHeader(`X-GIPHY-SDK-VERSION`, version)
}
