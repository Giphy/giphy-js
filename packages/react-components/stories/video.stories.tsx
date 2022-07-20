import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'
import React, { ComponentProps, useCallback, useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { Video as VideoComponent } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const eventAction = (event: string) => {
    action(`Video ${event}`)()
}

type Props = { id: string } & Partial<ComponentProps<typeof VideoComponent>>

const VideoDemo = ({ id, width, height, muted, ccEnabled }: Props) => {
    const [gif, setGif] = useState<IGif>()

    const fetch = useCallback(async () => {
        const { data: gif } = await gf.gif(id)
        setGif(gif)
    }, [id])

    useEffect(() => {
        fetch()
    }, [fetch, id])

    return gif ? (
        <VideoComponent
            gif={gif}
            width={width as number}
            height={height}
            muted={muted}
            onFirstPlay={(ms: number) => eventAction(`can play in ${ms / 1000}`)}
            onStateChange={(state: 'playing' | 'paused') => eventAction(`state: ${state}`)}
            onEnded={() => eventAction('on ended')}
            onLoop={(count: number) => eventAction(`on loop ${count}`)}
            onQuartile={(qt) => eventAction(`on quartile ${qt}`)}
            onMuted={() => eventAction('on muted')}
            onWaiting={(count: number) => eventAction(`on waiting: ${count}`)}
            ccEnabled={ccEnabled}
            // onTimeUpdate={(t) => console.log(t)}
        />
    ) : null
}

export default {
    title: 'React Components/Video',
    decorators: [withKnobs, jsxDecorator],
}

export const Video: Story = () => (
    <VideoDemo
        id={text('id', 'D068R9Ziv1iCjezKzG')}
        width={number('width', 300)}
        height={number('height', 0)}
        muted={boolean('muted', false)}
    />
)

export const VideoCaptionsBeta: Story = () => (
    <>
        <h3 style={{ color: 'white' }}>Beta Feature</h3>
        <VideoDemo
            id={text('id', 'D068R9Ziv1iCjezKzG')}
            width={number('width', 300)}
            height={number('height', 0)}
            muted={boolean('muted', true)}
            ccEnabled={boolean('ccEnabled', true)}
        />
    </>
)

export const VideoUserMuted: Story = () => (
    <VideoDemo
        id={text('id', 'obhOJFSwuTRN7VDY55')}
        width={number('width', 300)}
        height={number('height', 0)}
        muted={boolean('muted', true)}
    />
)

export const VideoNoContent: Story = () => (
    <VideoDemo
        id={text('id', 'ZEU9ryYGZzttn0Cva7')}
        width={number('width', 300)}
        height={number('height', 0)}
        muted={boolean('muted', true)}
    />
)
