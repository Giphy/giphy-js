import * as React from 'react'
import { composeStories } from '@storybook/testing-react'

import * as stories from '../../stories/gif.stories'
import { storiesCompositionToList } from '../utils/storybook'
import {
    setupGifTestUtils,
    GifTestUtilsContext,
    checkGifSeen,
    checkGifMouseEvents,
    checkGifKeyboardEvents,
    checkGifIsVisible,
} from '../utils/gif-test-utils'

const storiesGifIds = {
    Gif: 'ZEU9ryYGZzttn0Cva7',
    GifWithVideoOverlay: 'D068R9Ziv1iCjezKzG',
    GifWithVideoOverlayFillVideo: '3BNRWBatePBETD7Bfg',
    GifNoBorderRadius: 'ZEU9ryYGZzttn0Cva7',
    Sticker: 'l1J9FvenuBnI4GTeg',
    CustomPingbackGif: 'ZEU9ryYGZzttn0Cva7',
} as const

const composedStories = storiesCompositionToList(composeStories(stories))

describe('Gif', () => {
    composedStories.forEach((story) => {
        let gifTestUtilsCtx: GifTestUtilsContext

        before(() => {
            gifTestUtilsCtx = setupGifTestUtils(storiesGifIds[story.key])
        })

        it(story.key, () => {
            const options = { takeSnapshots: true, snapshotNamePrefix: `Stories / Gif / ${story.key}` }
            cy.mount(<story.Component {...gifTestUtilsCtx.events} />)
            checkGifIsVisible(gifTestUtilsCtx)
            checkGifSeen(gifTestUtilsCtx, options)
            checkGifMouseEvents(gifTestUtilsCtx, options)
            checkGifKeyboardEvents(gifTestUtilsCtx, options)
        })
    })
})
