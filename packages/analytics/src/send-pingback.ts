import { Session } from './session'
import appendQuery from 'append-query'
import { getGiphySDKRequestParams } from '@giphy/js-util'
// TODO remove api key
const pingBackUrl = 'https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM'

export const sendPingback = (session: Session) => {
    const headers = new Headers()
    const qs = getGiphySDKRequestParams()
    headers.set('Content-Type', 'application/json')
    return fetch(appendQuery(pingBackUrl, qs), {
        method: 'POST',
        body: JSON.stringify({ sessions: [session] }),
        headers,
    })
}
