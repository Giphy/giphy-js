import { composeStories } from '@storybook/react'
import * as React from 'react'

import { Gif } from '../../src'
import * as stories from '../../stories/attribution.stories'

const { Attribution } = composeStories(stories)

const GIF_ID = 'l0HlyLQsbvhciAuKA'

function getAttributionRoot() {
    return cy.get('[data-cy-root] .giphy-attribution')
}

function getAttributionGifs() {
    return cy.get(`[data-cy-root] .${Gif.className}[data-giphy-id="${GIF_ID}"]`)
}

function checkAttributionIsVisible() {
    getAttributionRoot().should('be.visible')
    getAttributionGifs().its('length').should('eq', 2)
    getAttributionGifs().should('be.visible')
}

describe('Attribution', () => {
    let onClick: typeof Cypress.sinon.stub
    beforeEach(() => {
        cy.stub(window, 'open')
        onClick = cy.stub().as('onClick')
    })

    it('Default', () => {
        cy.mount(<Attribution />)
        checkAttributionIsVisible()
        cy.percySnapshot('Attribution / Default')
        getAttributionRoot()
            .click()
            .then(() => {
                expect(window.open).be.calledWithMatch('https://giphy.com/haydiroket/', '_blank')
                expect(onClick).be.not.be.called
            })
    })

    it.skip('Custom OnClick Handler', () => {
        // TODO: need to rewrite attribution story
        // cy.mount(<Attribution onClick={onClick} />)
        // checkAttributionIsVisible()
        // cy.percySnapshot('Attribution / Custom OnClick Handler')
        // getAttributionRoot()
        //     .click()
        //     .then(() => {
        //         expect(window.open).not.be.called
        //         expect(onClick).be.calledWithMatch({ id: GIF_ID })
        //     })
    })
})
