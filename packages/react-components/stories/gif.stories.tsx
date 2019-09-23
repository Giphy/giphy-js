import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, number } from '@storybook/addon-knobs'
import { jsxDecorator } from 'storybook-addon-jsx'

import React, { useEffect, useState } from 'react'
import { Gif as GifComponent } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const eventAction = (event: string) => (gif: IGif) => {
    action(`Gif ${event} for ${gif.id}`)()
}

const GifDemo = ({ id, width }: { id: string; width: number }) => {
    const [gif, setGif] = useState<IGif>()

    const fetch = async () => {
        const { data: gif } = await gf.gif(id)
        setGif(gif)
    }

    useEffect(() => {
        fetch()
    }, [])

    return gif ? (
        <GifComponent
            gif={gif}
            width={width}
            onGifClick={eventAction('click')}
            onGifSeen={eventAction('seen')}
            onGifVisible={eventAction('visible')}
        />
    ) : null
}

export default {
    title: 'React Components|Gif',
    decorators: [withKnobs, jsxDecorator],
}

export const Gif = () => <GifDemo id={text('id', 'ZEU9ryYGZzttn0Cva7')} width={number('width', 300)} />
export const Sticker = () => <GifDemo id={text('id', 'l1J9FvenuBnI4GTeg')} width={number('width', 300)} />
