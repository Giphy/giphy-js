import { Carousel } from '../src'
import { IGif } from '@giphy/js-types'
import React, { PureComponent } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 4 })

type State = {
    gifs: IGif[]
}
type Props = {}

class CarouselDemo extends PureComponent<Props, State> {
    render() {
        return (
            <Carousel
                gifHeight={200}
                user={{}}
                gutter={6}
                fetchGifs={fetchGifs}
                onGifSeen={({ id }) => console.log(id)}
            />
        )
    }
}

export default CarouselDemo
