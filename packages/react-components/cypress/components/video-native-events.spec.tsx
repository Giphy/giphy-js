import { IGif } from '@giphy/js-types'
import React from 'react'
import Video from '../../src/components/video'
import { setupVideoTestUtils } from '../utils/video-test-utils'

const gif = {
    id: 'native-events-test',
    images: {},
    video: { assets: { '720p': { url: '/native-events-test.mp4', width: 320, height: 180 } } },
} as IGif

const renderVideo = (props: Omit<React.ComponentProps<typeof Video>, 'gif' | 'width' | 'height'>) => (
    <Video gif={gif} width={320} height={180} {...props} />
)

// Media events are emitted by the video even when controls cover the element.
const mediaEventOptions = { bubbles: false, force: true }

describe('Video native events', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/native-events-test.mp4', { statusCode: 204 })
        cy.window().then((win) => {
            const play = cy.stub(win.HTMLMediaElement.prototype, 'play').as('play')
            play.resolves()
        })
    })

    ;[false, true].forEach((controls) => {
        it(`distinguishes play from playing with controls=${controls}`, () => {
            const { events } = setupVideoTestUtils(String(gif.id))
            const playingEvents: { type: string; video: HTMLVideoElement }[] = []
            const capturePlayingEvent: React.ReactEventHandler<HTMLVideoElement> = (event) => {
                playingEvents.push({ type: event.type, video: event.currentTarget })
            }
            events.onPlaying.callsFake(capturePlayingEvent)
            cy.mount(renderVideo({ controls, ...events }))
            // Existing play callbacks are installed in the mount effects.
            cy.get('@play').should('have.been.calledOnce')
            cy.get('video').trigger('play', mediaEventOptions)
            cy.get('@onStateChange').should('have.been.calledOnceWith', 'playing')
            cy.get('@onFirstPlay').should('have.been.calledOnce')
            cy.get('@onPlaying').should('not.have.been.called')
            cy.get('video').trigger('playing', mediaEventOptions).trigger('playing', mediaEventOptions)
            cy.get('@onPlaying').should('have.been.calledTwice')
            cy.get('video').then(($video) => {
                expect(playingEvents).to.deep.equal([
                    { type: 'playing', video: $video[0] },
                    { type: 'playing', video: $video[0] },
                ])
            })
            cy.get('@onStateChange').should('have.been.calledOnce')
            cy.get('@onFirstPlay').should('have.been.calledOnce')
            cy.get('video').trigger('pause', mediaEventOptions).trigger('play', mediaEventOptions)
            cy.get('@onStateChange').should('have.been.calledThrice')
            cy.get('@onFirstPlay').should('have.been.calledOnce')
        })

        it(`forwards distinct readiness events and duration with controls=${controls}`, () => {
            const { events } = setupVideoTestUtils(String(gif.id))
            const readinessEvents: { type: string; video: HTMLVideoElement; duration: number }[] = []
            const captureReadinessEvent: React.ReactEventHandler<HTMLVideoElement> = (event) => {
                readinessEvents.push({
                    type: event.type,
                    video: event.currentTarget,
                    duration: event.currentTarget.duration,
                })
            }
            events.onLoadedMetadata.callsFake(captureReadinessEvent)
            events.onLoadedData.callsFake(captureReadinessEvent)
            cy.mount(renderVideo({ controls, ...events }))
            cy.get('video').then(($video) => {
                Object.defineProperty($video[0], 'duration', { configurable: true, value: 12.5 })
            })
            cy.get('video').trigger('loadedmetadata', mediaEventOptions)
            cy.get('@onLoadedMetadata').should('have.been.calledOnce')
            cy.get('@onLoadedData').should('not.have.been.called')
            cy.get('video').then(($video) => {
                expect(readinessEvents).to.deep.equal([{ type: 'loadedmetadata', video: $video[0], duration: 12.5 }])
            })
            cy.get('video').trigger('loadeddata', mediaEventOptions)
            cy.get('@onLoadedData').should('have.been.calledOnce')
            cy.get('@onLoadedMetadata').should('have.been.calledOnce')
            cy.get('video').then(($video) => {
                expect(readinessEvents).to.deep.equal([
                    { type: 'loadedmetadata', video: $video[0], duration: 12.5 },
                    { type: 'loadeddata', video: $video[0], duration: 12.5 },
                ])
            })
            cy.get('@onPlaying').should('not.have.been.called')
            cy.get('@onFirstPlay').should('not.have.been.called')
        })

        it(`uses updated handlers after rerender with controls=${controls}`, () => {
            const initialMediaHandler = cy.stub().as('initialMediaHandler')
            const replacementMediaHandler = cy.stub().as('replacementMediaHandler')
            cy.mount(
                renderVideo({
                    controls,
                    onPlaying: initialMediaHandler,
                    onLoadedData: initialMediaHandler,
                    onLoadedMetadata: initialMediaHandler,
                })
            ).then(({ rerender }) =>
                rerender(
                    renderVideo({
                        controls,
                        onPlaying: replacementMediaHandler,
                        onLoadedData: replacementMediaHandler,
                        onLoadedMetadata: replacementMediaHandler,
                    })
                )
            )
            cy.get('video')
                .trigger('playing', mediaEventOptions)
                .trigger('loadeddata', mediaEventOptions)
                .trigger('loadedmetadata', mediaEventOptions)
            cy.get('@initialMediaHandler').should('not.have.been.called')
            cy.get('@replacementMediaHandler').should('have.been.calledThrice')
        })
    })
})
