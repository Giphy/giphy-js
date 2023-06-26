import { composeStories } from '@storybook/testing-react'
import * as React from 'react'

import { EmojiVariationsList } from '../../src'
import * as stories from '../../stories/emoji-variations-list.stories'
import {
    GifTestUtilsContext,
    checkGifIsVisible,
    checkGifKeyboardEvents,
    checkGifMouseEvents,
    checkGifSeen,
    resetGifEventsHistory,
    setupGifTestUtils,
} from '../utils/gif-test-utils'
import { DEFAULT_GRID_CLASS_NAME } from '../../src/components/grid'

const GIFS_COUNT = 6
const EMOJI_ID = 'dalJ0CpF7hwmN1nZXe'

const { Default: DefaultStory } = composeStories(stories)

function getGridRoot() {
    return cy.get(`.${DEFAULT_GRID_CLASS_NAME}`)
}

function getGridGif(id: string) {
    return getGridRoot().find(`[data-giphy-id="${id}"]`).first()
}

function getEmojiVariationsRoot() {
    return cy.get(`.${EmojiVariationsList.className}`)
}

function getEmojiVariationsGifs() {
    return getEmojiVariationsRoot().find('[data-giphy-id]')
}

function forEachGif(fn: (gifId: string, index: number) => void) {
    getEmojiVariationsGifs().each((gif, idx) =>
        cy
            .wrap(gif)
            .invoke('attr', 'data-giphy-id')
            .then((gifId) => fn(gifId as string, idx))
    )
}

describe('Emoji Variations List', () => {
    let gifUtilsCtx: GifTestUtilsContext
    let onVariationsFetched: typeof Cypress.sinon.stub
    before(() => {
        gifUtilsCtx = setupGifTestUtils('')
        onVariationsFetched = cy.stub().as('onVariationsFetched')
    })

    it('Default', () => {
        cy.mount(<DefaultStory onVariationsFetched={onVariationsFetched} {...gifUtilsCtx.events} />)

        getGridGif(EMOJI_ID)
            .click()
            // change the ID of the selected emoji to avoid its selection from the grid in the following test cases
            .invoke('attr', 'data-giphy-id', `${EMOJI_ID}-selected`)

        getEmojiVariationsGifs().should('be.visible').its('length').should('eq', GIFS_COUNT)
        cy.percySnapshot('Emoji Variations List / Default')

        forEachGif((gifId, idx) => {
            gifUtilsCtx.gifId = gifId as string
            checkGifIsVisible(gifUtilsCtx)
            // Check only the first and last element to avoid test drift at different viewport sizes
            if (idx === 0) {
                checkGifSeen(gifUtilsCtx)
            } else if (idx === GIFS_COUNT - 1) {
                expect(gifUtilsCtx.events.onGifSeen).not.be.calledWithMatch({ id: gifId })
            }
        })

        forEachGif((gifId) => {
            gifUtilsCtx.gifId = gifId as string
            resetGifEventsHistory(gifUtilsCtx)
            checkGifMouseEvents(gifUtilsCtx)
            checkGifKeyboardEvents(gifUtilsCtx)
        })
    })
})
