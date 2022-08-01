// @ts-ignore TS2783
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'
import React, { useCallback, useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { Gif as GifComponent, GifOverlayProps, PingbackContext } from '../src'
import VideoOverlay from '../src/components/video/video-overlay'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const eventAction = (event: string) => (gif: IGif) => {
    action(`Gif ${event} for ${gif.id}`)()
}

type GifComponentProps = React.ComponentProps<typeof GifComponent>

type GifDemoProps = Omit<GifComponentProps, 'gif'> & {
    id: string
}

type GifStoryProps = Partial<GifDemoProps>

const GifDemo = ({ id, width, height, noLink, borderRadius, overlay, ...other }: GifDemoProps) => {
    const [gif, setGif] = useState<IGif>()

    const fetch = useCallback(async () => {
        const { data: gif } = await gf.gif(id)
        setGif(gif)
    }, [id])

    useEffect(() => {
        fetch()
    }, [fetch, id])

    return gif ? (
        <GifComponent
            key={`gif-${noLink}`}
            tabIndex={1}
            borderRadius={borderRadius}
            gif={gif}
            width={width}
            height={height}
            noLink={noLink}
            onGifClick={eventAction('click')}
            onGifSeen={eventAction('seen')}
            onGifVisible={eventAction('visible')}
            onGifKeyPress={eventAction('keyPress')}
            overlay={overlay}
            {...other}
        />
    ) : null
}

export default {
    title: 'React Components/Gif',
    decorators: [withKnobs, jsxDecorator],
}

export const Gif: Story<GifStoryProps> = (props) => (
    <GifDemo
        id={text('id', 'ZEU9ryYGZzttn0Cva7')}
        width={number('width', 300)}
        noLink={boolean('noLink', false)}
        {...props}
    />
)

export const GifWithVideoOverlay: Story<GifStoryProps> = (props) => (
    <GifDemo
        id={text('id', 'D068R9Ziv1iCjezKzG')}
        width={number('width', 500)}
        noLink={boolean('noLink', false)}
        overlay={(props: GifOverlayProps) => <VideoOverlay {...props} width={number('width', 500)} />}
        {...props}
    />
)

export const GifWithVideoOverlayFillVideo: Story<GifStoryProps> = (props) => (
    <GifDemo
        id={text('id', '3BNRWBatePBETD7Bfg')}
        width={number('width', 500)}
        height={number('height', 300)}
        noLink={boolean('noLink', false)}
        overlay={(props: GifOverlayProps) => <VideoOverlay {...props} width={number('width', 500)} />}
        {...props}
    />
)

export const GifNoBorderRadius: Story<GifStoryProps> = (props) => (
    <GifDemo
        id={text('id', 'ZEU9ryYGZzttn0Cva7')}
        borderRadius={0}
        width={number('width', 300)}
        noLink={boolean('noLink', false)}
        {...props}
    />
)

export const Sticker: Story<GifStoryProps> = (props) => (
    <GifDemo
        id={text('id', 'l1J9FvenuBnI4GTeg')}
        width={number('width', 300)}
        noLink={boolean('noLink', false)}
        {...props}
    />
)

export const CustomPingbackGif: Story<GifStoryProps> = (props) => (
    <PingbackContext.Provider value={{ attributes: { 'some key': 'some value' } }}>
        <GifDemo
            id={text('id', 'ZEU9ryYGZzttn0Cva7')}
            width={number('width', 300)}
            noLink={boolean('noLink', false)}
            {...props}
        />
    </PingbackContext.Provider>
)
