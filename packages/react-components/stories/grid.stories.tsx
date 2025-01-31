import { GiphyFetch } from '@giphy/js-fetch-api'
import { Meta, StoryObj } from '@storybook/react'
import fetchMock from 'fetch-mock'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { throttle } from 'throttle-debounce'
import { GifOverlayProps, Grid as GridComponent } from '../src'
import inTestsRunner from './in-tests-runner'
import mockGifsResult from './mock-data/gifs.json'
import { styled } from 'styled-components'

const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'
const gf = new GiphyFetch(apiKey)

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

type GridProps = Partial<React.ComponentProps<typeof GridComponent>> & {
    containerStyles: CSSProperties
    limit?: number
}

const Grid = ({ loader, containerStyles, columns, limit = 10, ...other }: GridProps) => {
    const [term, setTerm] = useState('always sunny')
    let [width, setWidth] = useState(innerWidth)
    width = width - 30
    const onResize = throttle(500, () => setWidth(innerWidth))
    useEffect(() => {
        window.addEventListener('resize', onResize, false)
        return () => window.removeEventListener('resize', onResize, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const NoResults = <NoResultsContainer>No results for {term}</NoResultsContainer>

    const fetchGifs = async (offset: number) => {
        if (inTestsRunner()) {
            fetchMock.restore().getOnce(`begin:https://api.giphy.com/v1/gifs/search`, { body: mockGifsResult })
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
                <div style={containerStyles}>
                    <GridComponent
                        key={term}
                        width={width}
                        columns={columns || (width < 500 ? 2 : 3)}
                        noResultsMessage={NoResults}
                        loader={loader}
                        fetchGifs={fetchGifs}
                        overlay={Overlay}
                        {...other}
                    />
                </div>
            )}
        </>
    )
}

const meta: Meta<typeof Grid> = {
    component: Grid,
    title: 'React Components/Grid',
    argTypes: {
        noLink: {
            control: { type: 'boolean' },
        },
        columns: {
            control: { type: 'number' },
        },
        gutter: {
            control: { type: 'number' },
        },
    },
    args: {
        noLink: false,
        limit: 10,
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const GridStory: Story = {
    args: {
        eagerLoading: ['l0IylOPCNkiqOgMyA', 'l0IykOsxLECVejOzm'],
    },
}

export const GridResponsive: Story = {
    args: {
        percentWidth: '100%',
        width: 400,
        columns: 2,
        gutter: 10,
    },
}

export const GridResponsiveContainer: Story = {
    args: {
        percentWidth: '100%',
        width: 200,
        columns: 2,
        gutter: 10,
        containerStyles: { width: 400, backgroundColor: 'aquamarine' },
    },
}

export const GridResponsiveLowRes: Story = {
    args: {
        percentWidth: '100%',
        width: 100,
        columns: 4,
        gutter: 10,
        containerStyles: { width: 800, backgroundColor: 'aquamarine' },
    },
}

export const GridResponsiveContainerWithOffsets: Story = {
    args: {
        width: 1040,
        columns: 4,
        gutter: 10,
        columnOffsets: [0, 0, 350, 350],
        containerStyles: { width: 1040, backgroundColor: 'mediumpurple' },
    },
}

export const GridCustomLoader: Story = {
    args: {
        loader: () => <h1 style={{ textAlign: 'center' }}> 🌀 </h1>,
    },
}

export const GridAPIError = (props: GridProps) => {
    const [width, setWidth] = useState(innerWidth)
    const mockRequest = useRef(true)
    const onResize = throttle(500, () => setWidth(innerWidth))
    useEffect(() => {
        window.addEventListener('resize', onResize, false)
        return () => window.removeEventListener('resize', onResize, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const columns = width < 500 ? 2 : 3
    const gutter = 6
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
            overlay={Overlay}
            {...props}
        />
    )
}
