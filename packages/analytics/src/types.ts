import { IGif, IUser } from '@giphy/js-types'

export type Pingback = {
    gif: IGif
    user: Partial<IUser>
    type: PingbackEventType
    searchResponseId: string
    actionType: PingbackActionType
    position?: ClientRect
}

export type PingbackActionType = 'CLICK' | 'SEEN' | 'HOVER'

export type PingbackRequestAction = {
    action_type: PingbackActionType
    attributes: any
    gif_id: string
    tid?: string
    ts: number
}

export type PingbackEventType = 'GIF_TRENDING' | 'GIF_RELATED' | 'GIF_CHANNEL' | 'GIF_SEARCH' | 'GIF_EXPLORE'
