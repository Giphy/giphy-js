import { GifsResult, GiphyFetch } from '@giphy/js-fetch-api'
import isPercy from '@percy-io/in-percy'
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
    const fetchGifs = isPercy() // our search results don't change right now, use it for testing
        ? (offset: number) =>
              offset === 0 ? gf.search('spaghetti', { offset, limit }) : new Promise<GifsResult>(() => {})
        : (offset: number) => gf.search(term, { offset, limit })
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
                    fetchGifs={fetchGifs}
                    overlay={boolean('show overlay', true) ? Overlay : undefined}
                />
            )}
        </>
    )
}
