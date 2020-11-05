import cookie from 'cookie'
import { debounce } from 'throttle-debounce'
import { v1 as uuid } from 'uuid' // v1 only for pingback verfication
import { sendPingback } from './send-pingback'
import { Pingback, PingbackAttribute, PingbackGifEvent, PingbackRequestEvent as PingbackEvent } from './types'

let queuedPingbackEvents: PingbackEvent[] = []

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

function sendPingbacks() {
    const sendEvents = [...queuedPingbackEvents]
    queuedPingbackEvents = []
    sendPingback(sendEvents)
}

const debouncedPingbackEvent = debounce(1000, sendPingbacks)

const pingback = ({ gif, user, pingbackType, actionType, position, attributes, queueEvents = true }: Pingback) => {
    // save the user id for whenever create session is invoked
    loggedInUserId = user && user.id ? String(user.id) : loggedInUserId

    // apppend position only if it's not passed as a custom attribute
    if (position && !attributes?.some((a: PingbackAttribute) => a.key === 'position')) {
        if (!attributes) {
            attributes = []
        }
        attributes.push({
            key: `position`,
            value: JSON.stringify(position),
        })
    }

    // get the giphy_pbid cookie
    const user_id = cookie.parse(document ? document.cookie : ({} as any)).giphy_pbid

    const newEvent: PingbackEvent = {
        ts: Date.now(),
        attributes,
        action_type: actionType,
    }

    if (loggedInUserId) {
        newEvent.logged_in_user_id = loggedInUserId
    }

    if (gif) {
        const gifEvent = newEvent as PingbackGifEvent
        gifEvent.analytics_response_payload = gif.analytics_response_payload
    }

    if (user_id) {
        newEvent.user_id = user_id
    } else {
        newEvent.random_id = getRandomId()
    }

    if (pingbackType) {
        newEvent.event_type = pingbackType
    }

    queuedPingbackEvents.push(newEvent)

    queueEvents ? debouncedPingbackEvent() : sendPingbacks()
}

export default pingback
