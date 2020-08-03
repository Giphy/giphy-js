/* eslint-disable no-dupe-class-members */
import cookie from 'cookie'
import qs from 'qs'
import { normalizeGif, normalizeGifs } from './normalize/gif'
import {
    CategoriesOptions,
    MediaType,
    PaginationOptions,
    RandomOptions,
    RelatedOptions,
    SearchOptions,
    SubcategoriesOptions,
    TrendingOptions,
    TypeOption,
} from './option-types'
import request from './request'
import { CategoriesResult, GifResult, GifsResult } from './result-types'

const getType = (options?: TypeOption): MediaType => (options && options.type ? options.type : 'gifs')
/**
 * @class GiphyFetch
 * @param {string} apiKey
 */
export class GiphyFetch {
    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    /**
     * @hidden
     */
    private apiKey: string
    /**
     * @hidden
     */
    private getQS = (options: any = {}) => {
        const { giphy_pbid: pingback_id } =
            typeof document !== 'undefined' ? cookie.parse(document.cookie) : ({} as any)
        return qs.stringify({ ...options, api_key: this.apiKey, pingback_id })
    }

    /**
     * A list of categories
     *
     * @param {CategoriesOptions} [options]
     * @returns {Promise<CategoriesResult>}
     */
    categories(options?: CategoriesOptions): Promise<CategoriesResult> {
        return request(`gifs/categories?${this.getQS(options)}`) as Promise<CategoriesResult>
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

    emoji(options?: PaginationOptions): Promise<GifsResult> {
        return request(`emoji?${this.getQS(options)}`, normalizeGifs, 'EMOJI') as Promise<GifsResult>
    }

    /**
     * @param term: string The term you're searching for
     * @param options: SearchOptions
     * @returns {Promise<GifsResult>}
     **/
    search(term: string, options: SearchOptions = {}): Promise<GifsResult> {
        const q = options.channel ? `@${options.channel} ${term}` : term
        const qsParams = this.getQS({ ...options, q })
        const pingbackType = options.type === 'text' ? 'TEXT_SEARCH' : options.explore ? 'GIF_EXPLORE' : 'GIF_SEARCH'
        return request(`${getType(options)}/search?${qsParams}`, normalizeGifs, pingbackType) as Promise<GifsResult>
    }

    /**
     * Get a list of subcategories
     * @param {string} category
     * @param {SubcategoriesOptions} options
     * @returns {Promise<CategoriesResult>}
     */
    subcategories(category: string, options?: SubcategoriesOptions): Promise<CategoriesResult> {
        return request(`gifs/categories/${category}?${this.getQS(options)}`) as Promise<CategoriesResult>
    }

    /**
     * Get trending gifs
     *
     * @param {TrendingOptions} options
     * @returns {Promise<GifsResult>}
     */
    trending(options: TrendingOptions = {}): Promise<GifsResult> {
        const pingbackType = options.type === 'text' ? 'TEXT_TRENDING' : 'GIF_TRENDING'
        return request(`${getType(options)}/trending?${this.getQS(options)}`, normalizeGifs, pingbackType) as Promise<
            GifsResult
        >
    }

    /**
     * Get a random gif
     * @param {RandomOptions}
     * @returns {Promise<GifResult>}
     **/
    random(options?: RandomOptions): Promise<GifResult> {
        return request(`${getType(options)}/random?${this.getQS(options)}`, normalizeGif, undefined, true) as Promise<
            GifResult
        >
    }

    /**
     * Get related gifs by a id
     * @param {string} id
     * @param {SubcategoriesOptions} options
     * @returns {Promise<GifsResult>}
     **/
    related(id: string, options?: RelatedOptions): Promise<GifsResult> {
        return request(
            `gifs/related?${this.getQS({ gif_id: id, ...options })}`,
            normalizeGifs,
            'GIF_RELATED'
        ) as Promise<GifsResult>
    }
}
export default GiphyFetch
