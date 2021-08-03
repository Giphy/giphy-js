import styled from '@emotion/styled'
import { GiphyFetch } from '@giphy/js-fetch-api'
import isPercy from '@percy-io/in-percy'
import { boolean, number, withKnobs } from '@storybook/addon-knobs'
import fetchMock from 'fetch-mock'
import React, { ElementType, useEffect, useRef, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { throttle } from 'throttle-debounce'
import { GifOverlayProps, Grid as GridComponent } from '../src'
import mockGifsResult from './mock-data/gifs.json'

const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'
const gf = new GiphyFetch(apiKey)

export default {
    title: 'React Components/Grid',
    decorators: [withKnobs, jsxDecorator],
}

const OverlayContainer = styled.div`
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

const NoResultsContainer = styled.div`
    color: white;
`

const Overlay = ({ gif, isHovered }: GifOverlayProps) => <OverlayContainer>{isHovered ? gif.id : ''}</OverlayContainer>

export const Grid = ({ loader }: { loader: ElementType }) => {
    const [term, setTerm] = useState('always sunny')
    const [width, setWidth] = useState(innerWidth)
    const onResize = throttle(500, () => setWidth(innerWidth))
    useEffect(() => {
        window.addEventListener('resize', onResize, false)
        return () => window.removeEventListener('resize', onResize, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const columns = number('columns', width < 500 ? 2 : 3)
    const gutter = number('gutter', 6)
    const limit = number('limit', 5)
    const NoResults = <NoResultsContainer>No results for {term}</NoResultsContainer>

    const fetchGifs = async (offset: number) => {
        if (isPercy()) {
            fetchMock
                .restore()
                .getOnce(`begin:https://api.giphy.com/v1/gifs/search?offset=0&limit=`, { body: mockGifsResult })
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
            {term && (
                <GridComponent
                    key={term}
                    width={width}
                    columns={columns}
                    gutter={gutter}
                    noResultsMessage={NoResults}
                    loader={loader}
                    fetchGifs={fetchGifs}
                    overlay={boolean('show overlay', true) ? Overlay : undefined}
                />
            )}
        </>
    )
}

export const GridCustomLoader = () => <Grid loader={() => <h1 style={{ textAlign: 'center' }}> 🌀 </h1>} />

export const GridAPIError = () => {
    const [width, setWidth] = useState(innerWidth)
    const mockRequest = useRef(true)
    const onResize = throttle(500, () => setWidth(innerWidth))
    useEffect(() => {
        window.addEventListener('resize', onResize, false)
        return () => window.removeEventListener('resize', onResize, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const columns = number('columns', width < 500 ? 2 : 3)
    const gutter = number('gutter', 6)
    const body = {
        data: [],
    }
    const fetchGifs = (offset: number) => {
        if (mockRequest.current) {
            fetchMock.restore().getOnce(`begin:https://api.giphy.com/v1/gifs/search`, { body })
            mockRequest.current = false
            const req = gf.search('hello', { offset })
            fetchMock.restore()
            return req
        }
        return gf.search('hello', { offset })
    }
    return (
        <GridComponent
            width={width}
            columns={columns}
            gutter={gutter}
            fetchGifs={fetchGifs}
            overlay={boolean('show overlay', true) ? Overlay : undefined}
        />
    )
}
