import { IGif, IUser, PingbackEventType } from '@giphy/js-types'

export type PingbackAttribute = {
    key: string
    value: string
}

export type Pingback = {
    gif: IGif
    user: Partial<IUser>
    pingbackType?: PingbackEventType
    actionType: PingbackActionType
    position?: ClientRect
    attributes?: PingbackAttribute[]
}

export type PingbackActionType = 'CLICK' | 'SEEN' | 'HOVER' | 'FAVORITE' | 'SENT'

export type PingbackRequestEvent = {
    event_type?: PingbackEventType
    analytics_response_payload: string
    user_id?: string
    logged_in_user_id?: string
    action_type: string
    random_id?: string
    attributes: any
    ts: number
}
