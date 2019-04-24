import 'intersection-observer'
import { h, render } from 'preact'
import Carousel from './components/carousel'
import Grid from './components/grid'
import Gif from './components/gif'

export { default as Carousel } from './components/carousel'
export { default as Gif } from './components/gif'
export { default as Grid } from './components/grid'

/**
 * render a grid
 *
 * @param gridProps grid props
 * @param target the node to render into it
 */
export const renderGrid = (gridProps: Grid['props'], target: HTMLElement) => {
    // preact will append if there's no existing node
    const existingNode = target.querySelector(`.${gridProps.className || Grid.className}`)!
    return render(<Grid {...gridProps} />, target, existingNode)
}

/**
 * render a carousel
 *
 * @param carouselProps Carousel props
 * @param target the node to render into it
 */
export const renderCarousel = (carouselProps: Carousel['props'], target: HTMLElement) => {
    // preact will append if there's no existing node
    const existingNode = target.querySelector(`.${carouselProps.className || Carousel.className}`)!
    return render(<Carousel {...carouselProps} />, target, existingNode)
}

/**
 * render a grid
 *
 * @param gif Gif props
 * @param target the node to render into it
 */
export const renderGif = (gifProps: Gif['props'], target: HTMLElement) => {
    // preact will append if there's no existing node
    const existingNode = target.querySelector(`.${gifProps.className || Gif.className}`)!
    return render(<Gif {...gifProps} />, target, existingNode)
}
