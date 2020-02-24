import cookie from 'cookie'
import { PingbackEventType } from '@giphy/js-types'
import { PingbackRequestAction } from './types'

type SessionEvent = {
    event_type: PingbackEventType
    referrer: string
    actions: PingbackRequestAction[]
    response_id?: string
    prior_response_id?: string
}
export type Session = {
    user: {
        user_id: string
        logged_in_user_id: string
    }
    events: SessionEvent[]
}

export const SESSION_STORAGE_KEY = 'responseIds'
function getLastResponseId(): string {
    try {
        const sessionIds = sessionStorage.getItem(SESSION_STORAGE_KEY)
        if (sessionIds) {
            const responseIds = JSON.parse(sessionIds) || []
            return responseIds[responseIds.length - 2] || ''
        }
    } catch (_) {}
    return ''
}

export function addLastSearchResponseId(responseId: string) {
    try {
        const existing = sessionStorage.getItem(SESSION_STORAGE_KEY)
        if (existing) {
            var searchResponseIds = JSON.parse(existing)
            if (searchResponseIds[searchResponseIds.length - 1] !== responseId) {
                window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify([...searchResponseIds, responseId]))
            }
        } else {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify([responseId]))
        }
    } catch (_) {}
}
// the session is the request payload of a pingback request
export const createSession = (
    event_type: PingbackEventType,
    actions: PingbackRequestAction[],
    responseId: string = '',
    loggedInUserId: string = ''
): Session => ({
    user: {
        user_id: cookie.parse(document.cookie).giphy_pbid,
        logged_in_user_id: loggedInUserId || '',
    },
    events: [
        {
            event_type,
            referrer: document ? document.referrer : '',
            actions,
            response_id: responseId,
            prior_response_id: getLastResponseId(),
        },
    ],
})
