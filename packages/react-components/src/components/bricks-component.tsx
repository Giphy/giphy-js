import React, { ReactNode } from 'react'

function fillArray(length: any) {
    return Array.apply(null, Array(length)).map(() => 0)
}
type Item = {
    width: number
    height: number
}
type Props = {
    columns: number
    gutter: number
    position?: boolean
    children: ReactNode
    items: Item[]
}
const BricksComponent = ({ columns, gutter, position = true, items, children }: Props) => {
    const containerStyle: any = {}
    function getChildren() {
        let nodeWidth: number = 0
        let columnTarget: number
        const columnHeights: number[] = fillArray(columns)
        const nodesWidths = items.map(item => item.width)
        const nodesHeights = items.map(item => item.height)
        const result = React.Children.map<React.ReactNode, React.ReactNode>(
            children,
            (child: React.ReactNode, index: number) => {
                const style: any = {}
                columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights))
                style.position = 'absolute'
                const nodeTop = `${columnHeights[columnTarget]}px`
                const nodeLeft = `${columnTarget * nodesWidths[index] + columnTarget * gutter}px`
                // support positioned elements (default) or transformed elements
                if (position) {
                    style.top = nodeTop
                    style.left = nodeLeft
                } else {
                    style.transform = `translate3d(${nodeLeft}, ${nodeTop}, 0)`
                }
                nodeWidth = nodesWidths[index]
                const nodeHeight = nodesHeights[index]
                if (nodeWidth && nodeHeight) {
                    columnHeights[columnTarget] += nodeHeight + gutter
                }
                return React.cloneElement(child as React.ReactElement, { style })
            }
        )
        containerStyle.position = 'relative'
        containerStyle.width = `${columns * nodeWidth + (columns - 1) * gutter}px`
        containerStyle.height = `${Math.max.apply(Math, columnHeights) - gutter}px`
        return result
    }

    return <div style={containerStyle}>{getChildren()}</div>
}

export default BricksComponent
