import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import isPercy from '@percy-io/in-percy'
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'
import React, { useCallback, useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import VideoPlayer from '../src/components/video'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

type Props = { id: string; width: number; height?: number; muted: boolean }
const VideoDemo = ({ id, width }: Props) => {
    const [gif, setGif] = useState<IGif>()

    const fetch = useCallback(async () => {
        const { data: gif } = await gf.gif(id)
        setGif(gif)
    }, [id])

    useEffect(() => {
        fetch()
    }, [fetch, id])

    // percy and our video autoplay aren't cooperating
    return !isPercy() && gif ? <VideoPlayer gif={gif} width={width} controls /> : null
}

export default {
    title: 'React Components/Video Player',
    decorators: [withKnobs, jsxDecorator],
}

export const Video = () => (
    <VideoDemo
        id={text('id', 'D068R9Ziv1iCjezKzG')}
        width={number('width', 300)}
        height={number('height', 0)}
        muted={boolean('muted', false)}
    />
)
