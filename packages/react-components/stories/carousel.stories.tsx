import { GiphyFetch } from '@giphy/js-fetch-api'
import fetchMock from 'fetch-mock'
import { Carousel as CarouselComponent } from '../src'
import inTestsRunner from './in-tests-runner'
import mockGifsResult from './mock-data/gifs.json'
import React, { useState } from 'react'

const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'
const gf = new GiphyFetch(apiKey)

export default {
    title: 'React Components/Carousel',
}

type StoryProps = Partial<React.ComponentProps<typeof CarouselComponent>>

export const SearchExample = (props: StoryProps) => {
    const [term, setTerm] = useState('dogs')
    const limit = 5
    const fetchGifs = async (offset: number) => {
        if (inTestsRunner()) {
            fetchMock.restore().getOnce(`begin:https://api.giphy.com/v1/gifs/search?`, { body: mockGifsResult })
        }
        const result = await gf.search(term, { offset, limit })
        fetchMock.restore()
        return result
    }
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
                gifHeight={200}
                gifWidth={undefined}
                backgroundColor={inTestsRunner() ? 'white' : undefined}
                gutter={6}
                fetchGifs={fetchGifs}
                {...props}
            />
        </>
    )
}
