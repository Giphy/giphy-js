import { IGif } from '@giphy/js-types'

export interface Result {
    meta: {
        msg: string
        response_id: string
        status: number
    }
    pagination: {
        count: number
        total_count: number
        offset: number
    }
}

export interface ErrorResult {
    message?: string
}
export interface GifResult extends Result {
    data: IGif
}
export interface GifsResult extends Result {
    data: IGif[]
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
