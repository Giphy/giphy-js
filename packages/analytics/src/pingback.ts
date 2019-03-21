import { debounce, forEach } from 'lodash'
import { createSession } from './session'
import { Pingback, PingbackRequestAction, PingbackEventType } from './types'
import { getAction } from './util'

// TODO remove api key
const pingBackUrl = 'https://pingback.giphy.com/pingback?apikey=l0HlIwPWyBBUDAUgM'

// const pingBackUrl_debug = 'https://pingback.giphy.com/pingback_debug?apikey=l0HlIwPWyBBUDAUgM'
type ActionMap = { [key: string]: PingbackRequestAction[] }

const queuedPingbacks: { [key in PingbackEventType]?: ActionMap } = {}

let loggedInUserId = ''

const debouncedPingbackEvent = debounce(fetchPingbackRequest, 1000)

// for IntervalCalls and UnmountCalls
export function fetchPingbackRequest() {
    // if there are no actions lined up inside this pingbackType do nothing
    // TODO remove lodash
    forEach(Object.keys(queuedPingbacks), pingbackTypeKeys => {
        const pingbackType = pingbackTypeKeys as PingbackEventType
        const actionMap = queuedPingbacks[pingbackType]
        if (actionMap) {
            forEach(Object.keys(actionMap), responseId => {
                if (actionMap[responseId].length) {
                    const session = createSession(pingbackType, actionMap[responseId], responseId, loggedInUserId)
                    fetch(pingBackUrl, {
                        method: 'POST',
                        body: JSON.stringify({ sessions: [session] }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    // empty this specific batch
                    actionMap[responseId] = []
                }
            })
        }
    })
}

const pingback = ({ gif, user, searchResponseId, type: pingbackType, actionType, position }: Pingback) => {
    const {
        id,
        bottle_data: { tid },
    } = gif

    // save the user id for whenever create session is invoked
    loggedInUserId = user ? String(user.id) : loggedInUserId

    // the queue doesn't exist for this pingbackType yet so create it
    if (!queuedPingbacks[pingbackType]) {
        queuedPingbacks[pingbackType] = {}
    }

    // a map of actions based on pingback type
    const actionMap = queuedPingbacks[pingbackType]! // we just created it so ! is ok

    // create the searchRepsonseId queue
    if (!actionMap[searchResponseId]) {
        actionMap[searchResponseId] = []
    }
    // add the action
    actionMap[searchResponseId].push(getAction(actionType, String(id), tid, position))
    // if there's a tid, skip the queue
    if (tid) {
        fetchPingbackRequest()
    } else {
        debouncedPingbackEvent()
    }
}

export default pingback
