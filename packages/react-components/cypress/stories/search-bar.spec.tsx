import fetchMock from 'fetch-mock'
import React, { useContext, useLayoutEffect } from 'react'
import { SearchBar, SearchContext, SearchContextManager, SuggestionBar } from '../../src'
import CancelIcon from '../../src/components/search-bar/cancel-icon'
import { data } from '../../stories/mock-data/trending-searches.json'
import { mockSearchBar } from '../../stories/mock-requests'
const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'

describe('Search Bar', () => {
    describe('input and channel behavior', () => {
        const Test = () => {
            const { term, activeChannel } = useContext(SearchContext)
            expect(term).to.be.string
            return (
                <div className="cy-test">
                    <div>term:-{term}-</div>
                    <div>channel name:-{activeChannel?.display_name}-</div>
                </div>
            )
        }

        const test = (delay: number, searchDebounce?: number) => {
            const Components = () => {
                useLayoutEffect(() => {
                    mockSearchBar()
                    return () => {
                        fetchMock.restore()
                    }
                }, [])
                return (
                    <>
                        <SearchBar searchDebounce={searchDebounce} />
                        <SuggestionBar />
                        <Test />
                    </>
                )
            }
            cy.mount(
                <SearchContextManager apiKey={apiKey}>
                    <Components />
                </SearchContextManager>
            )
            const channelTerm = 'embiid'
            const getInput = () => cy.get(`.${SearchBar.className} input`)
            cy.get(`.${SuggestionBar.className}`).contains(data[0])
            getInput().type('tacos')
            cy.get(`.cy-test`).contains('term:-tacos-')
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
            cy.get(`.${SuggestionBar.className}`)
                .contains(`@nbaontnt`)
                // avoid a race condition where the search bar state is still updating to @nba
                .wait(100)
                .click()
            cy.get(`.cy-test`).contains('channel name:-NBA on TNT-')
            cy.get(`.${CancelIcon.className}`).click()
            cy.get(`.cy-test`).contains('term:--')
            cy.get(`.cy-test`).contains('channel name:--')

            cy.get(`.${SuggestionBar.className}`)
                .contains(`@nbaontnt`)
                // avoid a race condition where the search bar state is still updating to @nba
                .wait(100)
                .click()
            cy.get(`.${SuggestionBar.className}`)
                .contains(`@nba`)
                // avoid a race condition where the search bar state is still updating to @nba
                .wait(100)
                .click()
            getInput().type(`{backspace}`, { delay })
            cy.get(`.cy-test`).contains('term:--')
            cy.get(`.cy-test`).contains('channel name:--')
            getInput().type(`@sports`, { delay })
            cy.get(`.${SuggestionBar.className}`)
                .contains(`@nba`)
                // avoid a race condition where the search bar state is still updating to @nba
                .wait(100)
                .click()
            cy.get(`.cy-test`).contains('term:--')
            cy.get(`.cy-test`).contains('channel name:-NBA-')
            cy.get(`.${CancelIcon.className}`).click()
            getInput().type(`nba`, { delay })
            cy.get(`.${SuggestionBar.className}`).contains(`@nba`).click()
        }

        it('search bar typing fast / default debounce', () => {
            test(0)
        })
        it('search bar typing fast / no debounce', () => {
            test(0, 0)
        })
        it('search bar typing slow default debounce', () => {
            test(250)
        })
    })
})
