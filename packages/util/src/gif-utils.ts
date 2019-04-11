import { take, pick, without } from './collections'
import bestfit from './bestfit'
import { IGif, ImageAllTypes, IRendition } from '@giphy/js-types'
import { IImages } from '@giphy/js-types/dist/gif'
import { SUPPORTS_WEBP } from './webp-check'

export const getSpecificRendition = (
    { images, is_sticker: isSticker }: IGif,
    renditionLabel: string,
    isStill = false,
    useVideo = false,
) => {
    if (!images || !renditionLabel) return ''
    isStill = isStill && !useVideo
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
    const key = `${renditionName}${isStill && !useVideo ? '_still' : ''}`
    // @ts-ignore come back to this
    const rendition = images[key]
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
    return `${username ? `${username} ` : ``}${filteredTags.join(' ')} ${is_sticker ? 'Sticker' : 'GIF'}`
}
