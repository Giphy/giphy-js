import styled from '@emotion/styled'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { Meta, StoryObj } from '@storybook/react'
import React, { ComponentProps, useCallback, useEffect, useState } from 'react'
import VideoPlayer from '../src/components/video'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const useGif = (id: string) => {
    const [gif, setGif] = useState<IGif>()

    const fetch = useCallback(async () => {
        const { data: gif } = await gf.gif(id)
        setGif(gif)
    }, [id])

    useEffect(() => {
        fetch()
    }, [fetch, id])
    return gif
}

type DemoProps = { id: string } & ComponentProps<typeof VideoPlayer>

const Demo = (props: DemoProps) => {
    const gif = useGif(props.id)
    return gif ? <VideoPlayer {...props} gif={gif} /> : <div>video loading</div>
}

const meta: Meta<typeof Demo> = {
    component: Demo,
    title: 'React Components/VideoPlayer',
    argTypes: {
        height: {
            control: { type: 'number' },
        },
        width: {
            control: { type: 'number' },
        },
        muted: {
            control: { type: 'boolean' },
        },
        id: {
            control: { type: 'string' },
        },
    },
    args: {
        id: 'WtUBmrAK1Yda649Ayr',
        width: 300,
        controls: true,
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const VideoWithControls: Story = {}

export const VideoNoAttribution: Story = {
    args: {
        hideAttribution: true,
    },
}

export const VideoNoProgressBar: Story = {
    args: {
        hideProgressBar: true,
    },
}

export const VideoNoMute: Story = {
    args: {
        hideMute: true,
    },
}

export const VideoPersistentControlsSmall: Story = {
    args: {
        persistentControls: true,
        width: 300,
    },
}

export const VideoPersistentControlsMedium: Story = {
    args: {
        persistentControls: true,
        width: 400,
    },
}

export const VideoPersistentControlsLarge: Story = {
    args: {
        persistentControls: true,
        width: 600,
    },
}

const Overlay = styled.div`
    background: pink;
    position: absolute;
    bottom: 5px;
    right: 5px;
`

export const VideoOverlay: Story = {
    args: {
        overlay: () => <Overlay>OVERLAY</Overlay>,
    },
}
