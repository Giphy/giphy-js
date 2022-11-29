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
    performAllGifTelemetryEvents,
} from '../utils/gif-test-utils'
import { checkNoTelemetryHappens, checkUsualTelemetryHappens, interceptPingbacks } from '../utils/pingback-utils'

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

    describe('telemetry tests', () => {
        let gifUtilsCtx: GifTestUtilsContext

        for (const { Component, title } of [
            {
                title: 'should send no telemetry if user has explicitly opted out',
                Component: (events: typeof gifUtilsCtx['events']) => (
                    <SearchExample
                        className="cy-carousel"
                        noLink
                        onGifsFetched={onGifsFetched}
                        {...events}
                        optInToTelemetry={false}
                    />
                ),
            },
            {
                title: 'should send no telemetry if user has not specified the opt-in prop',
                Component: (events: typeof gifUtilsCtx['events']) => (
                    <SearchExample className="cy-carousel" noLink onGifsFetched={onGifsFetched} {...events} />
                ),
            },
        ]) {
            before(() => {
                gifUtilsCtx = setupGifTestUtils('')
                onGifsFetched = cy.stub().as('onGifsFetched')
            })

            it(title, () => {
                interceptPingbacks()
                cy.mount(<Component {...gifUtilsCtx.events} />)
                cy.wrap(onGifsFetched).should('be.called')
                forEachGif((gifId) => {
                    performAllGifTelemetryEvents(gifId)
                })
                checkNoTelemetryHappens()
            })
        }

        before(() => {
            gifUtilsCtx = setupGifTestUtils('')
            onGifsFetched = cy.stub().as('onGifsFetched')
        })

        it('should send usual telemetry if user has explicitly opted in', () => {
            interceptPingbacks()
            cy.mount(
                <SearchExample
                    className="cy-carousel"
                    noLink
                    onGifsFetched={onGifsFetched}
                    {...gifUtilsCtx.events}
                    optInToTelemetry={true}
                />
            )
            cy.wrap(onGifsFetched).should('be.called')
            forEachGif((gifId) => {
                performAllGifTelemetryEvents(gifId)
            })
            checkUsualTelemetryHappens()
        })
    })
})
