import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { action } from '@storybook/addon-actions'
import { Meta, StoryObj } from '@storybook/react'
import React, { ComponentProps, useCallback, useEffect, useState } from 'react'
import { Video as VideoComponent } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const eventAction = (event: string) => {
    action(`Video ${event}`)()
}

type Props = { id: string } & ComponentProps<typeof VideoComponent>

const VideoDemo = (props: Props) => {
    const [gif, setGif] = useState<IGif>()

    const fetch = useCallback(async () => {
        const { data: gif } = await gf.gif(props.id)
        setGif(gif)
    }, [props.id])

    useEffect(() => {
        fetch()
    }, [fetch, props.id])

    return gif ? (
        <VideoComponent
            onFirstPlay={(ms: number) => eventAction(`can play in ${ms / 1000}`)}
            onStateChange={(state: 'playing' | 'paused') => eventAction(`state: ${state}`)}
            onEnded={() => eventAction('on ended')}
            onLoop={(count: number) => eventAction(`on loop ${count}`)}
            onQuartile={(qt) => eventAction(`on quartile ${qt}`)}
            onMuted={() => eventAction('on muted')}
            onWaiting={(count: number) => eventAction(`on waiting: ${count}`)}
            {...props}
            gif={gif}
        />
    ) : null
}

const meta: Meta<typeof VideoDemo> = {
    component: VideoDemo,
    title: 'React Components/Video',
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
        id: 'D068R9Ziv1iCjezKzG',
        width: 300,
        controls: true,
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const Video: Story = {}
export const VideoCaptionsBeta: Story = {
    args: {
        ccEnabled: true,
    },
}
export const VideoUserMuted: Story = {
    args: {
        muted: true,
    },
}

export const VideoNoContent: Story = {
    args: {
        id: 'ZEU9ryYGZzttn0Cva7',
    },
}

export const VideoPercentageWidth: Story = {
    args: {
        percentWidth: '80%',
    },
}
