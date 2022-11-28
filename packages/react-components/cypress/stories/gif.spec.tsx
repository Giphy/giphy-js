import * as React from 'react'
import { composeStories } from '@storybook/testing-react'

import * as stories from '../../stories/gif.stories'
import { storiesCompositionToList } from '../utils/storybook'
import {
    checkGifIsVisible,
    checkGifKeyboardEvents,
    checkGifMouseEvents,
    checkGifSeen,
    GifTestUtilsContext,
    performAllGifTelemetryEvents,
    setupGifTestUtils,
} from '../utils/gif-test-utils'
import { checkNoTelemetryHappens, checkUsualTelemetryHappens, interceptPingbacks } from '../utils/pingback-utils'

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

    describe('telemetry tests', () => {
        let gifTestUtilsCtx: GifTestUtilsContext

        before(() => {
            gifTestUtilsCtx = setupGifTestUtils('my-id')
        })

        for (const { Component, title } of [
            {
                title: 'should send no telemetry if user has not specified the opt-in prop',
                Component: (events: typeof gifTestUtilsCtx['events']) => <stories.Gif {...events} />,
            },
            {
                title: 'should send no telemetry if user has explicitly opted out',
                Component: (events: typeof gifTestUtilsCtx['events']) => (
                    <stories.Gif {...events} optInToTelemetry={false} />
                ),
            },
        ]) {
            it(title, () => {
                interceptPingbacks()
                cy.mount(<Component {...gifTestUtilsCtx.events} />)
                performAllGifTelemetryEvents()
                checkNoTelemetryHappens()
            })
        }

        it('should send usual telemetry if user has explicitly opted in', () => {
            interceptPingbacks()
            cy.mount(<stories.Gif {...gifTestUtilsCtx.events} optInToTelemetry={true} />)
            performAllGifTelemetryEvents()
            checkUsualTelemetryHappens()
        })
    })
})
