import { getGiphySDKRequestHeaders, Logger } from '@giphy/js-util'
import gl from './global'
import { PingbackEvent } from './types'

// TODO remove api key
const environment = gl?.GIPHY_PINGBACK_URL || 'https://pingback.giphy.com'
const pingBackUrl = `${environment}/v2/pingback?apikey=l0HlIwPWyBBUDAUgM`

export const sendPingback = (events: PingbackEvent[]) => {
    const headers = getGiphySDKRequestHeaders()
    /* istanbul ignore next */
    headers?.set('Content-Type', 'application/json')
    Logger.debug(`Pingback session`, events)

    if (!events.length) {
        return new Promise<void>((resolve) => resolve())
    }

    return fetch(pingBackUrl, {
        method: 'POST',
        body: JSON.stringify({ events }),
        headers,
    }).catch((error) => {
        // Call failed, probably due to adblock.
        Logger.warn(`pingbacks failing to post ${error}`)
    })
}
