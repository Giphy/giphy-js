import { IGif } from '@giphy/js-types'
import React from 'react'
import Video from '../../src/components/video'
import { invalidatePlayRequest, playVideo } from '../../src/components/video/play-video'

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

    it('notifies muted state when the fallback throws synchronously', () => {
        cy.then(async () => {
            play.onFirstCall().rejects(new DOMException('policy', 'NotAllowedError'))
            play.onSecondCall().throws(new DOMException('unsupported', 'NotSupportedError'))
            await playVideo(video, { retryMuted: true, onMuted })
            expect(video.muted).to.equal(true)
            expect(onMuted).to.be.calledOnceWith(true)
            expect(play).to.be.calledTwice
        })
    })

    ;[false, true].forEach((reject) => {
        it(`preserves pending autoplay ${reject ? 'policy retry' : 'success'} across a manual play request`, () => {
            cy.then(async () => {
                const pending = deferred()
                play.onFirstCall().returns(pending.promise)
                play.onSecondCall().resolves()
                play.onThirdCall().resolves()
                const autoplay = playVideo(video, { retryMuted: true, onMuted })
                await playVideo(video)
                if (reject) pending.reject(new DOMException('policy', 'NotAllowedError'))
                else pending.resolve()
                await autoplay
                expect(play.callCount).to.equal(reject ? 3 : 2)
                expect(video.muted).to.equal(reject)
                expect(onMuted).to.be.calledOnceWith(reject)
            })
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

    const invalidations: Record<string, () => void | Promise<void>> = {
        pause: () => {
            video.dispatchEvent(new Event('pause'))
        },
        emptied: () => {
            video.dispatchEvent(new Event('emptied'))
        },
        'source change': () => {
            video.src = '/play-test-next.mp4'
        },
        removal: () => video.remove(),
        'explicit invalidation': () => invalidatePlayRequest(video),
        'new autoplay request': async () => {
            play.onSecondCall().resolves()
            await playVideo(video, { retryMuted: true })
        },
    }

    Object.entries(invalidations).forEach(([reason, makeStale]) => {
        ;[false, true].forEach((reject) => {
            it(`ignores stale ${reject ? 'rejection' : 'success'} after ${reason}`, () => {
                cy.then(async () => {
                    const pending = deferred()
                    play.onFirstCall().returns(pending.promise)
                    const request = playVideo(video, { retryMuted: true, onMuted })
                    await makeStale()
                    if (reject) pending.reject(new DOMException('policy', 'NotAllowedError'))
                    else pending.resolve()
                    await request
                    expect(play.callCount).to.equal(reason === 'new autoplay request' ? 2 : 1)
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

const stubCancelledPlayAfterAutoplay = () =>
    cy.window().then((win) => {
        const play = cy.stub(win.HTMLMediaElement.prototype, 'play').as('play')
        play.onFirstCall().resolves()
        play.onSecondCall().rejects(new DOMException('paused', 'AbortError'))
    })

describe('Video playback integration', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/play-test*.mp4', { statusCode: 204 })
    })

    it('catches a cancelled loop request and preserves end callbacks', () => {
        stubCancelledPlayAfterAutoplay()
        const onEnded = cy.stub().as('onEnded')
        cy.mount(<Video gif={gif} width={320} height={180} loop onEnded={onEnded} />)
        cy.get('video').trigger('play').trigger('ended')
        cy.get('@play').should('have.been.calledTwice')
        cy.get('@onEnded').should('have.been.calledOnce')
    })

    it('catches a cancelled controls-click request', () => {
        stubCancelledPlayAfterAutoplay()
        cy.mount(<Video gif={gif} width={320} height={180} controls />)
        cy.get('video').parent().click('center')
        cy.get('@play').should('have.been.calledTwice')
    })

    ;[false, true].forEach((reject) => {
        it(`preserves pending autoplay ${reject ? 'policy retry' : 'mute notification'} after a controls click`, () => {
            const pending = deferred()
            cy.window().then((win) => {
                const play = cy.stub(win.HTMLMediaElement.prototype, 'play').as('play')
                play.onFirstCall().returns(pending.promise)
                play.onSecondCall().resolves()
                play.onThirdCall().resolves()
            })
            const onMuted = cy.stub().as('onMuted')
            cy.mount(<Video gif={gif} width={320} height={180} controls muted={reject} onMuted={onMuted} />)
            cy.get('@play').should('have.been.calledOnce')
            cy.get('video').parent().click('center')
            cy.get('@play').should('have.been.calledTwice')
            // For policy rejection, the click unmutes the initially muted player.
            cy.get('video').should('have.prop', 'muted', !reject)
            cy.then(() => {
                if (reject) pending.reject(new DOMException('policy', 'NotAllowedError'))
                else pending.resolve()
                return pending.promise.catch(() => undefined)
            })
            cy.get('@play').should('have.callCount', reject ? 3 : 2)
            cy.get('@onMuted').should('have.been.calledOnceWith', reject)
            cy.get('video').should('have.prop', 'muted', true)
        })
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
