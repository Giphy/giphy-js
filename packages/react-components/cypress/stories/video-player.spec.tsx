import { composeStories } from '@storybook/react'
import React from 'react'
import * as stories from '../../stories/video-player.stories'
import { checkVideoEvents, checkVideoIsVisible, setupVideoTestUtils } from '../utils/video-test-utils'

const testCases = Object.values(composeStories(stories))
    .map((Story) => [Story.storyName!, Story])
    .filter(([name]) => name !== 'VideoNoContent')

describe('Video Player', () => {
    testCases.forEach(([name = '', Story]) => {
        it(`Story: ${name}`, () => {
            // @ts-ignore
            const videoTestUtilsCtx = setupVideoTestUtils(Story.args.id, { loop: true })
            // const snapshotNamePrefix = `Stories / Video Player / ${story.key}`
            cy.mount(<Story {...videoTestUtilsCtx.events} />)
            checkVideoIsVisible(videoTestUtilsCtx)
            // Check events only for one story to save resources on duplicate tests
            if (name === 'VideoWithControls') {
                checkVideoEvents(videoTestUtilsCtx)
            }
        })
    })
})
