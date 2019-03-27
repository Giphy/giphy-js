export type MediaType = 'stickers' | 'gifs'

type Rating = 'pg' | 'g' | 'unrated' | 'pg-13' | 'r'
type SortTypes = 'relevant' | 'recent'

export type TypeOption = {
    type?: MediaType
}

type PaginationOptions = {
    limit?: number
    offset?: number
}

export type CategoriesOptions = PaginationOptions
export type SubcategoriesOptions = PaginationOptions
export type RelatedOptions = PaginationOptions

export type TrendingOptions = {
    rating?: Rating
} & PaginationOptions &
    TypeOption

export type RandomOptions = {
    tag?: string
    rating?: Rating
} & PaginationOptions &
    TypeOption

export type SearchOptions = {
    sort?: SortTypes
    rating?: Rating
    lang?: string
} & TypeOption &
    PaginationOptions
