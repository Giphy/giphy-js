import { IGif } from '@giphy/js-types'
import { GifResult, GifsResult } from '../result-types'

/**
 * @hidden
 */
export const BOOL_PROPS = [
    'is_anonymous',
    'is_community',
    'is_featured',
    'is_hidden',
    'is_indexable',
    'is_preserve_size',
    'is_realtime',
    'is_removed',
    'is_sticker',
    'is_dynamic', // not finalized, and not adding to Gif type until type RFC is finished
]

/**
 * @hidden
 */
export const USER_BOOL_PROPS = ['suppress_chrome', 'is_public', 'is_verified']

const makeBool = (obj: any) => (prop: string) => (obj[prop] = !!obj[prop])

type Tag = { text: string }

// tags sometimes are objects that have a text prop, sometimes they're strings
const getTag = (tag: Tag | string) => (typeof tag === 'string' ? (tag as string) : (tag as Tag).text)

const normalize = (gif: any, responseId: string = '') => {
    const newGif: IGif = { ...gif }
    newGif.id = String(newGif.id)
    newGif.tags = (newGif.tags || []).map(getTag)
    if (!newGif.bottle_data) {
        newGif.bottle_data = {} as any
    }
    newGif.response_id = responseId
    BOOL_PROPS.forEach(makeBool(newGif))
    Object.keys(newGif.images || {}).forEach((name: string) => {
        const img = newGif.images[name]
        img.width = parseInt(img.width)
        img.height = parseInt(img.height)
    })

    const { user } = newGif
    if (user) {
        const newUser = { ...user }
        USER_BOOL_PROPS.forEach(makeBool(newUser))
        newGif.user = newUser
    }
    return newGif
}

/**
 * @hidden
 */
export const normalizeGif = (result: GifResult) => {
    const { response_id } = result.meta
    result.data = normalize(result.data, response_id)
    return result
}

/**
 * @hidden
 */
export const normalizeGifs = (result: GifsResult) => {
    const { response_id } = result.meta
    result.data = result.data.map((gif) => normalize(gif, response_id))
    return result
}
