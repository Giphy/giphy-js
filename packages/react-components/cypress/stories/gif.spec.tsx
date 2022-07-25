import * as React from 'react'
import { composeStories } from '@storybook/testing-react'
import { mount } from '@cypress/react'

import * as stories from '../../stories/gif.stories'

const { Gif } = composeStories(stories)

describe('Gif Stories', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://api.giphy.com/v1/gifs/*').as('gif-by-id')
    })

    describe('Default Gif', () => {
        it('Should render a specified gif', () => {
            mount(<Gif />)

            cy.wait('@gif-by-id')
            cy.get('img.giphy-img-loaded').should('be.visible')

            // IMG is loaded, so Percy can take the correct snapshot
            cy.percySnapshot('Default Gif')
        })
    })
})
