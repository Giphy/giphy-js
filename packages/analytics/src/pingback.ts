import { PingbackEventType } from '@giphy/js-types'
import { getGiphySDKRequestHeaders, Logger } from '@giphy/js-util'
import cookie from 'cookie'
import { debounce } from 'throttle-debounce'
import { getRandomId } from './session'
import { Pingback } from './types'

let loggedInUserId = ''

const debouncedPingbackEvent = debounce(1000, sendPingbacks)

export type PingbackV2Event = {
    event_type?: PingbackEventType
    user_id?: string
    logged_in_user_id?: string
    action_type: string
    random_id?: string
    attributes: any
    ts: number
}

// TODO remove api key
const pingBackUrl = 'https://pingback.giphy.com/v2/pingback?apikey=l0HlIwPWyBBUDAUgM'

export const sendPingback = (events: PingbackV2Event[]) => {
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

let queuedPingbackEvents: PingbackV2Event[] = []

function sendPingbacks() {
    sendPingback(queuedPingbackEvents)
    queuedPingbackEvents = []
}

export type PingbackGifEvent = PingbackV2Event & {
    analytics_response_payload: string
}

const pingback = ({ gif, user, type: pingbackType, actionType, position, attributes = [] }: Pingback) => {
    if (
        position &&
        // apppend position only if it's not passed as a custom attribute
        !attributes.some((attributes) => attributes.key === 'position')
    ) {
        attributes.push({
            key: `position`,
            value: JSON.stringify(position),
        })
    }
    // save the user id for whenever create session is invoked
    loggedInUserId = user?.id ? String(user?.id) : loggedInUserId

    /* istanbul ignore next */
    // get the giphy_pbid cookie
    const user_id = cookie.parse(document ? document.cookie : ({} as any)).giphy_pbid

    const newEvent: PingbackV2Event = {
        ts: Date.now(),
        attributes: Object.fromEntries(attributes.map(({ key, value }) => [key, value])),
        action_type: actionType,
    }

    if (loggedInUserId) {
        newEvent.logged_in_user_id = loggedInUserId
    }

    if (gif) {
        // @ts-ignore
        if (!gif.analytics_response_payload) {
            // abort pingback, analytics_response_payload is required for gif events
            return
        }
        const gifEvent = newEvent as PingbackGifEvent
        // @ts-ignore
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

    debouncedPingbackEvent()
}

export default pingback
