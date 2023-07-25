import * as React from 'react'

import { composeStories } from '@storybook/react'
import * as stories from '../../stories/video.stories'
import { getVideoElement } from '../utils/video-test-utils'

const storiesGifIds = {
    Video: 'D068R9Ziv1iCjezKzG',
    VideoCaptionsBeta: 'D068R9Ziv1iCjezKzG',
    VideoUserMuted: 'obhOJFSwuTRN7VDY55',
    VideoNoContent: 'ZEU9ryYGZzttn0Cva7',
} as const

const { VideoNoContent } = composeStories(stories)

describe.skip('Video', () => {
    // composedStories.forEach((story) => {
    //     let videoTestUtilsCtx: VideoTestUtilsContext

    //     before(() => {
    //         videoTestUtilsCtx = setupVideoTestUtils(storiesGifIds[story.key], { loop: true })
    //     })

    //     it(story.key, () => {
    //         const snapshotNamePrefix = `Video - ${story.key}`
    //         cy.mount(<story.Component {...videoTestUtilsCtx.events} />)

    //         checkVideoIsVisible(videoTestUtilsCtx, { takeSnapshots: true, snapshotNamePrefix })
    //         // Check events only for one story to save resources on duplicate tests
    //         if (story.key === 'Video') {
    //             checkVideoEvents(videoTestUtilsCtx)
    //         }
    //     })
    // })

    it('VideoNoContent', () => {
        const gifId = storiesGifIds.VideoNoContent
        cy.mount(<VideoNoContent />)
        cy.wait(1000)
        getVideoElement(gifId).should('not.exist')
        cy.percySnapshot('Video - VideoNoContent')
    })
})
