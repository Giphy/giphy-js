import { IRendition } from '@giphy/js-types'

const chooseFunc = (width: number, height: number) => (renditions: IRendition[]) => {
    let currentBest = Infinity
    let result: IRendition
    renditions.forEach((rendition: IRendition) => {
        const widthPercentage = rendition.width / width
        const heightPercentage = rendition.height / height
        // a width percentage of 1 is exact, 2 is double, .5 half etc
        const areaPercentage = widthPercentage * heightPercentage
        // img could be bigger or smaller
        const testBest = Math.abs(1 - areaPercentage) // the closer to 0 the better
        if (testBest < currentBest) {
            currentBest = testBest
            result = rendition
        }
    })
    return result!
}
/**
 * Finds image rendition that best fits a given container preferring images
 * ##### Note: all renditions are assumed to have the same aspect ratio
 *
 * When we have a portrait target and landscape gif, we choose a higher rendition to match
 * the height of the portrait target, otherwise it's blurry (same applies for landscape to portrait)
 *
 * @name bestfit
 * @function
 * @param {Array.<Object>} renditions available image renditions each having a width and height property
 * @param {Number} width
 * @param {Number} height
 */
function bestfit(renditions: Array<IRendition>, width: number, height: number) {
    let result
    const choose = chooseFunc(width, height)
    const [testRendition] = renditions

    // landscape target, portrait gif
    if (width > height && testRendition.width < testRendition.height) {
        // make sure the rendition is as wide as the target
        result = choose(renditions.filter(rendition => rendition.width >= width))
    }
    // portrait target, landscape gif
    if (width < height && testRendition.width > testRendition.height) {
        // make sure the rendition is as tall as the target
        result = choose(renditions.filter(rendition => rendition.height >= height))
    }
    // matching target and rendition
    result = result || choose(renditions)
    return result
}

export default bestfit
