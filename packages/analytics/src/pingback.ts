import { getPingbackId, Logger } from '@giphy/js-util'
import { debounce } from 'throttle-debounce'
import gl from './global'
import { sendPingback } from './send-pingback'
import { Pingback, PingbackEvent } from './types'

let queuedPingbackEvents: PingbackEvent[] = []

gl.giphyRandomId = getPingbackId()

let loggedInUserId = ''

function sendPingbacks() {
    const sendEvents = [...queuedPingbackEvents]
    queuedPingbackEvents = []
    sendPingback(sendEvents)
}

const debouncedPingbackEvent = debounce(1000, sendPingbacks)

gl.addEventListener?.('beforeunload', sendPingbacks)

const pingback = ({
    userId,
    eventType,
    actionType,
    attributes,
    queueEvents = true,
    analyticsResponsePayload,
}: Pingback) => {
    // save the user id for whenever create session is invoked
    loggedInUserId = userId ? String(userId) : loggedInUserId

    const newEvent: PingbackEvent = {
        ts: Date.now(),
        attributes,
        action_type: actionType,
        user_id: getPingbackId(),
        analytics_response_payload: analyticsResponsePayload,
    }

    if (loggedInUserId) {
        newEvent.logged_in_user_id = loggedInUserId
    }

    // add verification mode
    if (newEvent.analytics_response_payload) {
        newEvent.analytics_response_payload = `${newEvent.analytics_response_payload}${
            Logger.ENABLED ? '&mode=verification' : ''
        }`
    }

    if (eventType) {
        newEvent.event_type = eventType
    }

    queuedPingbackEvents.push(newEvent)

    queueEvents ? debouncedPingbackEvent() : sendPingbacks()
}

export default pingback
