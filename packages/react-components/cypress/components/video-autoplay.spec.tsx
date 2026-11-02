import { IGif } from '@giphy/js-types'
import React from 'react'
import Video from '../../src/components/video'

const gif = {
    id: 'autoplay-test',
    images: {},
    video: {
        assets: {
            '720p': { url: '/autoplay-test.mp4', width: 320, height: 180 },
        },
    },
} as IGif

describe('Video autoplay', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/autoplay-test.mp4', { statusCode: 204 })
        cy.window().then((win) => {
            const play = cy.stub(win.HTMLMediaElement.prototype, 'play').as('play')
            play.resolves()
        })
    })

    ;[false, true].forEach((controls) => {
        it(`autoplays by default with controls=${controls}`, () => {
            cy.mount(<Video gif={gif} width={320} height={180} controls={controls} />)
            cy.get('video').should('have.prop', 'autoplay', true)
            cy.get('@play').should('have.been.calledOnce')
        })

        it(`allows explicit autoplay with controls=${controls}`, () => {
            cy.mount(<Video gif={gif} width={320} height={180} controls={controls} autoPlay />)
            cy.get('video').should('have.prop', 'autoplay', true)
            cy.get('@play').should('have.been.calledOnce')
        })

        it(`supports manual playback with controls=${controls}`, () => {
            let videoEl: HTMLVideoElement
            const onMuted = cy.stub().as('onMuted')
            cy.mount(
                <Video
                    gif={gif}
                    width={320}
                    height={180}
                    controls={controls}
                    autoPlay={false}
                    volume={0.4}
                    onMuted={onMuted}
                    setVideoEl={(el) => {
                        videoEl = el
                    }}
                />
            )
            cy.get('video').should('have.prop', 'autoplay', false).and('have.prop', 'volume', 0.4)
            cy.get('@play').should('not.have.been.called')
            cy.get('@onMuted').should('not.have.been.called')
            cy.get('video').then(($video) => {
                expect(videoEl).to.equal($video[0])
                return videoEl.play()
            })
            cy.get('@play').should('have.been.calledOnce')
        })
    })
})
