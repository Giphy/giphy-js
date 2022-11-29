import { IGif, IImage, IImages, ImageAllTypes, IRendition } from '@giphy/js-types'
import IVideo from '@giphy/js-types/dist/video'
import bestfit from './bestfit'
import { pick, take, without } from './collections'
import { SUPPORTS_WEBP } from './webp-check'

export const getSpecificRendition = (
    { images, is_sticker: isSticker }: IGif,
    renditionLabel: string,
    isStill = false,
    useVideo = false
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

export const getBestVideo = (video: IGif['video'], width: number, height: number) => {
    let assets = video?.assets
    if (assets) {
        assets = { ...assets }
        // @ts-ignore we don't show source according to the existing code
        delete assets.source
        const filteredAssets = Object.values(assets).sort((a: IRendition, b: IRendition) => a.width - b.width)
        return bestfit(filteredAssets, width, height) as IImage
    }
}

const getRenditions = (type: IGif['type'], images: IImages, video?: IVideo) =>
    type === 'video' && video && video.previews && !Object.keys(images).length ? video.previews : images

export const getBestRendition = (
    images: IImages,
    gifWidth: number,
    gifHeight: number,
    scaleUpMaxPixels?: number
): IRenditionWithName => {
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
    return bestfit(testImages, gifWidth, gifHeight, scaleUpMaxPixels) as IRenditionWithName
}

type Options = {
    isStill?: boolean
    useVideo?: boolean
    scaleUpMaxPixels?: number
}
export const getBestRenditionUrl = (
    { images, video, type }: IGif,
    gifWidth: number,
    gifHeight: number,
    options: Options = { isStill: false, useVideo: false }
): keyof IImages | '' => {
    if (!gifWidth || !gifHeight || !images) return ''
    const { useVideo, isStill, scaleUpMaxPixels } = options
    const renditions = getRenditions(type, images, video)
    const { renditionName } = getBestRendition(renditions, gifWidth, gifHeight, scaleUpMaxPixels)

    // still, video, webp or gif
    const key = `${renditionName}${isStill && !useVideo ? '_still' : ''}` as keyof IImages
    const rendition = renditions[key] as ImageAllTypes

    const match = useVideo ? rendition.mp4 : SUPPORTS_WEBP && rendition.webp ? rendition.webp : rendition.url
    return (match || '') as keyof IImages
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

export const getGifWidth = ({ images }: IGif, gifHeight: number) => {
    const { fixed_width } = images
    if (fixed_width) {
        const { width, height } = fixed_width
        const aspectRatio = width / height
        return Math.round(gifHeight * aspectRatio)
    }
    return 0
}

/**
 * GIF Text - Alt Text: Generates alt text for
 * GIF images based on username and tags.
 * @prop  {Gif}
 * @return {String} GIF alt text.
 */
export const getAltText = ({ alt_text, user, tags = [], is_sticker = false, title = '' }: IGif): string => {
    if (alt_text) {
        return alt_text
    }
    if (title) {
        return title
    }
    const username = (user && user.username) || ''
    const filteredTags = take(without(tags, ['transparent']), username ? 4 : 5)
    return `${username ? `${username} ` : ``}${filteredTags.join(' ')} ${is_sticker ? 'Sticker' : 'GIF'}`
}
