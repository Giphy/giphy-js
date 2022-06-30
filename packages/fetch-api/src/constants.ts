/* istanbul ignore next */
const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any

// GIPHY_API_URL is made to override the api url in testing environments
// must be specified before the packages load
export let serverUrl = gl.GIPHY_API_URL || 'https://api.giphy.com/v1/'

export const setServerUrl = (url: string) => {
    serverUrl = url
}
