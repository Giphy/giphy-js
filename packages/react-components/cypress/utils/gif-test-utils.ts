import type { IGif } from '@giphy/js-types'
import * as React from 'react'

import { Gif } from '../../src'
import { ComponentEventStubs } from './types'

export type GifEventStubs = ComponentEventStubs<typeof Gif>

export type GifTestUtilsContext = {
    gifId: string
    events: GifEventStubs
}

type BaseAssertOptions = {
    takeSnapshots?: boolean
    snapshotNamePrefix?: string
}

const DEFAULT_BASE_ASSERT_OPTIONS: BaseAssertOptions = {
    snapshotNamePrefix: 'Gif',
    takeSnapshots: false,
}

export function setupGifTestUtils(gifId: string): GifTestUtilsContext {
    const onGifSeen = cy
        .stub()
        .as('onGifSeen')
        .callsFake((gif: any) => console.log(gif.id))
    const onGifVisible = cy.stub().as('onGifVisible')
    const onGifKeyPress = cy.stub().as('onGifKeyPress')
    const onGifRightClick = cy.stub().as('onGifRightClick')
    const onGifClick = cy
        .stub()
        .as('onGifClick')
        .callsFake((_: IGif, e: React.MouseEvent) => e.preventDefault())

    return {
        gifId,
        events: {
            onGifSeen,
            onGifVisible,
            onGifKeyPress,
            onGifRightClick,
            onGifClick,
        },
    }
}

export function getGifRoot(gidId: string) {
    return cy.get(`[data-cy-root] .${Gif.className}[data-giphy-id="${gidId}"]`)
}

export function resetGifEventsHistory(ctx: GifTestUtilsContext) {
    Object.values(ctx.events).forEach((stub) => {
        cy.wrap(stub).then((s) => s.reset())
    })
}

export function checkGifIsVisible(ctx: GifTestUtilsContext, options: BaseAssertOptions = DEFAULT_BASE_ASSERT_OPTIONS) {
    const { gifId } = ctx
    const { onGifVisible } = ctx.events

    getGifRoot(gifId).get(`.${Gif.imgLoadedClassName}`).should('be.visible')
    cy.wrap(onGifVisible).and('be.calledWithMatch', { id: gifId })

    if (options.takeSnapshots) {
        cy.percySnapshot(`${options.snapshotNamePrefix}: onVisible`)
    }
}

export function checkGifSeen(ctx: GifTestUtilsContext, options: BaseAssertOptions = DEFAULT_BASE_ASSERT_OPTIONS) {
    const { gifId } = ctx
    const { onGifSeen } = ctx.events

    cy.wrap(onGifSeen).should('be.calledWithMatch', { id: gifId })
    if (options.takeSnapshots) {
        cy.percySnapshot(`${options.snapshotNamePrefix}: onVisible`)
    }
}

export function checkGifKeyboardEvents(
    ctx: GifTestUtilsContext,
    options: BaseAssertOptions = DEFAULT_BASE_ASSERT_OPTIONS
) {
    const { gifId } = ctx
    const { onGifKeyPress } = ctx.events

    getGifRoot(gifId)
        .focus()
        .type('g')
        .then(() => {
            expect(onGifKeyPress).be.calledOnce.and.calledWithMatch({ id: gifId }, { key: 'g' })
        })

    if (options.takeSnapshots) {
        cy.percySnapshot(`${options.snapshotNamePrefix}: onKeyPress`)
    }
}

export function checkGifMouseEvents(
    ctx: GifTestUtilsContext,
    options: BaseAssertOptions = DEFAULT_BASE_ASSERT_OPTIONS
) {
    const { gifId } = ctx
    const { onGifClick, onGifRightClick } = ctx.events

    getGifRoot(gifId)
        .click()
        .then(() => {
            expect(onGifClick).be.calledOnce.and.be.calledWithMatch({ id: gifId }, {})
        })
    if (options.takeSnapshots) {
        cy.percySnapshot(`${options.snapshotNamePrefix}: onClick`)
    }

    getGifRoot(gifId)
        .rightclick()
        .then(() => {
            expect(onGifRightClick).be.calledOnce.and.be.calledWithMatch({ id: gifId }, {})
        })
    if (options.takeSnapshots) {
        cy.percySnapshot(`${options.snapshotNamePrefix}: onRightClick`)
    }
}
