type GiphySDKRequestHeader = 'X-GIPHY-SDK-NAME' | 'X-GIPHY-SDK-VERSION' | 'X-GIPHY-SDK-PLATFORM'
const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any
// define _GIPHY_SDK_HEADERS_ if they don't exist
gl._GIPHY_SDK_HEADERS_ =
    gl._GIPHY_SDK_HEADERS_ ||
    (gl.Headers
        ? new gl.Headers({
              'X-GIPHY-SDK-PLATFORM': 'web',
          })
        : undefined)

export const getGiphySDKRequestHeaders = (): Headers | undefined => gl._GIPHY_SDK_HEADERS_

export const appendGiphySDKRequestHeader = (key: GiphySDKRequestHeader, value: string) =>
    getGiphySDKRequestHeaders()?.set(key, value)

export const appendGiphySDKRequestParam = (key: GiphySDKRequestHeader, value: string) =>
    getGiphySDKRequestHeaders()?.set(key, value)
