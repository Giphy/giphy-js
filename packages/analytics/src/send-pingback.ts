import { getGiphySDKRequestHeaders, Logger } from '@giphy/js-util'
import { PingbackRequestEvent } from './types'

// TODO remove api key
const pingBackUrl = 'https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM'

export const sendPingback = (events: PingbackRequestEvent[]) => {
    const headers = getGiphySDKRequestHeaders()
    headers?.set('Content-Type', 'application/json')
    Logger.debug(`Pingback session`, events)
    return fetch(pingBackUrl, {
        method: 'POST',
        body: JSON.stringify({ events }),
        headers,
    })
}
