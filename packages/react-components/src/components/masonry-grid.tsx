import React, { memo, ReactNode } from 'react'

function fillArray(length: number, columnOffsets: number[] = []) {
    return Array.apply(null, Array(length)).map((_, index) => columnOffsets[index] || 0)
}

type Props = {
    columns: number
    gutter: number
    percentWidth?: string
    useTransform?: boolean
    children: ReactNode
    itemHeights: number[]
    itemWidth: number
    columnOffsets?: number[]
}
const MasonryGrid = ({
    columns,
    gutter,
    itemWidth,
    itemHeights,
    children,
    columnOffsets = [],
    percentWidth,
}: Props) => {
    const containerStyle: any = {}

    function getChildren2() {
        let columnTarget: number
        const totalHeights: number[] = fillArray(columns, columnOffsets)
        const totalWidth = columns * itemWidth + (columns - 1) * gutter
        React.Children.forEach(children, (_, index: number) => {
            columnTarget = totalHeights.indexOf(Math.min.apply(Math, totalHeights))
            const height = itemHeights[index]
            if (height) {
                totalHeights[columnTarget] += height + gutter
            }
        })
        const totalHeight = Math.max.apply(Math, totalHeights) - gutter
        const columnHeights: number[] = fillArray(columns, columnOffsets)
        const result = React.Children.map(children, (child: React.ReactNode, index: number) => {
            columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights))
            const top = `${(columnHeights[columnTarget] / totalHeight) * 100}%`
            const w = (itemWidth + gutter) * columnTarget
            const left = `${(w / totalWidth) * 100}%`
            const style: any = {
                position: 'absolute',
                top,
                left,
            }
            const height = itemHeights[index]
            if (height) {
                columnHeights[columnTarget] += height + gutter
            }
            return React.cloneElement(child as React.ReactElement, { style })
        })
        containerStyle.position = 'relative'
        containerStyle.width = percentWidth
        containerStyle.height = `${Math.max.apply(Math, columnHeights) - gutter}px`
        return result
    }

    return <div style={containerStyle}>{getChildren2()}</div>
}

export default memo(MasonryGrid)
