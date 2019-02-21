import { take, without, map, pick } from 'lodash'
import bestfit from './bestfit'
import { IGif, ImageAllTypes } from '@giphy-js/types'

let SUPPORTS_WEBP: null | boolean = null

const RENDITIONS = ['original', 'fixed_width', 'fixed_height', 'fixed_width_small', 'fixed_height_small']

export const checkIfWebP = () =>
    new Promise(resolve => {
        if (SUPPORTS_WEBP !== null) {
            return resolve()
        }

        const webp = new Image()
        webp.onload = () => {
            SUPPORTS_WEBP = true
            resolve()
        }
        webp.onerror = () => {
            SUPPORTS_WEBP = false
            resolve()
        }
        webp.src =
            'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })

export const getSpecificRendition = (
    { images, is_sticker: isSticker }: IGif,
    renditionLabel: string,
    isStill = false,
    useVideo = false,
) => {
    if (!images || !renditionLabel) return ''

    const rendition = images[`${renditionLabel}${isStill ? '_still' : ''}`] as ImageAllTypes

    if (rendition) {
        if (isSticker || isStill) {
            return rendition.url
        }
        const webP = SUPPORTS_WEBP && rendition.webp
        return useVideo ? rendition.mp4 : webP || rendition.url
    }

    return ''
}

export const getBestRendition = ({ images }, gifWidth, gifHeight, isStill = false, useVideo = false) => {
    if (!gifWidth || !gifHeight || !images) return ''
    const checkRenditions = pick(images, RENDITIONS)
    const testImages = map(checkRenditions, (val, key) => ({ key, ...val }))
    const { key } = bestfit(testImages, gifWidth, gifHeight)
    const rendition = images[`${key}${isStill ? '_still' : ''}`]
    const match = useVideo ? rendition.mp4 : SUPPORTS_WEBP && rendition.webp ? rendition.webp : rendition.url
    return match || ''
}

export const getGifHeight = ({ images }, gifWidth) => {
    const { fixed_width } = images
    if (fixed_width) {
        const { width, height } = fixed_width
        const aspectRatio = parseInt(width) / parseInt(height)
        return Math.round(gifWidth / aspectRatio)
    }
    return 0
}

/**
 * GIF Text - Alt Text: Generates alt text for
 * GIF images based on username and tags.
 * @prop  {Gif}
 * @return {String} GIF alt text.
 */
export const getAltText = ({ user, tags = [], is_sticker = false, title = '' }: IGif) => {
    if (title) {
        return title
    }
    const username = (user && user.name) || ''
    const filteredTags = take(without(tags, 'transparent'), username ? 4 : 5)
    return `${username} ${filteredTags.join(' ')} ${is_sticker ? 'Sticker' : 'GIF'}`
}
