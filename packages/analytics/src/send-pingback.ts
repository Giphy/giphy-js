import { Session } from './session'
// TODO remove api key
const pingBackUrl = 'https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM'

export const sendPingback = (session: Session) =>
    fetch(pingBackUrl, {
        method: 'POST',
        body: JSON.stringify({ sessions: [session] }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
