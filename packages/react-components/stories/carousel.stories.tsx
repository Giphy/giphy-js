import { GiphyFetch } from '@giphy/js-fetch-api'
import fetchMock from 'fetch-mock'
import { Carousel as CarouselComponent } from '../src'
import inTestsRunner from './in-tests-runner'
import mockGifsResult from './mock-data/gifs.json'
import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react/*'

const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'
const gf = new GiphyFetch(apiKey)

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
                gifHeight={props.gifHeight || 200}
                gifWidth={props.gifWidth}
                backgroundColor={inTestsRunner() ? 'white' : undefined}
                gutter={6}
                fetchGifs={fetchGifs}
                {...props}
            />
        </>
    )
}

const meta: Meta<typeof SearchExample> = {
    component: SearchExample,
    title: 'React Components/Carousel',
    argTypes: {
        gifWidth: {
            control: { type: 'number' },
        },
        gifHeight: {
            control: { type: 'number' },
        },
    },
    args: {
        gifHeight: 200,
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const FixedWidth: Story = {
    args: {
        gifWidth: 200,
    },
}
