import styled from '@emotion/styled'
import { giphyPurple } from '@giphy/colors'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { Meta, StoryObj } from '@storybook/react'
import fetchMock from 'fetch-mock'
import React, { useEffect, useState } from 'react'
import { throttle } from 'throttle-debounce'
import { GifOverlayProps, Grid as GridComponent } from '../src'
import inTestsRunner from './in-tests-runner'
import mockGifsResult from './mock-data/gifs.json'

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
const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
    h4 {
        text-align: center;
    }
`
const Button = styled.div`
    cursor: pointer;
    background: ${giphyPurple};
    padding: 6px;
    border-radius: 4px;
    max-width: fit-content;
`

type GridProps = Partial<React.ComponentProps<typeof GridComponent>>

const Grid = ({ loader, ...other }: GridProps) => {
    const [width, setWidth] = useState(innerWidth - 24)
    const [externalGifs, setExternalGifs] = useState<IGif[] | undefined>()
    const Overlay = ({ gif, isHovered }: GifOverlayProps) => (
        <OverlayContainer>
            {isHovered && (
                <ButtonContainer>
                    <h4>{gif.title}</h4>
                    <Button
                        onClick={() => {
                            setExternalGifs(externalGifs?.filter((g) => g.id !== gif.id))
                        }}
                    >
                        Delete Me
                    </Button>
                    <Button
                        onClick={() => {
                            const result = prompt('Edit Title', gif.title) || 'New Title'
                            if (externalGifs) {
                                const editGif = externalGifs?.find((g) => g.id === gif.id)
                                if (editGif) {
                                    editGif.title = result
                                    setExternalGifs([...externalGifs])
                                }
                            }
                        }}
                    >
                        Edit Title
                    </Button>
                </ButtonContainer>
            )}
        </OverlayContainer>
    )
    const onResize = throttle(500, () => setWidth(innerWidth - 24))
    useEffect(() => {
        window.addEventListener('resize', onResize, false)
        return () => window.removeEventListener('resize', onResize, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchGifs = async (offset: number) => {
        if (inTestsRunner()) {
            fetchMock.restore().getOnce(`begin:https://api.giphy.com/v1/gifs/search`, { body: mockGifsResult })
        }
        const result = await gf.trending({ offset, limit: 10 })
        fetchMock.restore()
        setExternalGifs(result.data)
        return result
    }
    return (
        <GridComponent
            width={width}
            noLink
            columns={3}
            loader={loader}
            externalGifs={externalGifs}
            fetchGifs={fetchGifs}
            overlay={Overlay}
            onGifsFetched={(gifs) => setExternalGifs(gifs)}
            {...other}
        />
    )
}

const meta: Meta<typeof Grid> = {
    component: Grid,
    title: 'React Components/Grid/Editable',
}

export default meta

type Story = StoryObj<typeof meta>

export const EditableGrid: Story = {}
