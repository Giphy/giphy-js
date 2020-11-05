import cookie from 'cookie'
import { debounce } from 'throttle-debounce'
import { v1 as uuid } from 'uuid' // v1 only for pingback verfication
import { sendPingback } from './send-pingback'
import { Pingback, PingbackAttribute, PingbackRequestEvent } from './types'

let queuedPingbackEvents: PingbackRequestEvent[] = []

const gl = ((typeof window !== 'undefined' ? window : global) || {}) as any
gl.giphyRandomId = ''
const getRandomId = () => {
    // it exists in memory
    if (!gl.giphyRandomId) {
        try {
            // it exists in storage
            gl.giphyRandomId = localStorage.getItem('giphyRandomId')
        } catch (_) {}
        if (!gl.giphyRandomId) {
            // we need to create it
            gl.giphyRandomId = uuid()
            try {
                // save in storage
                localStorage.setItem('giphyRandomId', gl.giphyRandomId)
            } catch (_) {}
        }
    }
    return gl.giphyRandomId
}

let loggedInUserId = ''

function fetchPingbackRequest() {
    const sendEvents = [...queuedPingbackEvents]
    queuedPingbackEvents = []
    sendPingback(sendEvents)
}

const debouncedPingbackEvent = debounce(1000, fetchPingbackRequest)

const pingback = ({ gif, user, pingbackType, actionType, position, attributes = [] }: Pingback) => {
    // save the user id for whenever create session is invoked
    loggedInUserId = user && user.id ? String(user.id) : loggedInUserId

    // apppend position only if it's not passed as a custom attribute
    if (position && !attributes.some((a: PingbackAttribute) => a.key === 'position')) {
        attributes.push({
            key: `position`,
            value: JSON.stringify(position),
        })
    }

    // get the giphy_pbid cookie
    const user_id = cookie.parse(document ? document.cookie : ({} as any)).giphy_pbid

    const newEvent: PingbackRequestEvent = {
        user_id,
        logged_in_user_id: loggedInUserId || '',
        ts: Date.now(),
        analytics_response_payload: gif.analytics_response_payload,
        attributes,
        action_type: actionType,
    }

    if (!user_id) {
        newEvent.random_id = getRandomId()
    }

    if (pingbackType) {
        newEvent.event_type = pingbackType
    }

    queuedPingbackEvents.push(newEvent)
    // if there's a tid, skip the queue
    debouncedPingbackEvent()
}

export default pingback
