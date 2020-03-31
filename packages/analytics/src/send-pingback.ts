import { getGiphySDKRequestHeaders, Logger } from '@giphy/js-util'
import { Session } from './session'

// TODO remove api key
const pingBackUrl = 'https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM'

export const sendPingback = (session: Session) => {
    const headers = getGiphySDKRequestHeaders()
    headers?.set('Content-Type', 'application/json')
    Logger.debug(`Pingback session`, session)
    return fetch(pingBackUrl, {
        method: 'POST',
        body: JSON.stringify({ sessions: [session] }),
        headers,
    })
}
