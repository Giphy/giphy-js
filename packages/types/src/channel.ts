import IGif from './gif'
import IUser from './user'

interface IChannelTag {
    id: number
    channel: number
    tag: string
    rank?: number
}

export interface IChannel {
    id: number
    url: string
    display_name: string
    parent: number
    slug: string
    type: string
    content_type: 'gif' | 'video' | 'sticker'
    short_display_name: string
    description: string
    metadata_description: string
    has_children: boolean
    is_visible: boolean
    is_private: boolean
    is_live: boolean
    user: IUser
    featured_gif: IGif
    tags: IChannelTag[]
    live_since_datetime: string | null | number
    live_until_datetime: string | null | number
    screensaver_gif: IGif | null
    banner_image: string | null
    ancestors: IChannel[]
    children: IChannel[]
    syncable_tags: IChannelTag[]
    is_common?: boolean
}
