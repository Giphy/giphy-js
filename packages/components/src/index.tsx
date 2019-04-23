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
 * @param selector a selector for the child node that will be created in target.
 * useful only if you want to have more than one carousel in the same target
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
 * @param selector a selector for the child node that will be created in target.
 * useful only if you want to have more than one carousel in the same target
 */
export const renderCarousel = (
    carouselProps: Carousel['props'],
    target: HTMLElement,
    selector: string = `.${carouselClassName}`,
) => {
    // preact will append if there's no existig node
    const existingNode = target.querySelector(selector)!
    return render(<Carousel {...carouselProps} />, target, existingNode)
}
