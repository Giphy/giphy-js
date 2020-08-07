import { GiphyFetch } from '@giphy/js-fetch-api'
import { boolean, number, withKnobs } from '@storybook/addon-knobs'
import { css } from 'emotion'
import React, { useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { throttle } from 'throttle-debounce'
import { GifOverlayProps, Grid as GridComponent } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

export default {
    title: 'React Components/Grid',
    decorators: [withKnobs, jsxDecorator],
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

const noResultsCss = css`
    color: white;
`

const Overlay = ({ gif, isHovered }: GifOverlayProps) => <div className={overlayCss}>{isHovered ? gif.id : ''}</div>

export const Grid = () => {
    const [term, setTerm] = useState('dogs')
    const [width, setWidth] = useState(innerWidth)
    const onResize = throttle(500, () => setWidth(innerWidth))
    useEffect(() => {
        window.addEventListener('resize', onResize, false)
        return () => window.removeEventListener('resize', onResize, false)
    }, [])
    const columns = number('columns', width < 500 ? 2 : 3)
    const gutter = number('gutter', 6)
    const limit = number('limit', 5)
    const NoResults = <div className={noResultsCss}>No results for {term}</div>
    return (
        <>
            <input
                style={{ margin: 10 }}
                placeholder="type to search"
                onChange={({ target: { value } }) => setTerm(value)}
                value={term}
            />
            {term && (
                <GridComponent
                    key={term}
                    width={width}
                    columns={columns}
                    gutter={gutter}
                    noResultsMessage={NoResults}
                    fetchGifs={(offset: number) => gf.search(term, { offset, limit })}
                    overlay={boolean('show overlay', true) ? Overlay : undefined}
                />
            )}
        </>
    )
}
