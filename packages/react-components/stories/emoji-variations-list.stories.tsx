import { GiphyFetch } from '@giphy/js-fetch-api'
import type { GifID, IGif } from '@giphy/js-types'
import { Meta, StoryObj } from '@storybook/react'
import fetchMock from 'fetch-mock'
import React, { useState } from 'react'
import { EmojiVariationsList, Grid } from '../src'
import inTestsRunner from './in-tests-runner'
import mockDefaultEmojiVariationsResult from './mock-data/default-emoji-variations.json'
import mockEmojiVariationsResult from './mock-data/emoji-variations.json'

const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'
const gf = new GiphyFetch(apiKey)

type EmojiVariationsListProps = React.ComponentProps<typeof EmojiVariationsList>

export const Demo = (props: EmojiVariationsListProps) => {
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
                    key={`${gif.id}-${props.gifHeight}-${props.gifWidth}`}
                    backgroundColor={props.backgroundColor}
                    dividerColor={props.dividerColor}
                    gifWidth={props.gifWidth}
                    gutter={props.gutter}
                    hideAttribution={props.hideAttribution}
                    noLink
                    {...props}
                    fetchVariations={fetchVariations}
                    gif={gif}
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

const meta: Meta<typeof Demo> = {
    component: Demo,
    title: 'React Components/Emoji Variations List',
    argTypes: {
        backgroundColor: {
            control: { type: 'text' },
        },
        dividerColor: {
            control: { type: 'text' },
        },
        gutter: {
            control: { type: 'number' },
        },
        // TODO these don't seem to trigger a rerender of the component
        gifHeight: {
            control: { type: 'number' },
        },
        gifWidth: {
            control: { type: 'number' },
        },
        hideAttribution: {
            control: { type: 'boolean' },
        },
    },
    args: {
        backgroundColor: '#2e2e2e',
        dividerColor: '#4e4e4e',
        gifHeight: 100,
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const Emoji: Story = {}
