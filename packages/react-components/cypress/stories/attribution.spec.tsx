import { composeStories } from '@storybook/react'
import * as React from 'react'
import { Attribution } from '../../src'
import * as stories from '../../stories/attribution.stories'

const { Default } = composeStories(stories)

describe('Attribution', () => {
    let onClick: typeof Cypress.sinon.stub
    beforeEach(() => {
        cy.stub(window, 'open')
        onClick = cy.stub().as('onClick')
    })

    it('Default', () => {
        cy.mount(<Default />)
        cy.get(`.${Attribution.className}`).should('be.visible')
        cy.get(`.${Attribution.className}`)
            .click()
            .then(() => {
                expect(window.open).be.calledWithMatch('https://giphy.com/haydiroket/', '_blank')
                expect(onClick).be.not.be.called
            })
    })
})
