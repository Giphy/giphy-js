import { composeStories } from '@storybook/testing-react'
import fetchMock from 'fetch-mock'
import React, { useContext, useLayoutEffect } from 'react'
import { SearchBar, SearchContext, SearchContextManager, SuggestionBar } from '../../src'
import { data } from '../../stories/mock-data/trending-searches.json'
import * as stories from '../../stories/search-bar.stories'
import { storiesCompositionToList } from '../utils/storybook'
const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'

const composedStories = storiesCompositionToList(composeStories(stories))

describe('Search Bar', () => {
    composedStories.forEach((story) => {
        before(() => {})

        it(story.key, () => {
            cy.mount(<story.Component />)
            cy.percySnapshot(`Search Bar / ${story.key}`)
        })
    })

    describe.only('behavior', () => {
        const Test = () => {
            const { term, activeChannel } = useContext(SearchContext)
            expect(term).to.be.string
            return (
                <div className="cy-test">
                    <div>term:{term}</div>
                    <div>channel name:-{activeChannel?.display_name}-</div>
                </div>
            )
        }
        const Components = () => {
            useLayoutEffect(() => {
                stories.mock()
                return () => {
                    fetchMock.restore()
                }
            }, [])
            return (
                <>
                    <SearchBar />
                    <SuggestionBar />
                    <Test />
                </>
            )
        }

        const test = (delay: number) => {
            cy.mount(
                <SearchContextManager apiKey={apiKey}>
                    <Components />
                </SearchContextManager>
            )
            const channelTerm = 'embiid'
            const getInput = () => cy.get(`.${SearchBar.className} input`)
            cy.get(`.${SuggestionBar.className}`).contains(data[0])
            getInput().type('tacos')
            cy.get(`.cy-test`).contains('term:tacos')
            getInput().clear()
            getInput().type(`@nba ${channelTerm}`, { delay })
            cy.get(`.cy-test`).contains('channel name:-NBA-')

            cy.percySnapshot(`Search Bar channel`)
            Array.from(channelTerm).forEach(() => {
                getInput().focus().type(`{backspace}`, { delay })
            })
            // cleared channel
            getInput().focus().type(`{backspace}`, { delay })
            cy.get(`.cy-test`).contains('channel name:--')
            cy.get(`.${SuggestionBar.className}`).contains(data[0])
            getInput().type(`@nba ${channelTerm}`, { delay })
            cy.get(`.${SuggestionBar.className}`).contains(`@nbaontnt`).click()
            cy.get(`.cy-test`).contains('channel name:-NBA on TNT-')
        }

        it('search bar typing', () => {
            test(0)
            test(100)
        })
    })
})
