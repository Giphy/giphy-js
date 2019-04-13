import { Result } from './result-types'

const serverUrl = 'https://api.giphy.com/v1/'
const identity = (i: any) => i
const requestMap: { [key: string]: Promise<Result> } = {}
function request(url: string, normalizer: (a: any, pingbackType?: string) => any = identity, pingbackType?: string) {
    if (!requestMap[url]) {
        requestMap[url] = new Promise<Result>(async (resolve, reject) => {
            try {
                const response = await fetch(`${serverUrl}${url}`, { method: 'get' })
                if (response.ok) {
                    const result = (await response.json()) as Result
                    resolve(normalizer(result, pingbackType))
                } else {
                    reject({
                        status: response.status,
                        statusText: response.statusText,
                        message: 'Error fetching',
                    })
                }
            } catch (error) {
                reject({ message: error.message })
            }
        })
    }
    return requestMap[url]
}

export default request
