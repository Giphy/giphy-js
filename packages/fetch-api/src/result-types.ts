import { IChannel, IGif } from '@giphy/js-types'

export interface ResultMeta {
    msg: string
    response_id: string
    status: number
}

export interface ResultPagination {
    count: number
    total_count: number
    offset: number
}

export interface Result {
    meta: ResultMeta
    pagination: ResultPagination
}

export interface ErrorResult {
    message?: string
    meta?: ResultMeta
}
export interface GifResult extends Result {
    data: IGif
}
export interface GifsResult extends Result {
    data: IGif[]
}

export interface NonPaginatedGifsResult {
    data: IGif[]
    meta: ResultMeta
}

export interface ICategory {
    gif?: IGif
    name: string
    name_encoded: string
    subcategories: ICategory[]
}
export interface CategoriesResult extends Result {
    data: ICategory[]
}

export interface ChannelsResult extends Result {
    data: IChannel[]
}
