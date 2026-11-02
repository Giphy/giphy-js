import { IGif } from '@giphy/js-types'
import React from 'react'
import Video from '../../src/components/video'

const gif = {
    id: 'native-events-test',
    images: {},
    video: { assets: { '720p': { url: '/native-events-test.mp4', width: 320, height: 180 } } },
} as IGif

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
            const onStateChange = cy.stub().as('onStateChange')
            const onFirstPlay = cy.stub().as('onFirstPlay')
            const received: { type: string; video: HTMLVideoElement }[] = []
            const onPlaying: React.ReactEventHandler<HTMLVideoElement> = (event) => {
                received.push({ type: event.type, video: event.currentTarget })
            }
            cy.mount(
                <Video
                    gif={gif}
                    width={320}
                    height={180}
                    controls={controls}
                    onStateChange={onStateChange}
                    onFirstPlay={onFirstPlay}
                    onPlaying={onPlaying}
                />
            )
            // Existing play callbacks are installed in the mount effects.
            cy.get('@play').should('have.been.calledOnce')
            cy.get('video').trigger('play', mediaEventOptions)
            cy.get('@onStateChange').should('have.been.calledOnceWith', 'playing')
            cy.get('@onFirstPlay').should('have.been.calledOnce')
            cy.then(() => expect(received).to.have.length(0))
            cy.get('video').trigger('playing', mediaEventOptions).trigger('playing', mediaEventOptions)
            cy.get('video').then(($video) => {
                expect(received).to.deep.equal([
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
            const received: { type: string; video: HTMLVideoElement; duration: number }[] = []
            const record: React.ReactEventHandler<HTMLVideoElement> = (event) => {
                received.push({ type: event.type, video: event.currentTarget, duration: event.currentTarget.duration })
            }
            const onPlaying = cy.stub().as('onPlaying')
            const onFirstPlay = cy.stub().as('onFirstPlay')
            cy.mount(
                <Video
                    gif={gif}
                    width={320}
                    height={180}
                    controls={controls}
                    onLoadedMetadata={record}
                    onLoadedData={record}
                    onPlaying={onPlaying}
                    onFirstPlay={onFirstPlay}
                />
            )
            cy.get('video').then(($video) => {
                Object.defineProperty($video[0], 'duration', { configurable: true, value: 12.5 })
            })
            cy.get('video').trigger('loadedmetadata', mediaEventOptions)
            cy.get('video').then(($video) => {
                expect(received).to.deep.equal([{ type: 'loadedmetadata', video: $video[0], duration: 12.5 }])
            })
            cy.get('video').trigger('loadeddata', mediaEventOptions)
            cy.get('video').then(($video) => {
                expect(received).to.deep.equal([
                    { type: 'loadedmetadata', video: $video[0], duration: 12.5 },
                    { type: 'loadeddata', video: $video[0], duration: 12.5 },
                ])
            })
            cy.get('@onPlaying').should('not.have.been.called')
            cy.get('@onFirstPlay').should('not.have.been.called')
        })

        it(`uses updated handlers after rerender with controls=${controls}`, () => {
            const original = cy.stub().as('original')
            const updated = cy.stub().as('updated')
            cy.mount(
                <Video
                    gif={gif}
                    width={320}
                    height={180}
                    controls={controls}
                    onPlaying={original}
                    onLoadedData={original}
                    onLoadedMetadata={original}
                />
            ).then(({ rerender }) =>
                rerender(
                    <Video
                        gif={gif}
                        width={320}
                        height={180}
                        controls={controls}
                        onPlaying={updated}
                        onLoadedData={updated}
                        onLoadedMetadata={updated}
                    />
                )
            )
            cy.get('video')
                .trigger('playing', mediaEventOptions)
                .trigger('loadeddata', mediaEventOptions)
                .trigger('loadedmetadata', mediaEventOptions)
            cy.get('@original').should('not.have.been.called')
            cy.get('@updated').should('have.been.calledThrice')
        })
    })
})
