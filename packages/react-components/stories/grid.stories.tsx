import { GiphyFetch } from '@giphy/js-fetch-api'
import { number, withKnobs, boolean } from '@storybook/addon-knobs'
import { css } from 'emotion'
import React, { useEffect, useState } from 'react'
import { throttle } from 'throttle-debounce'
import { GifOverlayProps, Grid as GridComponent } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

export default {
    title: 'React Components|Grid',
    decorators: [withKnobs],
}

const overlayCss = css`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    color: white;
    justify-content: center;
    align-items: center;
`

const Overlay = ({ gif, isHovered }: GifOverlayProps) => <div className={overlayCss}>{isHovered ? gif.id : ''}</div>

export const Grid = () => {
    const [width, setWidth] = useState(innerWidth)
    const onResize = throttle(500, () => setWidth(innerWidth))
    useEffect(() => {
        window.addEventListener('resize', onResize, false)
        return () => window.removeEventListener('resize', onResize, false)
    }, [])
    const columns = number('columns', width < 500 ? 2 : 3)
    const gutter = number('gutter', 6)
    const limit = number('limit', 5)
    return (
        <GridComponent
            width={width}
            columns={columns}
            gutter={gutter}
            fetchGifs={(offset: number) => gf.trending({ offset, limit })}
            overlay={boolean('show overlay', true) ? Overlay : undefined}
        />
    )
}
