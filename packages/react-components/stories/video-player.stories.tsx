import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { boolean, number, withKnobs } from '@storybook/addon-knobs'
import React, { useCallback, useEffect, useState } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
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

export default {
    title: 'React Components/Video Player',
    decorators: [withKnobs, jsxDecorator],
}

export const VideoWithControls = () => {
    const gif = useGif('WtUBmrAK1Yda649Ayr')
    return gif ? (
        <VideoPlayer
            controls
            width={number('width', 300)}
            height={number('height', 0)}
            muted={boolean('muted', false)}
            gif={gif}
        />
    ) : (
        <div>video loading</div>
    )
}

export const VideoNoPlayPause = () => {
    const gif = useGif('WtUBmrAK1Yda649Ayr')
    return gif ? (
        <VideoPlayer
            gif={gif}
            controls
            hidePlayPause
            width={number('width', 300)}
            height={number('height', 0)}
            muted={boolean('muted', false)}
        />
    ) : (
        <div>video loading</div>
    )
}

export const VideoNoProgressBar = () => {
    const gif = useGif('WtUBmrAK1Yda649Ayr')
    return gif ? (
        <VideoPlayer
            gif={gif}
            controls
            hideProgressBar
            width={number('width', 300)}
            height={number('height', 0)}
            muted={boolean('muted', false)}
        />
    ) : (
        <div>video loading</div>
    )
}

export const VideoNoMute = () => {
    const gif = useGif('WtUBmrAK1Yda649Ayr')
    return gif ? (
        <VideoPlayer
            gif={gif}
            controls
            hideMute
            width={number('width', 300)}
            height={number('height', 0)}
            muted={boolean('muted', false)}
        />
    ) : (
        <div>video loading</div>
    )
}

export const VideoPersistent = () => {
    const gif = useGif('WtUBmrAK1Yda649Ayr')
    return gif ? (
        <VideoPlayer
            gif={gif}
            controls
            persistentControls
            width={number('width', 300)}
            height={number('height', 0)}
            muted={boolean('muted', false)}
        />
    ) : (
        <div>video loading</div>
    )
}
