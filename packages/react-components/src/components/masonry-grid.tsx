import React, { CSSProperties, memo, ReactNode } from 'react'

export function fillArray(length: number, columnOffsets: number[] = []) {
    return Array.apply(null, Array(length)).map((_, index) => columnOffsets[index] || 0)
}

type Props = {
    totalHeight: number
    totalWidth: number
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
    totalHeight,
    totalWidth,
    columns,
    gutter,
    itemWidth,
    itemHeights,
    children,
    columnOffsets = [],
    percentWidth,
}: Props) => {
    const containerStyle: CSSProperties = {
        position: 'relative',
    }
    function getChildren() {
        const columnHeights: number[] = fillArray(columns, columnOffsets)
        const result = React.Children.map(children, (child: React.ReactNode, index: number) => {
            const columnTarget = columnHeights.indexOf(Math.min(...columnHeights))
            const topPerc = (columnHeights[columnTarget] / totalHeight) * 100
            const top = `${topPerc}%`
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
        containerStyle.width = percentWidth
        containerStyle.aspectRatio = `${totalWidth} / ${totalHeight}`
        return result
    }

    return <div style={containerStyle}>{React.Children.count(children) > 0 ? getChildren() : null}</div>
}

export default memo(MasonryGrid)
