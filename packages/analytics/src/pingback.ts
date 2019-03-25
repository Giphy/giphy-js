import { debounce } from 'throttle-debounce'
import { createSession } from './session'
import { Pingback, PingbackRequestAction, PingbackEventType } from './types'
import { getAction } from './util'
import { forEach } from '@giphy/js-util'
import { sendPingback } from './send-pingback'

type ActionMap = { [key: string]: PingbackRequestAction[] }

const queuedPingbacks: { [key in PingbackEventType]?: ActionMap } = {}

let loggedInUserId = ''

function fetchPingbackRequest() {
    forEach(queuedPingbacks, (actionMap: ActionMap, pingbackType: PingbackEventType) => {
        if (actionMap) {
            forEach(actionMap, (action: PingbackRequestAction[], responseId: string) => {
                // if there are no actions lined up inside this pingbackType do nothing
                if (action.length) {
                    const session = createSession(pingbackType, action, responseId, loggedInUserId)
                    sendPingback(session)
                    // empty this specific batch
                    actionMap[responseId] = []
                }
            })
        }
    })
}

const debouncedPingbackEvent = debounce(1000, fetchPingbackRequest)

const pingback = ({ gif, user, searchResponseId, type: pingbackType, actionType, position }: Pingback) => {
    const { id, bottle_data = {} } = gif
    const { tid } = bottle_data

    // save the user id for whenever create session is invoked
    loggedInUserId = user && user.id ? String(user.id) : loggedInUserId

    // the queue doesn't exist for this pingbackType yet so create it
    if (!queuedPingbacks[pingbackType]) queuedPingbacks[pingbackType] = {}

    // a map of actions based on pingback type
    const actionMap = queuedPingbacks[pingbackType]! // we just created it so ! is ok

    // create the searchRepsonseId queue
    if (!actionMap[searchResponseId]) actionMap[searchResponseId] = []

    // add the action
    actionMap[searchResponseId].push(getAction(actionType, String(id), tid!, position))

    // if there's a tid, skip the queue
    tid ? fetchPingbackRequest() : debouncedPingbackEvent()
}

export default pingback
