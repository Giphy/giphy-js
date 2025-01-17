import React, { CSSProperties, memo, ReactNode } from 'react'

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
    const containerStyle: CSSProperties = {}
    function getChildren() {
        const totalHeights: number[] = fillArray(columns, columnOffsets)
        const totalWidth = columns * itemWidth + (columns - 1) * gutter
        React.Children.forEach(children, (_, index: number) => {
            const columnTarget = totalHeights.indexOf(Math.min(...totalHeights))
            const height = itemHeights[index]
            if (height) {
                totalHeights[columnTarget] += height + gutter
            }
        })
        const totalHeight = Math.max(...totalHeights) - gutter
        const columnHeights: number[] = fillArray(columns, columnOffsets)
        const result = React.Children.map(children, (child: React.ReactNode, index: number) => {
            const columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights))
            const top = `${(columnHeights[columnTarget] / totalHeight) * 100}%`
            const leftPixelTarget = (itemWidth + gutter) * columnTarget
            const left = `${(leftPixelTarget / totalWidth) * 100}%`
            const height = itemHeights[index]
            if (height) {
                columnHeights[columnTarget] += height + gutter
            }
            return React.cloneElement(child as React.ReactElement, {
                style: {
                    position: 'absolute',
                    top,
                    left,
                },
            })
        })
        containerStyle.position = 'relative'
        containerStyle.width = percentWidth
        containerStyle.height = `${Math.max(...columnHeights) - gutter}px`
        return result
    }

    return <div style={containerStyle}>{React.Children.count(children) > 0 ? getChildren() : null}</div>
}

export default memo(MasonryGrid)
