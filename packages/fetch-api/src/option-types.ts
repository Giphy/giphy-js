/**
 * If you want gifs or stickers
 */
export type MediaType = 'stickers' | 'gifs' | 'text' | 'videos'
/**
 * Filters results by specified rating.
 */
type Rating = 'pg' | 'g' | 'y' | 'pg-13' | 'r'
/**
 * Sorting options
 */
type SortTypes = 'relevant' | 'recent'

export interface TypeOption {
    type?: MediaType
}

export interface PaginationOptions {
    // the number of gifs/stickers to fetch
    limit?: number
    // the starting point
    offset?: number
}
export interface CategoriesOptions extends PaginationOptions {}
export interface SubcategoriesOptions extends PaginationOptions {}
export interface RelatedOptions extends PaginationOptions {
    type?: 'gifs' | 'stickers' // no 'text' support, overrride MediaType
}

export interface TrendingOptions extends PaginationOptions, TypeOption {
    rating?: Rating
}

export interface RandomOptions extends PaginationOptions {
    type?: 'gifs' | 'stickers' // no 'text' support, overrride MediaType
    tag?: string
    rating?: Rating
}

export interface SearchOptions extends PaginationOptions, TypeOption {
    sort?: SortTypes
    rating?: Rating
    lang?: string
    channel?: string
    explore?: boolean
}
