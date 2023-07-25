import { composeStories } from '@storybook/react'
import * as React from 'react'
import * as stories from '../../stories/gif.stories'
import {
    checkGifIsVisible,
    checkGifKeyboardEvents,
    checkGifMouseEvents,
    checkGifSeen,
    setupGifTestUtils,
} from '../utils/gif-test-utils'

const testCases = Object.values(composeStories(stories)).map((Story) => [Story.storyName!, Story])
describe('Gif', () => {
    testCases.forEach(([name = '', Story]) => {
        it(`Story: ${name}`, () => {
            // @ts-ignore
            const gifTestUtilsCtx = setupGifTestUtils(Story.args.id)
            const options = { takeSnapshots: false } // snapshotNamePrefix: `Stories / Gif / ${name}` }
            cy.mount(<Story {...gifTestUtilsCtx.events} />)
            checkGifIsVisible(gifTestUtilsCtx)
            checkGifSeen(gifTestUtilsCtx, options)
            checkGifMouseEvents(gifTestUtilsCtx, options)
            checkGifKeyboardEvents(gifTestUtilsCtx, options)
        })
    })
})
