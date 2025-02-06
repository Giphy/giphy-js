import { composeStories } from '@storybook/react'
import * as React from 'react'
import Grid from '../../src/components/grid'
import * as stories from '../../stories/grid.stories'
import {
    GifTestUtilsContext,
    checkGifKeyboardEvents,
    checkGifMouseEvents,
    checkGifSeen,
    resetGifEventsHistory,
    setupGifTestUtils,
} from '../utils/gif-test-utils'

const GIFS_COUNT = 5

const { GridAPIError, GridStory } = composeStories(stories)

function getGridRoot() {
    return cy.get(`.${Grid.className}`)
}

function getGridGifs() {
    return getGridRoot().get('[data-giphy-id]')
}

function forEachGif(fn: (gifId: string, index: number) => void) {
    getGridGifs().each((gif, idx) =>
        cy
            .wrap(gif)
            .invoke('attr', 'data-giphy-id')
            .then((gifId) => fn(gifId as string, idx))
    )
}

describe('Grid', () => {
    let gifUtilsCtx: GifTestUtilsContext
    let onGifsFetched: typeof Cypress.sinon.stub

    before(() => {
        gifUtilsCtx = setupGifTestUtils('')
        onGifsFetched = cy.stub().as('onGifsFetched')
    })

    it('grid', () => {
        cy.mount(<GridStory noLink onGifsFetched={onGifsFetched} {...gifUtilsCtx.events} />)

        cy.wrap(onGifsFetched).should('be.called')
        getGridGifs().should('be.visible').its('length').should('eq', GIFS_COUNT)

        forEachGif((gifId, idx) => {
            gifUtilsCtx.gifId = gifId as string
            // checkGifIsVisible(gifUtilsCtx)
            // Check only the first to avoid test drift at different viewport sizes
            if (idx === 0) {
                checkGifSeen(gifUtilsCtx)
            }
        })

        forEachGif((gifId) => {
            gifUtilsCtx.gifId = gifId as string
            resetGifEventsHistory(gifUtilsCtx)
            checkGifMouseEvents(gifUtilsCtx)
            checkGifKeyboardEvents(gifUtilsCtx)
        })
    })

    it('GridAPIError', () => {
        const onGifsFetched = cy.stub().as('onGifsFetched')
        cy.mount(<GridAPIError onGifsFetched={onGifsFetched} />)

        cy.wait(1000)
        getGridRoot().should('be.visible')
        getGridGifs().should('not.exist')
        cy.wrap(onGifsFetched).should('not.be.called')
        cy.percySnapshot('Grid / GridAPIError')
    })
})
