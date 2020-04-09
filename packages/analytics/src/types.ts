import { IGif, IUser, PingbackEventType } from '@giphy/js-types'

export type PingbackAttribute = {
    key: string
    value: string
}

export type Pingback = {
    gif: IGif
    user: Partial<IUser>
    type: PingbackEventType
    responseId: string
    actionType: PingbackActionType
    position?: ClientRect
    attributes?: PingbackAttribute[]
}

export type PingbackActionType = 'CLICK' | 'SEEN' | 'HOVER'

export type PingbackRequestAction = {
    action_type: PingbackActionType
    attributes: any
    gif_id: string
    tid?: string
    ts: number
}
