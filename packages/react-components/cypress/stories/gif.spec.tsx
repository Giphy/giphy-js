import { composeStories } from '@storybook/react'
import * as React from 'react'

import * as stories from '../../stories/gif.stories'
import {
    GifTestUtilsContext,
    checkGifKeyboardEvents,
    checkGifMouseEvents,
    checkGifSeen,
    setupGifTestUtils,
} from '../utils/gif-test-utils'

const storiesGifIds = {
    Gif: 'ZEU9ryYGZzttn0Cva7',
    GifWithVideoOverlay: 'D068R9Ziv1iCjezKzG',
    GifWithVideoOverlayFillVideo: '3BNRWBatePBETD7Bfg',
    GifNoBorderRadius: 'ZEU9ryYGZzttn0Cva7',
    Sticker: 'l1J9FvenuBnI4GTeg',
    CustomPingbackGif: 'ZEU9ryYGZzttn0Cva7',
} as const

const testCases = Object.values(composeStories(stories)).map((Story) => [
    // The ! is necessary in Typescript only, as the property is part of a partial type
    Story.storyName!,
    Story,
])

describe('Gif', () => {
    testCases.forEach(([name = '', Story]) => {
        let gifTestUtilsCtx: GifTestUtilsContext

        before(() => {
            gifTestUtilsCtx = setupGifTestUtils(storiesGifIds.Gif)
        })

        it(`Story: ${name}`, () => {
            const options = { takeSnapshots: false } // snapshotNamePrefix: `Stories / Gif / ${name}` }
            cy.mount(<Story {...gifTestUtilsCtx.events} />)
            // checkGifIsVisible(gifTestUtilsCtx)
            checkGifSeen(gifTestUtilsCtx, options)
            checkGifMouseEvents(gifTestUtilsCtx, options)
            checkGifKeyboardEvents(gifTestUtilsCtx, options)
        })
    })
})
