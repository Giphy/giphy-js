import { getGiphySDKRequestHeaders, Logger } from '@giphy/js-util'
import { PingbackEvent } from './types'

// TODO remove api key
const pingBackUrl = 'https://pingback.giphy.com/v2/pingback?apikey=l0HlIwPWyBBUDAUgM'

export const sendPingback = (events: PingbackEvent[]) => {
    const headers = getGiphySDKRequestHeaders()
    headers?.set('Content-Type', 'application/json')
    Logger.debug(`Pingback session`, events)
    return fetch(pingBackUrl, {
        method: 'POST',
        body: JSON.stringify({ events }),
        headers,
    })
}
