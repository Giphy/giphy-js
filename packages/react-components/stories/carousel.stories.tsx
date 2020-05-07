import { GiphyFetch } from '@giphy/js-fetch-api'
import { number, withKnobs } from '@storybook/addon-knobs'
import { useState } from '@storybook/addons'
import * as React from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { Carousel as CarouselComponent } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

export default {
    title: 'React Components|Carousel',
    decorators: [withKnobs, jsxDecorator],
}

export const Carousel = () => {
    const [term, setTerm] = useState('dogs')
    const fetchGifs = (offset: number) => gf.search(term, { offset, limit: number('limit', 4) })
    return (
        <>
            <input
                style={{ margin: 10 }}
                placeholder="type to search"
                onChange={({ target: { value } }) => setTerm(value)}
                value={term}
            />
            <CarouselComponent
                key={term}
                gifHeight={number('gif height', 200)}
                user={{}}
                gutter={6}
                fetchGifs={fetchGifs}
            />
        </>
    )
}
