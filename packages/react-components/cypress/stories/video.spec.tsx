import * as React from 'react'
import { composeStories, composeStory } from '@storybook/testing-react'

import * as stories from '../../stories/video.stories'
import { storiesCompositionToList } from '../utils/storybook'
import {
    checkVideoEvents,
    checkVideoIsVisible,
    getVideoElement,
    performAllVideoTelemetryEvents,
    setupVideoTestUtils,
    VideoTestUtilsContext,
} from '../utils/video-test-utils'
import { checkNoTelemetryHappens, checkUsualTelemetryHappens, interceptPingbacks } from '../utils/pingback-utils'

const storiesGifIds = {
    Video: 'D068R9Ziv1iCjezKzG',
    VideoCaptionsBeta: 'D068R9Ziv1iCjezKzG',
    VideoUserMuted: 'obhOJFSwuTRN7VDY55',
    VideoNoContent: 'ZEU9ryYGZzttn0Cva7',
} as const

const VideoNoContent = composeStory(stories.VideoNoContent, {})
const composedStories = storiesCompositionToList(composeStories(stories)).filter(
    (story) => story.key !== 'VideoNoContent'
)

describe('Video', () => {
    composedStories.forEach((story) => {
        let videoTestUtilsCtx: VideoTestUtilsContext

        before(() => {
            videoTestUtilsCtx = setupVideoTestUtils(storiesGifIds[story.key], { loop: true })
        })

        it(story.key, () => {
            const snapshotNamePrefix = `Video - ${story.key}`
            cy.mount(<story.Component {...videoTestUtilsCtx.events} />)

            checkVideoIsVisible(videoTestUtilsCtx, { takeSnapshots: true, snapshotNamePrefix })
            // Check events only for one story to save resources on duplicate tests
            if (story.key === 'Video') {
                checkVideoEvents(videoTestUtilsCtx)
            }
        })
    })

    it('VideoNoContent', () => {
        const gifId = storiesGifIds.VideoNoContent
        cy.mount(<VideoNoContent />)
        cy.wait(1000)
        getVideoElement(gifId).should('not.exist')
        cy.percySnapshot('Video - VideoNoContent')
    })

    describe('telemetry tests', () => {
        let videoTestUtilsCtx: VideoTestUtilsContext

        for (const { Component, title } of [
            {
                title: 'should send no telemetry if user has explicitly opted out',
                Component: (events: typeof videoTestUtilsCtx['events']) => (
                    <stories.Video {...events} optInToTelemetry={false} />
                ),
            },
            {
                title: 'should send no telemetry if user has not specified the opt-in prop',
                Component: (events: typeof videoTestUtilsCtx['events']) => <stories.Video {...events} />,
            },
        ]) {
            before(() => {
                videoTestUtilsCtx = setupVideoTestUtils('my-id')
            })

            it(title, () => {
                interceptPingbacks()
                cy.mount(<Component {...videoTestUtilsCtx.events} />)
                performAllVideoTelemetryEvents(storiesGifIds.Video)
                checkNoTelemetryHappens()
            })
        }

        it('should send usual telemetry if user has explicitly opted in', () => {
            interceptPingbacks()
            cy.mount(<stories.Video {...videoTestUtilsCtx.events} optInToTelemetry={true} />)
            performAllVideoTelemetryEvents(storiesGifIds.Video)
            checkUsualTelemetryHappens()
        })
    })
})
