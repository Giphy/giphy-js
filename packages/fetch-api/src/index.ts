import { getGiphySDKRequestParams, appendGiphySDKRequestParam } from '@giphy/js-util'

export { default as GiphyFetch } from './api'
export * from './option-types'
export * from './result-types'
export { gifPaginator } from './paginator'

const { version } = require('../package.json')
// since we have multiple SDKs, we're defining a hieracrchy
// Fetch API is lowest
if (!getGiphySDKRequestParams()[`x-giphy-sdk-name`]) {
    // send headers with library type and version
    appendGiphySDKRequestParam(`x-giphy-sdk-name`, 'FetchAPI')
    appendGiphySDKRequestParam(`x-giphy-sdk-version`, version)
}
