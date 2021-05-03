import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { action } from '@storybook/addon-actions'
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'
import React, { ReactType, useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { Gif as GifComponent, GifOverlayProps, PingbackContext } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const eventAction = (event: string) => (gif: IGif) => {
    action(`Gif ${event} for ${gif.id}`)()
}

const GifDemo = ({
    id,
    width,
    noLink,
    borderRadius,
    overlay,
}: {
    id: string
    width: number
    noLink?: boolean
    borderRadius?: number
    overlay?: ReactType<GifOverlayProps>
}) => {
    const [gif, setGif] = useState<IGif>()

    const fetch = async () => {
        const { data: gif } = await gf.gif(id)
        setGif(gif)
    }

    useEffect(() => {
        fetch()
    }, [id])

    return gif ? (
        <GifComponent
            key={`gif-${noLink}`}
            borderRadius={borderRadius}
            gif={gif}
            width={width}
            noLink={noLink}
            onGifClick={eventAction('click')}
            onGifSeen={eventAction('seen')}
            onGifVisible={eventAction('visible')}
            overlay={overlay}
        />
    ) : null
}

export default {
    title: 'React Components/Gif',
    decorators: [withKnobs, jsxDecorator],
}

export const Gif = () => (
    <GifDemo id={text('id', 'ZEU9ryYGZzttn0Cva7')} width={number('width', 300)} noLink={boolean('noLink', false)} />
)

export const GifWithVideoOverlay = () => (
    <GifDemo id={text('id', 'D068R9Ziv1iCjezKzG')} width={number('width', 500)} noLink={boolean('noLink', false)} />
)

export const GifNoBorderRadius = () => (
    <GifDemo
        id={text('id', 'ZEU9ryYGZzttn0Cva7')}
        borderRadius={0}
        width={number('width', 300)}
        noLink={boolean('noLink', false)}
    />
)
export const Sticker = () => (
    <GifDemo id={text('id', 'l1J9FvenuBnI4GTeg')} width={number('width', 300)} noLink={boolean('noLink', false)} />
)
export const CustomPingbackGif = () => (
    <PingbackContext.Provider value={{ attributes: { 'some key': 'some value' } }}>
        <GifDemo id={text('id', 'ZEU9ryYGZzttn0Cva7')} width={number('width', 300)} noLink={boolean('noLink', false)} />
    </PingbackContext.Provider>
)
