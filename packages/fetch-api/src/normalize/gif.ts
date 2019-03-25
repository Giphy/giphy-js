import { IGif } from '@giphy/js-types'
import { GifsResult, GifResult } from '../result-types'

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
]

export const USER_BOOL_PROPS = ['suppress_chrome', 'is_public']

const makeBool = (obj: any) => (prop: string) => (obj[prop] = !!obj[prop])

type Tag = { text: string }

const getTag = (tag: Tag | string) => (typeof tag === 'string' ? (tag as string) : (tag as Tag).text)

const normalize = (gif: any, responseId?: string) => {
    const newGif: IGif = { ...gif }
    newGif.id = String(newGif.id)
    newGif.tags = newGif.tags.map(getTag)
    if (!newGif.bottle_data) {
        newGif.bottle_data = {} as any
    }
    if (responseId) {
        // @ts-ignore
        newGif.response_id = responseId
    }
    BOOL_PROPS.forEach(makeBool(newGif))
    const { user } = newGif
    if (user) {
        const newUser = { ...user }
        USER_BOOL_PROPS.forEach(makeBool(newUser))
        newGif.user = newUser
    }
    return newGif
}

export const normalizeGif = (result: GifResult) => {
    const { response_id } = result.meta
    result.data = normalize(result.data, response_id)
    return result
}

export const normalizeGifs = (result: GifsResult) => {
    const { response_id } = result.meta
    result.data = result.data.map(gif => normalize(gif, response_id))
    return result
}
