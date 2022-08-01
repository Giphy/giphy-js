import * as React from 'react'
import { composeStories } from '@storybook/testing-react'

import * as stories from '../../stories/video-player.stories'
import { storiesCompositionToList } from '../utils/storybook'
import {
    setupVideoTestUtils,
    VideoTestUtilsContext,
    checkVideoIsVisible,
    checkVideoEvents,
} from '../utils/video-test-utils'

const GIF_ID = 'WtUBmrAK1Yda649Ayr'

const composedStories = storiesCompositionToList(composeStories(stories))

describe('Video Player', () => {
    composedStories.forEach((story) => {
        let videoTestUtilsCtx: VideoTestUtilsContext

        before(() => {
            videoTestUtilsCtx = setupVideoTestUtils(GIF_ID, { loop: true })
        })

        it(story.key, () => {
            const snapshotNamePrefix = `Stories / Video Player / ${story.key}`
            cy.mount(<story.Component {...videoTestUtilsCtx.events} />)

            checkVideoIsVisible(videoTestUtilsCtx, { takeSnapshots: true, snapshotNamePrefix })
            // Check events only for one story to save resources on duplicate tests
            if (story.key === 'VideoWithControls') {
                checkVideoEvents(videoTestUtilsCtx)
            }
        })
    })
})
