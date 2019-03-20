import cookie from 'cookie'
import { debounce, forEach } from 'lodash'
import getLastSearchResponseId from './response-ids'
import { EventType, Pingback, PingbackRequestAction, PingbackType } from './types'
import { getAction } from './util'

const pingBackUrl = 'https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM'
// const pingBackUrl_debug = 'https://pingback.giphy.com/pingback_debug?apikey=l0HlIwPWyBBUDAUgM'
const queuedEvents: { [key in PingbackType]?: any } = {}
let loggedInUserId = ''
const debouncedPingbackEvent = debounce(fetchPingbackRequest, 1000)

const map: { [key in PingbackType]: EventType } = {
    trending_grid: 'GIF_TRENDING',
    trending_carousel: 'GIF_TRENDING',
    related_grid: 'GIF_RELATED',
    channel_grid: 'GIF_CHANNEL',
    search_grid: 'GIF_SEARCH',
    universal_search: 'GIF_SEARCH',
    suggested_terms: 'GIF_SEARCH',
    explore_grid: 'GIF_EXPLORE',
}
const getActions = (queuedEventsForType, searchResponseId) =>
    queuedEventsForType && searchResponseId ? queuedEventsForType[searchResponseId] : null

export const createSession = (pingbackType: PingbackType, searchResponseId?: string) => ({
    user: {
        user_id: cookie.parse(document.cookie).giphy_pbid,
        logged_in_user_id: loggedInUserId,
    },
    events: [
        {
            event_type: map[pingbackType],
            referrer: document && document.referrer ? document.referrer : null,
            actions: getActions(queuedEvents[pingbackType], searchResponseId),
            response_id: searchResponseId,
            previous_response_id: getLastSearchResponseId() || null,
        },
    ],
})

// for IntervalCalls and UnmountCalls
export function fetchPingbackRequest() {
    // if there are no actions lined up inside this pingbackType do nothing
    forEach(Object.keys(queuedEvents), pingbackTypeKeys => {
        if (Array.isArray(queuedEvents[pingbackTypeKeys])) {
            if (queuedEvents[pingbackTypeKeys].length) {
                const session = createSession(pingbackTypeKeys as PingbackType)
                fetch(pingBackUrl, {
                    method: 'POST',
                    body: JSON.stringify({ sessions: [session] }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                // empty this specific batch
                queuedEvents[pingbackTypeKeys] = []
            }
        } else {
            // if the nested value is an object loop over the keys otherwise take what is there
            forEach(Object.keys(queuedEvents[pingbackTypeKeys]), pingBackResponseIdKeys => {
                if (queuedEvents[pingbackTypeKeys][pingBackResponseIdKeys].length) {
                    const session = createSession(pingbackTypeKeys as PingbackType, pingBackResponseIdKeys)
                    fetch(pingBackUrl, {
                        method: 'POST',
                        body: JSON.stringify({ sessions: [session] }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    // empty this specific batch
                    queuedEvents[pingbackTypeKeys][pingBackResponseIdKeys] = []
                }
            })
        }
    })
}

export function firePingBackEvent(
    type: PingbackType,
    action: PingbackRequestAction,
    searchResponseId: string,
    userId: string,
    skipQueue = false,
) {
    if (loggedInUserId) {
        // we don't need anything more than the user.id
        loggedInUserId = userId
    }
    // the queue doesn't exist for this pingbackType yet so create it and create the corresponding searchResponseId key
    if (!queuedEvents[type] && action) {
        queuedEvents[type] = {}
        queuedEvents[type][searchResponseId] = [action]
        // the group exists but the searchRepsonseId queue does not so create it
    } else if (!queuedEvents[type][searchResponseId] && action) {
        queuedEvents[type][searchResponseId] = [action]
        // the queue exists already so just store it into the appropriate type queue
    } else if (action) {
        queuedEvents[type][searchResponseId].push(action)
    }
    skipQueue ? fetchPingbackRequest() : debouncedPingbackEvent()
}

const pingback = ({ gif, user, searchResponseId, type, actionType, position }: Pingback) => {
    const { id, bottle_data = { tid: '' } } = gif
    const { tid } = bottle_data
    const skipQueue = !!tid
    const action = getAction(actionType, String(id), tid, position)
    firePingBackEvent(type, action, searchResponseId, user ? String(user.id) : '', skipQueue)
}

export default pingback
