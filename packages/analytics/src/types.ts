import { PingbackEventType } from '@giphy/js-types'

export type PingbackAttributes = { [key: string]: string }

export type Pingback = {
    userId?: string | number
    eventType?: PingbackEventType
    actionType: PingbackActionType
    attributes?: PingbackAttributes
    queueEvents?: boolean
    analyticsResponsePayload: string
}

export type PingbackActionType = 'CLICK' | 'SEEN' | 'HOVER' | 'FAVORITE' | 'SENT' | 'START'

export type PingbackEvent = {
    event_type?: PingbackEventType
    user_id?: string
    logged_in_user_id?: string
    action_type: string
    random_id?: string
    attributes: any
    ts: number
    analytics_response_payload?: string
}
