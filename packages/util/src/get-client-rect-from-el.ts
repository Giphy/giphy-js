/**
 * @param el HTMLElement
 * @returns calculated properties of DOMReact
 */
const getClientRect = (el: HTMLElement): DOMRectReadOnly => {
    let left = 0
    let top = 0
    const width = el.offsetWidth
    const height = el.offsetHeight
    // no layout thrash
    do {
        left += el.offsetLeft
        top += el.offsetTop
        el = el.offsetParent as HTMLElement
    } while (el)
    const result = {
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
    }
    return { ...result, toJSON: () => JSON.stringify(result) }
}

export default getClientRect
