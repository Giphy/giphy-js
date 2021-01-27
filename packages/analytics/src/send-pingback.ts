import { getGiphySDKRequestHeaders, Logger } from '@giphy/js-util'
import { PingbackEvent } from './types'
import gl from './global'

// TODO remove api key
const environment = gl?.GIPHY_PINGBACK_URL || 'https://pingback.giphy.com'
const pingBackUrl = `${environment}/v2/pingback?apikey=l0HlIwPWyBBUDAUgM`

export const sendPingback = (events: PingbackEvent[]) => {
    const headers = getGiphySDKRequestHeaders()
    /* istanbul ignore next */
    headers?.set('Content-Type', 'application/json')
    Logger.debug(`Pingback session`, events)
    return fetch(pingBackUrl, {
        method: 'POST',
        body: JSON.stringify({ events }),
        headers,
    })
}
