import 'intersection-observer'
import { h, render } from 'preact'
import Carousel from './components/carousel'
import Grid from './components/grid'
import Gif, { Props as GifProps } from './components/gif'
import { appendGiphySDKRequestHeader } from '@giphy/js-util'

export { default as Carousel } from './components/carousel'
export { default as Gif } from './components/gif'
export { default as Grid } from './components/grid'

// @ts-ignore
const { version } = require('../package.json')
// send headers with library type and version
appendGiphySDKRequestHeader(`X-GIPHY-SDK-NAME`, 'JavascriptSDK')
appendGiphySDKRequestHeader(`X-GIPHY-SDK-VERSION`, version)

/**
 * render a grid
 *
 * @param gridProps grid props
 * @param target the node to render into it
 */
export const renderGrid = (gridProps: Grid['props'], target: HTMLElement): Element => {
    render(<Grid {...gridProps} />, target)
    return target.querySelector(`.${gridProps.className || Grid.className}`)!
}

/**
 * render a carousel
 *
 * @param carouselProps Carousel props
 * @param target the node to render into it
 */
export const renderCarousel = (carouselProps: Carousel['props'], target: HTMLElement): Element => {
    render(<Carousel {...carouselProps} />, target)
    return target.querySelector(`.${carouselProps.className || Carousel.className}`)!
}

/**
 * render a grid
 *
 * @param gif Gif props
 * @param target the node to render into it
 */
export const renderGif = (gifProps: GifProps, target: HTMLElement): Element => {
    render(<Gif {...gifProps} />, target)
    return target.querySelector(`.${gifProps.className || Gif.className}`)!
}
