import { IImages } from './images'
import IUser from './user'
import IVideo from './video'

interface IBottleData {
    tid?: string
    tags?: string[]
}

export default interface IGif {
    type: 'video' | 'gif' | 'text'
    id: string | number
    slug: string
    url: string
    bitly_gif_url: string
    bitly_url: string
    embed_url: string
    username: string
    source: string
    rating: string
    content_url: string
    source_tld: string
    source_post_url: string
    is_indexable: boolean
    is_sticker: boolean
    import_datetime: string
    trending_datetime: string
    user: IUser
    images: IImages
    title: string
    is_hidden: boolean
    is_scheduled: boolean
    is_removed: boolean
    tags: string[]
    bottle_data: IBottleData
    analytics_response_payload: string
    video?: IVideo
}
