/* eslint-disable no-dupe-class-members */
import { getPingbackId } from '@giphy/js-util'
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
import { GifID } from '@giphy/js-types'
import { CategoriesResult, ChannelsResult, GifResult, GifsResult, NonPaginatedGifsResult } from './result-types'

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
        return qs.stringify({ ...options, api_key: this.apiKey, pingback_id: getPingbackId() })
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
        return request(`gifs/${id}?${this.getQS()}`, { normalizer: normalizeGif }) as Promise<GifResult>
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
            return request(`gifs?${this.getQS({ ids: arg1.join(',') })}`, {
                normalizer: normalizeGifs,
            }) as Promise<GifsResult>
        }
        return request(`gifs/categories/${arg1}/${arg2}?${this.getQS()}`, {
            normalizer: normalizeGifs,
        }) as Promise<GifsResult>
    }

    emoji(options?: PaginationOptions): Promise<GifsResult> {
        return request(`emoji?${this.getQS(options)}`, { normalizer: normalizeGifs }) as Promise<GifsResult>
    }

    /**
     * Returns a list of all the default emoji variations
     *
     * @param {PaginationOptions} options
     * @returns {Promise<GifsResult>}
     **/
    emojiDefaultVariations(options?: PaginationOptions): Promise<GifsResult> {
        return request(`emoji?${this.getQS(options)}`, {
            apiVersion: 2,
            normalizer: normalizeGifs,
        }) as Promise<GifsResult>
    }

    /**
     * Returns a list of gifs representing all the variations for the emoji
     *
     * @param {string} id
     * @returns {Promise<NonPaginatedGifsResult>}
     **/
    emojiVariations(id: GifID): Promise<NonPaginatedGifsResult> {
        return request(`emoji/${id}/variations?${this.getQS()}`, {
            apiVersion: 2,
            normalizer: normalizeGifs,
        }) as Promise<GifsResult>
    }

    animate(text: string, options: PaginationOptions = {}): Promise<GifsResult> {
        const qsParams = this.getQS({ ...options, m: text })
        return request(`text/animate?${qsParams}`, { normalizer: normalizeGifs }) as Promise<GifsResult>
    }

    /**
     * @param term: string The term you're searching for
     * @param options: SearchOptions
     * @returns {Promise<GifsResult>}
     **/
    search(term: string, options: SearchOptions = {}): Promise<GifsResult> {
        const q = options.channel ? `@${options.channel} ${term}` : term
        let excludeDynamicResults
        if (options.type === 'text') {
            excludeDynamicResults = true
        }
        const qsParams = this.getQS({ ...options, q, excludeDynamicResults })
        return request(`${getType(options)}/search?${qsParams}`, { normalizer: normalizeGifs }) as Promise<GifsResult>
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
        return request(`${getType(options)}/trending?${this.getQS(options)}`, {
            normalizer: normalizeGifs,
        }) as Promise<GifsResult>
    }

    /**
     * Get a random gif
     * @param {RandomOptions} options
     * @returns {Promise<GifResult>}
     **/
    random(options?: RandomOptions): Promise<GifResult> {
        return request(`${getType(options)}/random?${this.getQS(options)}`, {
            noCache: true,
            normalizer: normalizeGif,
        }) as Promise<GifResult>
    }

    /**
     * Get related gifs by a id
     * @param {string} id
     * @param {SubcategoriesOptions} options
     * @returns {Promise<GifsResult>}
     **/
    related(id: string, options?: RelatedOptions): Promise<GifsResult> {
        return request(
            `${options?.type === 'stickers' ? 'stickers' : 'gifs'}/related?${this.getQS({ gif_id: id, ...options })}`,
            { normalizer: normalizeGifs }
        ) as Promise<GifsResult>
    }

    /**
     * Search for channels based on a term
     * @param {string} term
     * @param options: SearchOptions
     * @returns {Promise<ChannelsResult>}
     **/
    channels(term: string, options: SearchOptions = {}): Promise<ChannelsResult> {
        return request(`channels/search?${this.getQS({ q: term, ...options })}`) as Promise<ChannelsResult>
    }
}
export default GiphyFetch
