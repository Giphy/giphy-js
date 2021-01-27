import { getPingbackId, Logger } from '@giphy/js-util'
import { debounce } from 'throttle-debounce'
import { v1 as uuid } from 'uuid' // v1 only for pingback verfication
import { sendPingback } from './send-pingback'
import { Pingback, PingbackEvent, PingbackGifEvent } from './types'
import gl from './global'

let queuedPingbackEvents: PingbackEvent[] = []

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
// generate this for verification?
getRandomId()

let loggedInUserId = ''

function sendPingbacks() {
    const sendEvents = [...queuedPingbackEvents]
    queuedPingbackEvents = []
    sendPingback(sendEvents)
}

const debouncedPingbackEvent = debounce(1000, sendPingbacks)

const pingback = ({ gif, userId, eventType, actionType, attributes, queueEvents = true }: Pingback) => {
    // save the user id for whenever create session is invoked
    loggedInUserId = userId ? String(userId) : loggedInUserId

    const newEvent: PingbackEvent = {
        ts: Date.now(),
        attributes,
        action_type: actionType,
    }

    if (loggedInUserId) {
        newEvent.logged_in_user_id = loggedInUserId
    }

    if (gif) {
        if (!gif.analytics_response_payload) {
            Logger.debug(`no pingback for ${gif.id}, not all endpoints have ARPs`)
            // abort pingback, analytics_response_payload is required for gif events
            return
        }
        const gifEvent = newEvent as PingbackGifEvent
        gifEvent.analytics_response_payload = `${gif.analytics_response_payload}${
            Logger.ENABLED ? '&mode=verification' : ''
        }`
    }

    newEvent.user_id = getPingbackId()

    if (eventType) {
        newEvent.event_type = eventType
    }

    queuedPingbackEvents.push(newEvent)

    queueEvents ? debouncedPingbackEvent() : sendPingbacks()
}

export default pingback
