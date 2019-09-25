import { GiphyFetch } from '@giphy/js-fetch-api'
import { number, withKnobs } from '@storybook/addon-knobs'
import * as React from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { Carousel as CarouselComponent } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

export default {
    title: 'React Components|Carousel',
    decorators: [withKnobs, jsxDecorator],
}

export const Carousel = () => (
    <CarouselComponent
        gifHeight={number('gif height', 200)}
        user={{}}
        gutter={6}
        fetchGifs={(offset: number) => gf.trending({ offset, limit: number('limit', 4) })}
    />
)
