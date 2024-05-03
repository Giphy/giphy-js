// @ts-ignore TS2783
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'
import { Meta, StoryObj } from '@storybook/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Gif as GifComponent, GifOverlayProps } from '../src'
import VideoOverlay from '../src/components/video/video-overlay'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const eventAction = (event: string) => (gif: IGif) => {
    action(`Gif ${event} for ${gif.id}`)()
}

type GifComponentProps = React.ComponentProps<typeof GifComponent>

type GifDemoProps = Omit<GifComponentProps, 'gif'> & {
    id: string
    scale: string
    bottle_data: IGif['bottle_data']
}

const GifDemo = ({
    id,
    width,
    height,
    noLink,
    borderRadius,
    percentWidth,
    overlay,
    bottle_data,
    ...other
}: GifDemoProps) => {
    const [gif, setGif] = useState<IGif>()

    const fetch = useCallback(async () => {
        const { data: gif } = await gf.gif(id)
        if (bottle_data) {
            gif.bottle_data = bottle_data
        }
        setGif(gif)
    }, [id])

    useEffect(() => {
        fetch()
    }, [fetch, id])

    return gif && width > 0 ? (
        <GifComponent
            key={`gif-${noLink} ${gif.id}`}
            tabIndex={1}
            borderRadius={borderRadius}
            gif={gif}
            percentWidth={percentWidth}
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

const meta: Meta<typeof GifDemo> = {
    component: GifDemo,
    title: 'React Components/Gif',
    argTypes: {
        id: {
            control: { type: 'text' },
        },
        width: {
            control: { type: 'number' },
        },
        noLink: {
            control: { type: 'boolean' },
        },
        percentWidth: {
            control: { type: 'text' },
        },
    },
    args: {
        id: 'ZEU9ryYGZzttn0Cva7',
        width: 300,
        noLink: false,
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const Gif: Story = {}

export const GifWithOverlay: Story = {
    args: {
        overlay: (props: GifOverlayProps) => <VideoOverlay {...props} width={number('width', 500)} />,
    },
}

export const GifWithAd: Story = {
    args: {
        bottle_data: {
            tid: '8691c382d3eed000da83ecc2ceef747b91190ab0e5bc0bc95ff5c80eeda242fa',
            tags: [
                '<noscript class="MOAT-giphydisplay879451385633?moatClientLevel1=ff6046d1-7125-462a-809c-efa338464775&amp;moatClientLevel2=e66d47a2-1b13-4b74-a34d-23fbdc10ddb5&amp;moatClientLevel3=82&amp;moatClientLevel4=3o7WIw8TV4UJROSElW&amp;moatClientSlicer1=e26c89fe-fb01-4442-9e8f-37940600265c&amp;moatClientSlicer2=giphytrending"></noscript><script src="https://z.moatads.com/giphydisplay879451385633/moatad.js#moatClientLevel1=ff6046d1-7125-462a-809c-efa338464775&moatClientLevel2=e66d47a2-1b13-4b74-a34d-23fbdc10ddb5&moatClientLevel3=82&moatClientLevel4=3o7WIw8TV4UJROSElW&moatClientSlicer1=e26c89fe-fb01-4442-9e8f-37940600265c&moatClientSlicer2=giphytrending" type="text/javascript"></script>',
            ],
        },
    },
}

export const GifThatStretches: Story = {
    args: {
        percentWidth: '50%',
    },
}

export const GifWithVideoOverlayFillVideo: Story = {
    args: {
        id: 'CWuHC9Nv5CKV8u7WeO',
        width: 340,
        height: 340,
        hideAttribution: true,
        overlay: (props: GifOverlayProps) => (
            <VideoOverlay {...props} width={number('width', 340)} height={number('width', 340)} />
        ),
    },
}

export const GifNoBorderRadius: Story = {
    args: {
        borderRadius: 0,
    },
}

export const Sticker: Story = {
    args: { id: 'l1J9FvenuBnI4GTeg' },
}
