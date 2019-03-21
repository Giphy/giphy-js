import cookie from 'cookie'
import { PingbackEventType, PingbackRequestAction } from './types'

type SessionEvent = {
    event_type: PingbackEventType
    referrer: string
    actions: PingbackRequestAction[]
    response_id?: string
    previous_response_id?: string
}
export type Session = {
    user: {
        user_id: string
        logged_in_user_id: string
    }
    events: SessionEvent[]
}

function getLastSearchResponseId(): string {
    try {
        const sessionIds = sessionStorage.getItem('responseIds')
        if (sessionIds) {
            const searchResponseIds = JSON.parse(sessionIds) || []
            return searchResponseIds[searchResponseIds.length - 2] || ''
        }
    } catch (e) {
        console.error(e)
    }
    return ''
}

// the session is the request payload of a pingback request
export const createSession = (
    event_type: PingbackEventType,
    actions: PingbackRequestAction[],
    searchResponseId: string = '',
    loggedInUserId: string = '',
): Session => ({
    user: {
        user_id: cookie.parse(document.cookie).giphy_pbid,
        logged_in_user_id: loggedInUserId,
    },
    events: [
        {
            event_type,
            referrer: document ? document.referrer : '',
            actions,
            response_id: searchResponseId,
            previous_response_id: getLastSearchResponseId(),
        },
    ],
})
