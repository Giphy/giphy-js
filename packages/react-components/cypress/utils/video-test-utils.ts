import Video from '../../src/components/video/video'
import VideoPlayer from '../../src/components/video'
import { ComponentEventStubs } from './types'

export type VideoEventStubs = ComponentEventStubs<typeof VideoPlayer>

export type VideoTestUtilsContext = {
    gifId: string
    loop: boolean
    events: VideoEventStubs
}

type TestUtilsOptions = Partial<Pick<VideoTestUtilsContext, 'loop'>>

type BaseAssertOptions = {
    takeSnapshots?: boolean
    snapshotNamePrefix?: string
}

const DEFAULT_BASE_ASSERT_OPTIONS: BaseAssertOptions = {
    snapshotNamePrefix: 'Video',
    takeSnapshots: false,
}

export function setupVideoTestUtils(gifId: string, options: TestUtilsOptions = {}): VideoTestUtilsContext {
    const onCanPlay = cy.stub().as('onCanPlay')
    const onEnded = cy.stub().as('onEnded')
    const onEndFullscreen = cy.stub().as('onEndFullscreen')
    const onError = cy.stub().as('onError')
    const onFirstPlay = cy.stub().as('onFirstPlay')
    const onLoop = cy.stub().as('onLoop')
    const onMuted = cy.stub().as('onMuted')
    const onQuartile = cy.stub().as('onQuartile')
    const onStateChange = cy.stub().as('onStateChange')
    const onTimeUpdate = cy.stub().as('onTimeUpdate')
    const onUserMuted = cy.stub().as('onUserMuted')
    const onWaiting = cy.stub().as('onWaiting')

    return {
        gifId,
        loop: options.loop ?? false,
        events: {
            onCanPlay,
            onEnded,
            onEndFullscreen,
            onError,
            onFirstPlay,
            onLoop,
            onMuted,
            onQuartile,
            onStateChange,
            onTimeUpdate,
            onUserMuted,
            onWaiting,
        },
    }
}

export function getVideoElement(gidId: string): Cypress.Chainable<JQuery<HTMLVideoElement>> {
    return cy.get(`[data-cy-root] .${Video.className}[data-giphy-id="${gidId}"]`)
}

export function checkVideoIsVisible(
    ctx: VideoTestUtilsContext,
    options: BaseAssertOptions = DEFAULT_BASE_ASSERT_OPTIONS
) {
    const { gifId } = ctx

    getVideoElement(gifId).should('be.visible')
    if (options.takeSnapshots) {
        getVideoElement(gifId).stopVideo()
        cy.percySnapshot(`${options.snapshotNamePrefix}: onVisible`)
    }
}

export function resetVideoEventsHistory(ctx: VideoTestUtilsContext) {
    Object.values(ctx.events).forEach((stub) => {
        cy.wrap(stub).then((s) => s.reset())
    })
}

export function checkVideoEvents(ctx: VideoTestUtilsContext) {
    const { gifId, loop, events } = ctx

    cy.wrap(events.onError).should('not.be.called')
    cy.wrap(events.onFirstPlay).should('be.called')
    cy.wrap(events.onCanPlay).should('be.called')

    cy.stopVideo()
    resetVideoEventsHistory(ctx)

    getVideoElement(gifId)
        .then(async (elems) => {
            const el = elems.get(0)
            await el.play()
            return new Promise((resolve) => {
                function listener() {
                    el.removeEventListener('ended', listener)
                    resolve(null)
                }
                el.addEventListener('ended', listener)
            })
        })
        .then(() => {
            expect(events.onCanPlay).be.calledOnce
            expect(events.onError).not.be.called
            expect(events.onFirstPlay).not.be.called
            expect(events.onEnded).be.calledOnce
            expect(events.onMuted).not.be.called
            expect(events.onQuartile).not.be.callCount(4)
            expect(events.onStateChange).be.calledTwice
            expect(events.onStateChange?.getCall(0)).be.calledWith('playing')
            expect(events.onStateChange?.getCall(1)).be.calledWith('paused')
            expect(events.onTimeUpdate).be.called
            expect(events.onWaiting).not.be.called

            if (loop) {
                expect(events.onLoop).be.calledOnce
            } else {
                expect(events.onLoop).not.be.called
            }
        })
}
