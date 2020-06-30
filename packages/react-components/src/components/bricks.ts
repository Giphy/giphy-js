// @ts-ignore
import knot from 'knot.js'

type Options = {
    packed: string
    columns: number
    gutter: number
    position?: boolean
    container: HTMLElement
}
const bricks = (options: Options) => {
    // privates

    let persist: boolean // packing new elements, or all elements?
    let ticking: boolean // for debounced resize

    let columnTarget
    let columnHeights: number[]

    let nodeTop
    let nodeLeft
    let nodeWidth: number
    let nodeHeight

    let nodes: any[]
    let nodesWidths: { [x: string]: any }
    let nodesHeights: { [x: string]: any }
    const { gutter, columns } = options

    // resolve options

    const packed = options.packed.indexOf('data-') === 0 ? options.packed : `data-${options.packed}`
    const position = options.position !== false

    const container = options.container
    // const container = options.container.nodeType
    // ? options.container
    // : document.querySelector((options.container as unknown) as string)

    const selectors = {
        all: () => toArray(container.children),
        new: () => toArray(container.children).filter(node => !node.hasAttribute(`${packed}`)),
    }

    // series

    const setup = [setColumns]

    const run = [setNodes, setNodesDimensions, setNodesStyles, setContainerStyles]

    // instance

    const instance = knot({
        pack,
        update,
        resize,
    })

    return instance

    // general helpers

    function runSeries(functions: any[]) {
        functions.forEach((func: () => any) => func())
    }

    // array helpers

    function toArray(input: HTMLCollection) {
        return Array.prototype.slice.call(input)
    }

    function fillArray(length: any) {
        return Array.apply(null, Array(length)).map(() => 0)
    }

    // column helpers

    function setColumns() {
        columnHeights = fillArray(columns)
    }

    // node helpers

    function setNodes() {
        nodes = selectors[persist ? 'new' : 'all']()
    }

    function setNodesDimensions() {
        // exit if empty container
        if (nodes.length === 0) {
            return
        }

        nodesWidths = nodes.map((element: { clientWidth: any }) => element.clientWidth)
        nodesHeights = nodes.map((element: { clientHeight: any }) => element.clientHeight)
    }

    function setNodesStyles() {
        nodes.forEach(
            (
                element: {
                    style: { position: string; top: string; left: string; transform: string }
                    setAttribute: (arg0: string | undefined, arg1: string) => void
                },
                index: string | number
            ) => {
                columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights))

                element.style.position = 'absolute'

                nodeTop = `${columnHeights[columnTarget]}px`
                nodeLeft = `${columnTarget * nodesWidths[index] + columnTarget * gutter}px`

                // support positioned elements (default) or transformed elements
                if (position) {
                    element.style.top = nodeTop
                    element.style.left = nodeLeft
                } else {
                    element.style.transform = `translate3d(${nodeLeft}, ${nodeTop}, 0)`
                }

                element.setAttribute(packed, '')

                // ignore nodes with no width and/or height
                nodeWidth = nodesWidths[index]
                nodeHeight = nodesHeights[index]

                if (nodeWidth && nodeHeight) {
                    columnHeights[columnTarget] += nodeHeight + gutter
                }
            }
        )
    }

    // container helpers

    function setContainerStyles() {
        // @ts-ignore
        container.style.position = 'relative'
        // @ts-ignore
        container.style.width = `${columns * nodeWidth + (columns - 1) * gutter}px`
        // @ts-ignore
        container.style.height = `${Math.max.apply(Math, columnHeights) - gutter}px`
    }

    // resize helpers

    function resizeFrame() {
        if (!ticking) {
            window.requestAnimationFrame(resizeHandler)
            ticking = true
        }
    }

    function resizeHandler() {
        ticking = false
    }

    // API

    function pack() {
        persist = false
        runSeries(setup.concat(run))

        return instance.emit('pack')
    }

    function update() {
        persist = true
        runSeries(run)

        return instance.emit('update')
    }

    function resize(flag = true) {
        const action = flag ? 'addEventListener' : 'removeEventListener'

        window[action]('resize', resizeFrame)

        return instance
    }
}

export default bricks
