import { IGif } from '@giphy/js-types'
import React from 'react'
import Video from '../../src/components/video'
import { cancelVideoPlay, playVideo } from '../../src/components/video/play-video'

const deferred = () => {
    let resolve!: () => void
    let reject!: (error: unknown) => void
    const promise = new Promise<void>((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
    })
    return { promise, resolve, reject }
}

describe('video play requests', () => {
    let video: HTMLVideoElement
    let nativePlay: HTMLVideoElement['play']
    let play: ReturnType<typeof cy.stub>
    let onMuted: ReturnType<typeof cy.stub>

    beforeEach(() => {
        cy.intercept('GET', '**/play-test*.mp4', { statusCode: 204 })
        cy.document().then((document) => {
            video = document.createElement('video')
            video.src = '/play-test.mp4'
            document.body.appendChild(video)
            nativePlay = video.play
            play = cy.stub(video, 'play')
            onMuted = cy.stub()
        })
    })

    afterEach(() => video.remove())

    it('retains the successful autoplay mute notification', () => {
        cy.then(async () => {
            play.resolves()
            await playVideo(video, { retryMuted: true, onMuted })
            expect(play).to.be.calledOnce
            expect(onMuted).to.be.calledOnceWith(false)
        })
    })

    ;['AbortError', 'NotSupportedError', 'Error'].forEach((name) => {
        it(`does not mute or retry ${name}`, () => {
            cy.then(async () => {
                play.rejects(new DOMException('play rejected', name))
                await playVideo(video, { retryMuted: true, onMuted })
                expect(play).to.be.calledOnce
                expect(video.muted).to.equal(false)
                expect(onMuted).not.to.be.called
            })
        })
    })

    it('mutes and retries a policy rejection once', () => {
        cy.then(async () => {
            play.onFirstCall().rejects(new DOMException('policy', 'NotAllowedError'))
            play.onSecondCall().resolves()
            await playVideo(video, { retryMuted: true, onMuted })
            expect(play).to.be.calledTwice
            expect(video.muted).to.equal(true)
            expect(onMuted).to.be.calledOnceWith(true)
        })
    })

    it('catches a rejected muted fallback without retrying again', () => {
        cy.then(async () => {
            play.rejects(new DOMException('policy', 'NotAllowedError'))
            await playVideo(video, { retryMuted: true, onMuted })
            expect(play).to.be.calledTwice
        })
    })

    it('does not retry policy rejection when already muted', () => {
        cy.then(async () => {
            video.muted = true
            play.rejects(new DOMException('policy', 'NotAllowedError'))
            await playVideo(video, { retryMuted: true, onMuted })
            expect(play).to.be.calledOnce
            expect(onMuted).not.to.be.called
        })
    })

    it('allows the mute callback to pause the native fallback request', () => {
        cy.then(async () => {
            let pausedAtNotification: boolean | undefined
            play.onFirstCall().rejects(new DOMException('policy', 'NotAllowedError'))
            play.onSecondCall().callsFake(() => nativePlay.call(video))
            onMuted.callsFake(() => {
                pausedAtNotification = video.paused
                video.pause()
            })
            await playVideo(video, { retryMuted: true, onMuted })
            expect(pausedAtNotification).to.equal(false)
            expect(video.paused).to.equal(true)
            expect(play).to.be.calledTwice
            expect(onMuted).to.be.calledOnceWith(true)
        })
    })

    it('ignores an old queued pause event after a newer request resumes', () => {
        cy.then(async () => {
            const pending = deferred()
            play.returns(pending.promise)
            const request = playVideo(video, { retryMuted: true, onMuted })
            Object.defineProperty(video, 'paused', { configurable: true, value: false })
            video.dispatchEvent(new Event('pause'))
            pending.resolve()
            await request
            expect(onMuted).to.be.calledOnceWith(false)
        })
    })

    ;['pause', 'emptied', 'source change', 'removal', 'explicit cancellation', 'new request'].forEach((reason) => {
        ;[false, true].forEach((reject) => {
            it(`ignores stale ${reject ? 'rejection' : 'success'} after ${reason}`, () => {
                cy.then(async () => {
                    const pending = deferred()
                    play.onFirstCall().returns(pending.promise)
                    const request = playVideo(video, { retryMuted: true, onMuted })
                    if (reason === 'pause' || reason === 'emptied') video.dispatchEvent(new Event(reason))
                    if (reason === 'source change') video.src = '/play-test-next.mp4'
                    if (reason === 'removal') video.remove()
                    if (reason === 'explicit cancellation') cancelVideoPlay(video)
                    if (reason === 'new request') {
                        play.onSecondCall().resolves()
                        await playVideo(video)
                    }
                    if (reject) pending.reject(new DOMException('policy', 'NotAllowedError'))
                    else pending.resolve()
                    await request
                    expect(play.callCount).to.equal(reason === 'new request' ? 2 : 1)
                    expect(video.muted).to.equal(false)
                    expect(onMuted).not.to.be.called
                })
            })
        })
    })

    it('catches synchronous play failures', () => {
        cy.then(async () => {
            play.throws(new DOMException('cancelled', 'AbortError'))
            await playVideo(video, { retryMuted: true, onMuted })
            expect(play).to.be.calledOnce
            expect(onMuted).not.to.be.called
        })
    })
})

const gif = {
    id: 'play-test',
    images: {},
    video: { assets: { '720p': { url: '/play-test.mp4', width: 320, height: 180 } } },
} as IGif

describe('Video playback integration', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/play-test*.mp4', { statusCode: 204 })
    })

    it('catches a cancelled loop request and preserves end callbacks', () => {
        cy.window().then((win) => {
            const play = cy.stub(win.HTMLMediaElement.prototype, 'play').as('play')
            play.onFirstCall().resolves()
            play.onSecondCall().rejects(new DOMException('paused', 'AbortError'))
        })
        const onEnded = cy.stub().as('onEnded')
        cy.mount(<Video gif={gif} width={320} height={180} loop onEnded={onEnded} />)
        cy.get('video').trigger('play').trigger('ended')
        cy.get('@play').should('have.been.calledTwice')
        cy.get('@onEnded').should('have.been.calledOnce')
    })

    it('catches a cancelled controls-click request', () => {
        cy.window().then((win) => {
            const play = cy.stub(win.HTMLMediaElement.prototype, 'play').as('play')
            play.onFirstCall().resolves()
            play.onSecondCall().rejects(new DOMException('paused', 'AbortError'))
        })
        cy.mount(<Video gif={gif} width={320} height={180} controls />)
        cy.get('video').parent().click('center')
        cy.get('@play').should('have.been.calledTwice')
    })

    it('invalidates pending autoplay when the component unmounts', () => {
        const pending = deferred()
        cy.window().then((win) => {
            const play = cy.stub(win.HTMLMediaElement.prototype, 'play').as('play')
            play.returns(pending.promise)
        })
        const onMuted = cy.stub().as('onMuted')
        cy.mount(<Video gif={gif} width={320} height={180} onMuted={onMuted} />)
        cy.get('@play').should('have.been.calledOnce')
        cy.mount(<div />)
        cy.then(() => {
            pending.reject(new DOMException('policy', 'NotAllowedError'))
            return pending.promise.catch(() => undefined)
        })
        cy.get('@play').should('have.been.calledOnce')
        cy.get('@onMuted').should('not.have.been.called')
    })
})
