import { MediaType } from './api'

type Rating = 'pg' | 'g' | 'unrated' | 'pg-13' | 'r'
type SortTypes = 'relevant' | 'recent'

export type TypeParam = {
    type?: MediaType
}

export type OptionalParams = {
    limit?: number
    offset?: number
} & TypeParam

export type TrendingParams = {
    rating?: Rating
} & OptionalParams

export type RandomParams = {
    tag?: string
    rating?: Rating
} & OptionalParams &
    TypeParam

export type SearchOptions = {
    sort?: SortTypes
} & TypeParam
