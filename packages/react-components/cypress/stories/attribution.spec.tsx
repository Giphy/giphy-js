import * as React from 'react'
import { SinonStub } from 'cypress/types/sinon'
import { composeStories } from '@storybook/testing-react'

import * as stories from '../../stories/attribution.stories'

const { Attribution } = composeStories(stories)

const GIF_ID = 'l0HlyLQsbvhciAuKA'

function getAttributionRoot() {
    return cy.get('[data-cy-root] .giphy-attribution')
}

function getAttributionGifs() {
    return cy.get(`[data-cy-root] [data-gph-gif="${GIF_ID}"]`)
}

function checkAttributionIsVisible() {
    getAttributionRoot().should('be.visible')
    getAttributionGifs().its('length').should('eq', 2)
    getAttributionGifs().should('be.visible')
}

describe('Attribution', () => {
    let onClick: SinonStub
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

    it('Custom OnClick Handler', () => {
        cy.mount(<Attribution onClick={onClick} />)
        checkAttributionIsVisible()
        cy.percySnapshot('Attribution / Custom OnClick Handler')
        getAttributionRoot()
            .click()
            .then(() => {
                expect(window.open).not.be.called
                expect(onClick).be.calledWithMatch({ id: GIF_ID })
            })
    })
})
