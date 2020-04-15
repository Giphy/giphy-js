import { IRendition } from '@giphy/js-types'
import { Logger } from './log'

const closestArea = (width: number, height: number, renditions: IRendition[]) => {
    let currentBest = Infinity
    let result: IRendition
    // sort the renditions so we can avoid scaling up low resolutions
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

let SCALE_UP_MAX_PIXELS = 50
export const setRenditionScaleUpMaxPixels = (pixels: number) => {
    Logger.debug(`@giphy/js-util set rendition selection scale up max pixels to ${pixels}`)
    SCALE_UP_MAX_PIXELS = pixels
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
 * @param {Number} scaleUpMaxPixels the maximum pixels an asset should be scaled up
 */
function bestfit(
    renditions: Array<IRendition>,
    width: number,
    height: number,
    scaleUpMaxPixels: number = SCALE_UP_MAX_PIXELS
) {
    let [largestRendition] = renditions
    // filter out renditions that are smaller than the target width and height by scaleUpMaxPixels value
    const testRenditions = renditions.filter(rendition => {
        if (rendition.width * rendition.height > largestRendition.width * largestRendition.height) {
            largestRendition = rendition
        }
        return width - rendition.width <= scaleUpMaxPixels && height - rendition.height <= scaleUpMaxPixels
    })
    // if all are too small, use the largest we have
    if (testRenditions.length === 0) {
        return largestRendition
    }
    // find the closest area of the filtered renditions
    return closestArea(width, height, testRenditions)
}

export default bestfit
