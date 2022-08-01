import * as React from 'react'
import { composeStories } from '@storybook/testing-react'
import { SinonStub } from 'cypress/types/sinon'

import * as stories from '../../stories/carousel.stories'
import {
    checkGifSeen,
    checkGifIsVisible,
    checkGifKeyboardEvents,
    checkGifMouseEvents,
    GifTestUtilsContext,
    resetGifEventsHistory,
    setupGifTestUtils,
} from '../utils/gif-test-utils'

const GIFS_COUNT = 5

const { SearchExample } = composeStories(stories)

function getCarouselRoot() {
    return cy.get('.cy-carousel')
}

function getCarouselGifs() {
    return getCarouselRoot().children('[data-giphy-id]')
}

function forEachGif(fn: (gifId: string, index: number) => void) {
    getCarouselGifs().each((gif, idx) =>
        cy
            .wrap(gif)
            .invoke('attr', 'data-giphy-id')
            .then((gifId) => fn(gifId as string, idx))
    )
}

describe('Carousel', () => {
    let gifUtilsCtx: GifTestUtilsContext
    let onGifsFetched: SinonStub
    before(() => {
        gifUtilsCtx = setupGifTestUtils('')
        onGifsFetched = cy.stub().as('onGifsFetched')
    })

    it('SearchExample', () => {
        cy.mount(<SearchExample className="cy-carousel" noLink onGifsFetched={onGifsFetched} {...gifUtilsCtx.events} />)

        cy.wrap(onGifsFetched).should('be.called')
        getCarouselGifs().should('be.visible').its('length').should('eq', GIFS_COUNT)
        cy.percySnapshot('Carousel / SearchExample')

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
