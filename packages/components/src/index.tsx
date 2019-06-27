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
export const renderGrid = (gridProps: Grid['props'], target: HTMLElement): Element => {
    // preact will append if there's no existing node
    const selector = `.${gridProps.className || Grid.className}`
    const existingNode = target.querySelector(selector)!
    render(<Grid {...gridProps} />, target, existingNode)
    return target.querySelector(selector)!
}

/**
 * render a carousel
 *
 * @param carouselProps Carousel props
 * @param target the node to render into it
 */
export const renderCarousel = (carouselProps: Carousel['props'], target: HTMLElement): Element => {
    // preact will append if there's no existing node
    const selector = `.${carouselProps.className || Carousel.className}`
    const existingNode = target.querySelector(selector)!
    render(<Carousel {...carouselProps} />, target, existingNode)
    return target.querySelector(selector)!
}

/**
 * render a grid
 *
 * @param gif Gif props
 * @param target the node to render into it
 */
export const renderGif = (gifProps: Gif['props'], target: HTMLElement): Element => {
    // preact will append if there's no existing node
    const selector = `.${gifProps.className || Gif.className}`
    const existingNode = target.querySelector(selector)!
    render(<Gif {...gifProps} />, target, existingNode)
    return target.querySelector(selector)!
}
