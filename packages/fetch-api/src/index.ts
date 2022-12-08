import { appendGiphySDKRequestHeader, getGiphySDKRequestHeaders } from '@giphy/js-util'

export { default as GiphyFetch } from './api'
export { serverUrl, setServerUrl } from './constants'
export { default as FetchError } from './fetch-error'
export * from './option-types'
export { gifPaginator } from './paginator'
export { default as request } from './request'
export * from './result-types'

const { version } = require('../package.json')
// since we have multiple SDKs, we're defining a hieracrchy
// Fetch API is lowest

if (!getGiphySDKRequestHeaders()?.get(`X-GIPHY-SDK-NAME`)) {
    // send headers with library type and version
    appendGiphySDKRequestHeader(`X-GIPHY-SDK-NAME`, 'FetchAPI')
    appendGiphySDKRequestHeader(`X-GIPHY-SDK-VERSION`, version)
}
