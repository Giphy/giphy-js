import { IGif } from '../../types/dist'

export type Result = {
    pagination: {
        count: number
        total_count: number
    }
}
export type GifResult = Result & {
    data: IGif
}
export type GifsResult = Result & {
    data: IGif[]
}

type Category = {
    gif?: IGif
    name: string
    name_encoded: string
    subcategories: Category
}
export type CategoriesResult = Result & {
    data: Category[]
}
