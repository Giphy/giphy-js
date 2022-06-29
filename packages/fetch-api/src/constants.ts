/* istanbul ignore next */
const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any

const getServerUrl = () => {
    try {
        // in an env where process.env exists,
        if (process.env.GIPHY_API_URL) {
            return process.env.GIPHY_API_URL
        }
    } catch (error) {}
    return gl.GIPHY_API_URL || 'https://api.giphy.com/v1/'
}
// GIPHY_API_URL is made to override the api url in testing environments
// must be specified before the packages load
export const serverUrl = getServerUrl()
