/* eslint-disable no-dupe-class-members */
import qs from 'qs'
import request from './request'
import { CategoriesResult, GifResult, GifsResult } from './result-types'
import {
    TypeOption,
    SearchOptions,
    TrendingOptions,
    RandomOptions,
    CategoriesOptions,
    SubcategoriesOptions,
    MediaType,
    RelatedOptions,
    PaginationOptions,
} from './option-types'
import { normalizeGifs, normalizeGif } from './normalize/gif'

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
    private getQS = (options: any = {}) => qs.stringify({ ...options, api_key: this.apiKey })

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
    search(term: string, options?: SearchOptions): Promise<GifsResult> {
        const qsParams = this.getQS({ ...options, ...{ q: term } })
        return request(`${getType(options)}/search?${qsParams}`, normalizeGifs, 'GIF_SEARCH') as Promise<GifsResult>
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
    trending(options?: TrendingOptions): Promise<GifsResult> {
        return request(`${getType(options)}/trending?${this.getQS(options)}`, normalizeGifs, 'GIF_TRENDING') as Promise<
            GifsResult
        >
    }

    /**
     * Get a random gif
     * @param {RandomOptions}
     * @returns {Promise<GifResult>}
     **/
    random(options?: RandomOptions): Promise<GifResult> {
        return request(`${getType(options)}/random?${this.getQS(options)}`, normalizeGif) as Promise<GifResult>
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
            'GIF_RELATED',
        ) as Promise<GifsResult>
    }
}
export default GiphyFetch
