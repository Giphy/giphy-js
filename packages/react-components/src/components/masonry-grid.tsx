import React, { memo, ReactNode } from 'react'

function fillArray(length: number, columnOffsets: number[] = []) {
    return Array.apply(null, Array(length)).map((_, index) => columnOffsets[index] || 0)
}

type Props = {
    columns: number
    gutter: number
    useTransform?: boolean
    children: ReactNode
    itemHeights: number[]
    itemWidth: number
    columnOffsets?: number[]
}
const MasonryGrid = ({
    columns,
    gutter,
    useTransform = true,
    itemWidth,
    itemHeights,
    children,
    columnOffsets = [],
}: Props) => {
    const containerStyle: any = {}
    function getChildren() {
        let columnTarget: number
        const columnHeights: number[] = fillArray(columns, columnOffsets)
        const result = React.Children.map(children, (child: React.ReactNode, index: number) => {
            const style: any = {
                position: 'absolute',
            }
            columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights))
            const top = `${columnHeights[columnTarget]}px`
            const left = `${columnTarget * itemWidth + columnTarget * gutter}px`
            if (useTransform) {
                style.transform = `translate3d(${left}, ${top}, 0)`
            } else {
                // support positioned elements (default) or transformed elements
                style.top = top
                style.left = left
            }
            const height = itemHeights[index]
            if (height) {
                columnHeights[columnTarget] += height + gutter
            }
            return React.cloneElement(child as React.ReactElement, { style })
        })
        containerStyle.position = 'relative'
        containerStyle.width = `${columns * itemWidth + (columns - 1) * gutter}px`
        containerStyle.height = `${Math.max.apply(Math, columnHeights) - gutter}px`
        return result
    }

    return <div style={containerStyle}>{getChildren()}</div>
}

export default memo(MasonryGrid)
