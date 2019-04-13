import 'intersection-observer'
import { h, render } from 'preact'
import Carousel, { className as carouselClassName } from './components/carousel'
import Grid, { className as gridClassName } from './components/grid'

export { default as Carousel } from './components/carousel'
export { default as Gif } from './components/gif'
export { default as Grid } from './components/grid'

/**
 * render a grid
 *
 * @param gridProps grid props
 * @param target the node to render into it
 * @param className the child node that will be created
 */
export const renderGrid = (gridProps: Grid['props'], target: HTMLElement, selector: string = `.${gridClassName}`) => {
    // preact will append if there's no existig node
    const existingNode = target.querySelector(selector)!
    return render(<Grid {...gridProps} />, target, existingNode)
}

/**
 * render a carousel
 *
 * @param carouselProps Carousel props
 * @param target the node to render into it
 * @param className the child node that will be created
 */
export const renderCarousel = (
    carouselProps: Carousel['props'],
    target: HTMLElement,
    className: string = `.${carouselClassName}`,
) => {
    // preact will append if there's no existig node
    const existingNode = target.querySelector(className)!
    render(<Carousel {...carouselProps} />, target, existingNode)
}
