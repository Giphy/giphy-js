import * as React from 'react'
import { Carousel as CarouselComponent } from '../src'
import { withKnobs, number } from '@storybook/addon-knobs'

import { GiphyFetch } from '@giphy/js-fetch-api'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

export default {
    title: 'React Components|Carousel',
    decorators: [withKnobs],
}

export const Carousel = () => (
    <CarouselComponent
        gifHeight={number('gif height', 200)}
        user={{}}
        gutter={6}
        fetchGifs={(offset: number) => gf.trending({ offset, limit: number('limit', 4) })}
    />
)
