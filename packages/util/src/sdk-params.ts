type GiphySDKRequestParam = 'x-giphy-sdk-name' | 'x-giphy-sdk-version' | 'x-giphy-sdk-platform'

const gl = (window || global || {}) as any
// define _GIPHY_SDK_PARAMS if they don't exist
gl._GIPHY_SDK_PARAMS = gl._GIPHY_SDK_PARAMS || { 'x-giphy-sdk-platform': 'web' }

export const getGiphySDKRequestParams = () => gl._GIPHY_SDK_PARAMS

export const appendGiphySDKRequestParam = (key: GiphySDKRequestParam, value: string) => {
    getGiphySDKRequestParams()[key] = value
}
