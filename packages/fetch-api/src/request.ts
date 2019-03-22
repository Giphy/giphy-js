import { Result } from './result-types'

const serverUrl = 'https://api.giphy.com/v1/'
const identity = (i: any) => i
function request(url: RequestInfo, normalizer: (a: any) => any = identity) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(`${serverUrl}${url}`, { method: 'get' })
        if (response.ok) {
            const result = (await response.json()) as Result
            resolve(normalizer(result))
        } else {
            reject({
                status: response.status,
                statusText: response.statusText,
            })
        }
    })
}

export default request
