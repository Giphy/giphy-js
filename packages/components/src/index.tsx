import { appendGiphySDKRequestHeader } from '@giphy/js-util'
import 'intersection-observer'
import { ComponentProps, h, render } from 'preact'
import Carousel from './components/carousel'
import Gif, { Props as GifProps } from './components/gif'
import Grid from './components/grid'
import Video from './components/video'

export { default as Carousel } from './components/carousel'
export { default as Gif } from './components/gif'
export { default as Grid } from './components/grid'
export { default as Video } from './components/video'

// @ts-ignore
const { version } = require('../package.json')
// send headers with library type and version
appendGiphySDKRequestHeader(`X-GIPHY-SDK-NAME`, 'JavascriptSDK')
appendGiphySDKRequestHeader(`X-GIPHY-SDK-VERSION`, version)

type RemoveCallback = () => void
/**
 * render a grid
 *
 * @param gridProps grid props
 * @param target the node to render into it
 */
export const renderGrid = (gridProps: Grid['props'], target: HTMLElement): RemoveCallback => {
    render(<Grid {...gridProps} />, target)
    return () => render(null, target)
}

/**
 * render a video
 *
 * @param carouselProps Carousel props
 * @param target the node to render into it
 */
export const renderVideo = (videoProps: ComponentProps<typeof Video>, target: HTMLElement): RemoveCallback => {
    render(<Video {...videoProps} />, target)
    return () => render(null, target)
}

/**
 * render a carousel
 *
 * @param carouselProps Carousel props
 * @param target the node to render into it
 */
export const renderCarousel = (carouselProps: Carousel['props'], target: HTMLElement): RemoveCallback => {
    render(<Carousel {...carouselProps} />, target)
    return () => render(null, target)
}

/**
 * render a grid
 *
 * @param gif Gif props
 * @param target the node to render into it
 */
export const renderGif = (gifProps: GifProps, target: HTMLElement): RemoveCallback => {
    render(<Gif {...gifProps} />, target)
    return () => render(null, target)
}
