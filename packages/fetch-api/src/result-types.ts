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
export interface GifResult extends Result {
    data: IGif
}
export interface GifsResult extends Result {
    data: IGif[]
}

interface Category {
    gif?: IGif
    name: string
    name_encoded: string
    subcategories: Category
}
export interface CategoriesResult extends Result {
    data: Category[]
}
