import * as React from 'react'
import { composeStories, composeStory } from '@storybook/testing-react'
import { SinonStub } from 'cypress/types/sinon'

import { Grid } from '../../src'
import * as stories from '../../stories/grid.stories'
import { storiesCompositionToList } from '../utils/storybook'
import {
    checkGifSeen,
    checkGifIsVisible,
    checkGifKeyboardEvents,
    checkGifMouseEvents,
    GifTestUtilsContext,
    performAllGifTelemetryEvents,
    resetGifEventsHistory,
    setupGifTestUtils,
} from '../utils/gif-test-utils'
import { checkNoTelemetryHappens, checkUsualTelemetryHappens, interceptPingbacks } from '../utils/pingback-utils'

const GIFS_COUNT = 5

const GridAPIError = composeStory(stories.GridAPIError, {})
const composedStories = storiesCompositionToList(composeStories(stories)).filter(
    (story) => story.key !== 'GridAPIError'
)

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
    composedStories.forEach((story) => {
        let gifUtilsCtx: GifTestUtilsContext
        let onGifsFetched: SinonStub

        before(() => {
            gifUtilsCtx = setupGifTestUtils('')
            onGifsFetched = cy.stub().as('onGifsFetched')
        })

        it(story.key, () => {
            cy.mount(<story.Component noLink onGifsFetched={onGifsFetched} {...gifUtilsCtx.events} />)

            cy.wrap(onGifsFetched).should('be.called')
            getGridGifs().should('be.visible').its('length').should('eq', GIFS_COUNT)
            cy.percySnapshot(`Grid / ${story.key}`)

            forEachGif((gifId, idx) => {
                gifUtilsCtx.gifId = gifId as string
                checkGifIsVisible(gifUtilsCtx)
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

    describe('telemetry tests', () => {
        let gifUtilsCtx: GifTestUtilsContext

        for (const { Component, title } of [
            {
                title: 'should send no telemetry if user has explicitly opted out',
                Component: (events: typeof gifUtilsCtx['events']) => (
                    <stories.Grid {...events} optInToTelemetry={false} />
                ),
            },
            {
                title: 'should send no telemetry if user has not specified the opt-in prop',
                Component: (events: typeof gifUtilsCtx['events']) => <stories.Grid {...events} />,
            },
        ]) {
            before(() => {
                gifUtilsCtx = setupGifTestUtils('')
            })

            it(title, () => {
                interceptPingbacks()
                cy.mount(<Component {...gifUtilsCtx.events} />)
                forEachGif((gifId) => {
                    performAllGifTelemetryEvents(gifId)
                })
                checkNoTelemetryHappens()
            })
        }

        it('should send usual telemetry if user has explicitly opted in', () => {
            interceptPingbacks()
            cy.mount(<stories.Grid {...gifUtilsCtx.events} optInToTelemetry={true} />)
            forEachGif((gifId) => {
                performAllGifTelemetryEvents(gifId)
            })
            checkUsualTelemetryHappens()
        })
    })
})
