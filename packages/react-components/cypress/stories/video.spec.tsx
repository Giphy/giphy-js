import { composeStories } from '@storybook/react'
import * as React from 'react'
import * as stories from '../../stories/video.stories'
import { checkVideoEvents, checkVideoIsVisible, setupVideoTestUtils } from '../utils/video-test-utils'

const testCases = Object.values(composeStories(stories))
    .map((Story) => [Story.storyName!, Story])
    .filter(([name]) => name !== 'VideoNoContent')

describe('Video', () => {
    testCases.forEach(([name = '', Story]) => {
        it(`Story: ${name}`, () => {
            // @ts-ignore
            const videoTestUtilsCtx = setupVideoTestUtils(Story.args.id, { loop: true })
            const snapshotNamePrefix = `Video - ${name}`
            cy.mount(<Story {...videoTestUtilsCtx.events} />)

            checkVideoIsVisible(videoTestUtilsCtx, { takeSnapshots: true, snapshotNamePrefix })
            // Check events only for one story to save resources on duplicate tests
            if (name === 'Video') {
                checkVideoEvents(videoTestUtilsCtx)
            }
        })
    })
})
