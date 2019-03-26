/* eslint-disable no-dupe-class-members */
import qs from 'qs'
import request from './request'
import { CategoriesResult, GifResult, GifsResult } from './result-types'
import { TypeParam, OptionalParams, SearchOptions, TrendingParams, RandomParams } from './param-types'
import { normalizeGifs, normalizeGif } from './normalize/gif'

export type MediaType = 'stickers' | 'gifs'

const getType = (params?: TypeParam): MediaType => (params && params.type ? params.type : 'gifs')
/**
 * @class GiphyFetch
 * @param {string} apiKey
 */
class GiphyFetch {
    constructor(apiKey: string) {
        this.apiKey = apiKey
    }
    private apiKey: string
    private getQS = (params: any = {}) => qs.stringify({ ...params, api_key: this.apiKey })

    /**
     * A list of categories
     *
     * @param {OptionalParams} [params]
     * @returns {Promise<CategoriesResult>}
     */
    categories(params?: OptionalParams): Promise<CategoriesResult> {
        return request(`gifs/categories?${this.getQS(params)}`) as Promise<CategoriesResult>
    }

    /**
     * Get a single gif by a id
     * @param {string} id
     * @returns {Promise<GifsResult>}
     **/
    gif(id: string): Promise<GifResult> {
        return request(`gifs/${id}?${this.getQS()}`, normalizeGif) as Promise<GifResult>
    }

    /**
     *
     * @function
     * Get gifs by an array of ids
     * @param {string[]} ids
     *
     * @function
     * Get gifs by category and subcategory
     * @param {string} category
     * @param {string} subcategory
     * @returns {Promise<GifsResult>}
     **/
    gifs(ids: string[]): Promise<GifsResult>
    gifs(category: string, subcategory: string): Promise<GifsResult>
    gifs(arg1: any, arg2?: string): Promise<GifsResult> {
        if (Array.isArray(arg1)) {
            return request(`gifs?${this.getQS({ ids: arg1.join(',') })}`, normalizeGifs) as Promise<GifsResult>
        }
        return request(`gifs/categories/${arg1}/${arg2}?${this.getQS()}`, normalizeGifs) as Promise<GifsResult>
    }

    /**
     * @param term: string The term you're searching for
     * @param params: SearchOptions
     * @returns {Promise<GifsResult>}
     **/
    search(term: string, params?: SearchOptions): Promise<GifsResult> {
        const qsParams = this.getQS({ ...params, ...{ q: term } })
        return request(`${getType(params)}/search?${qsParams}`, normalizeGifs) as Promise<GifsResult>
    }

    /**
     * Get a list of subcategories
     * @param {string} category
     * @param {OptionalParams} params
     * @returns {Promise<CategoriesResult>}
     */
    subcategories(category: string, params?: OptionalParams): Promise<CategoriesResult> {
        return request(`gifs/categories/${category}?${this.getQS(params)}`) as Promise<CategoriesResult>
    }

    /**
     * Get trending gifs
     *
     * @param {TrendingParams} params
     * @returns {Promise<GifsResult>}
     */
    trending(params?: TrendingParams): Promise<GifsResult> {
        return request(`${getType(params)}/trending?${this.getQS(params)}`, normalizeGifs) as Promise<GifsResult>
    }

    /**
     * Get random gifs
     * @param {RandomParams}
     * @returns {Promise<GifsResult>}
     **/
    random(params?: RandomParams): Promise<GifResult> {
        return request(`${getType(params)}/random?${this.getQS(params)}`, normalizeGif) as Promise<GifResult>
    }
}
export default GiphyFetch
