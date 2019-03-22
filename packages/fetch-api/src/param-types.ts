import { MediaType } from './api'
export type ChooseType = {
    type?: MediaType
}
export type OptionalParams = {
    limit?: number
    offset?: number
} & ChooseType
export type TrendingParams = {
    rating?: Rating
} & OptionalParams
export type RandomParams = {
    tag?: string
    rating?: Rating
} & OptionalParams &
    ChooseType
type Rating = 'pg' | 'g' | 'unrated' | 'pg-13' | 'r'
type SortTypes = 'relevant' | 'recent'
export type SearchOptions = {
    sort?: SortTypes
} & ChooseType
