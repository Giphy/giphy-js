import React, { useState } from 'react'
import fetchMock from 'fetch-mock'
import { jsxDecorator } from 'storybook-addon-jsx'
import { boolean, color, number, withKnobs } from '@storybook/addon-knobs'
import { Story } from '@storybook/react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import type { GifID, IGif } from '@giphy/js-types'

import inTestsRunner from './in-tests-runner'
import mockDefaultEmojiVariationsResult from './mock-data/default-emoji-variations.json'
import mockEmojiVariationsResult from './mock-data/emoji-variations.json'
import { EmojiVariationsList, EmojiVariationsListProps, Grid } from '../src'

const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'
const gf = new GiphyFetch(apiKey)

export default {
    title: 'React Components/Emoji Variations List',
    decorators: [withKnobs, jsxDecorator],
}

type StoryProps = Partial<EmojiVariationsListProps>

export const Default: Story<StoryProps> = (props) => {
    const [gif, setGif] = useState<IGif | null>(null)

    const fetchDefaultVariations = async (offset: number) => {
        if (inTestsRunner()) {
            fetchMock
                .restore()
                .getOnce(`begin:https://api.giphy.com/v2/emoji?`, { body: mockDefaultEmojiVariationsResult })
        }
        const result = await gf.emojiDefaultVariations({ offset })
        fetchMock.restore()
        return result
    }

    const fetchVariations = async (id: GifID) => {
        if (inTestsRunner()) {
            fetchMock.restore().getOnce(`begin:https://api.giphy.com/v2/emoji/${id}/variations?`, {
                body: mockEmojiVariationsResult,
            })
        }
        const result = await gf.emojiVariations(id)
        fetchMock.restore()
        return result
    }

    return (
        <div style={{ maxWidth: '400px' }}>
            {gif ? (
                <EmojiVariationsList
                    backgroundColor={color('background color', '#2e2e2e')}
                    dividerColor={color('divider color', '#4e4e4e')}
                    fetchVariations={fetchVariations}
                    gif={gif}
                    gifHeight={number('gif height', 100)}
                    gifWidth={number('gif width', undefined as any)}
                    gutter={number('gutter', 10)}
                    hideAttribution={boolean('hide attribution', true)}
                    noLink={boolean('no link', true)}
                    {...props}
                />
            ) : null}
            <div style={{ margin: '24px 0' }}>
                <Grid
                    columns={3}
                    fetchGifs={fetchDefaultVariations}
                    hideAttribution={true}
                    noLink={true}
                    onGifClick={setGif}
                    width={400}
                />
            </div>
        </div>
    )
}
