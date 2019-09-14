declare global {
    namespace globalThis {
        var _GIPHY_SDK_HEADERS_: Headers
    }
}

type GiphySDKRequestHeader = 'X-GIPHY-SDK-NAME' | 'X-GIPHY-SDK-VERSION' | 'X-GIPHY-SDK-PLATFORM'

// define _GIPHY_SDK_HEADERS_ if they don't exist
globalThis._GIPHY_SDK_HEADERS_ =
    globalThis._GIPHY_SDK_HEADERS_ ||
    new Headers({
        'X-GIPHY-SDK-PLATFORM': 'web',
    })

export const getGiphySDKRequestHeaders = () => globalThis._GIPHY_SDK_HEADERS_

export const appendGiphySDKRequestHeader = (key: GiphySDKRequestHeader, value: string) =>
    getGiphySDKRequestHeaders().set(key, value)
