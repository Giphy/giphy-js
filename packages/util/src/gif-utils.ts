import { take, pick, without } from './collections'
import bestfit from './bestfit'
import { IGif, ImageAllTypes, IRendition } from '@giphy/js-types'
import { IImages } from '@giphy/js-types/dist/gif'

let SUPPORTS_WEBP: null | boolean = null

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

    // @ts-ignore come back to this
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

interface IRenditionWithName extends IRendition {
    renditionName: keyof IImages
}

export const getBestRendition = (images: IImages, gifWidth: number, gifHeight: number): IRenditionWithName => {
    const checkRenditions = pick(images, [
        'original',
        'fixed_width',
        'fixed_height',
        'fixed_width_small',
        'fixed_height_small',
    ])
    const testImages = Object.entries(checkRenditions).map(([renditionName, val]) => ({
        renditionName,
        ...val,
    })) as IRenditionWithName[]
    return bestfit(testImages, gifWidth, gifHeight) as IRenditionWithName
}

export const getBestRenditionUrl = (
    { images }: IGif,
    gifWidth: number,
    gifHeight: number,
    isStill = false,
    useVideo = false,
): keyof IImages | '' => {
    if (!gifWidth || !gifHeight || !images) return ''
    const { renditionName } = getBestRendition(images, gifWidth, gifHeight)
    // @ts-ignore come back to this
    const rendition = images[`${renditionName}${isStill ? '_still' : ''}`]
    const match = useVideo ? rendition.mp4 : SUPPORTS_WEBP && rendition.webp ? rendition.webp : rendition.url
    return match || ''
}

export const getGifHeight = ({ images }: IGif, gifWidth: number) => {
    const { fixed_width } = images
    if (fixed_width) {
        const { width, height } = fixed_width
        const aspectRatio = width / height
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
export const getAltText = ({ user, tags = [], is_sticker = false, title = '' }: IGif): string => {
    if (title) {
        return title
    }
    const username = (user && user.username) || ''
    const filteredTags = take(without(tags, ['transparent']), username ? 4 : 5)
    return `${username} ${filteredTags.join(' ')} ${is_sticker ? 'Sticker' : 'GIF'}`
}
