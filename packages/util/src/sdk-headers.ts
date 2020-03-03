type GiphySDKRequestHeader = 'X-GIPHY-SDK-NAME' | 'X-GIPHY-SDK-VERSION' | 'X-GIPHY-SDK-PLATFORM'

const gl = (window || global || {}) as any
// define _GIPHY_SDK_HEADERS_ if they don't exist
gl._GIPHY_SDK_HEADERS_ =
    gl._GIPHY_SDK_HEADERS_ ||
    new Headers({
        'X-GIPHY-SDK-PLATFORM': 'web',
    })

export const getGiphySDKRequestHeaders = () => gl._GIPHY_SDK_HEADERS_

export const appendGiphySDKRequestHeader = (key: GiphySDKRequestHeader, value: string) =>
    getGiphySDKRequestHeaders().set(key, value)
