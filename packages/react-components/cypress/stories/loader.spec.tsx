import * as React from 'react'
import { composeStories } from '@storybook/testing-react'

import * as stories from '../../stories/loader.stories'

const { DotsLoader } = composeStories(stories)

describe('Loader', () => {
    it('DotsLoader', () => {
        cy.mount(<DotsLoader className="cy-loader" />)
        cy.get('.cy-loader').should('be.visible')
        cy.percySnapshot('Loader / DotsLoader')
    })
})
