/**
 * @param el HTMLElement
 * @returns calculated properties of ClientRect
 */
const getClientRect = (el: HTMLElement): ClientRect => {
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
    // TODO check this
    return { left, top, width, height, right: left + width, bottom: top + height }
}

export default getClientRect
