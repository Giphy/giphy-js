import { IGif, IImage, IRendition } from '@giphy/js-types'
import { bestfit } from '@giphy/js-util'

const getBestMedia = (video: IGif['video'], width: number, height: number) => {
    let assets = video?.assets
    if (assets) {
        assets = { ...assets }
        // @ts-ignore we don't show source according to the existing code
        delete assets.source
        const filteredAssets = Object.values(assets).sort((a: IRendition, b: IRendition) => a.width - b.width)
        return bestfit(filteredAssets, width, height) as IImage
    }
}

export default getBestMedia
