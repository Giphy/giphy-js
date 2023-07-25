import styled from '@emotion/styled'
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import fetchMock from 'fetch-mock'
import React, { useContext, useLayoutEffect } from 'react'
import Grid_ from '../src/components/grid'
import SearchBarComponent_ from '../src/components/search-bar'
import SearchContextManager, { SearchContext } from '../src/components/search-bar/context'
import SuggestionBar from '../src/components/search-bar/suggestion-bar'
import inTestsRunner from './in-tests-runner'
import { mockSearchBar } from './mock-requests'
import useWindowSize from './use-window-size'
const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'

const Grid = styled(Grid_)`
    margin-top: 20px;
`

const SearchBarComponent = styled(SearchBarComponent_)`
    margin-bottom: 10px;
`

export default {
    title: 'React Components/Search Experience',
    parameters: {
        viewport: {
            viewports: MINIMAL_VIEWPORTS,
        },
    },
}

const Components = () => {
    const { fetchGifs, searchKey } = useContext(SearchContext)
    const { innerWidth } = useWindowSize()
    const columns = innerWidth < 400 ? 2 : 4
    const width = innerWidth - 16 * 2
    useLayoutEffect(() => {
        if (inTestsRunner()) {
            mockSearchBar()
        }
        return () => {
            fetchMock.restore()
        }
    }, [])
    return (
        <>
            <SearchBarComponent />
            <SuggestionBar />
            <Grid
                key={searchKey}
                columns={inTestsRunner() ? 2 : columns}
                width={inTestsRunner() ? 500 : width}
                fetchGifs={fetchGifs}
            />
        </>
    )
}

export const SearchExperience = () => (
    <SearchContextManager apiKey={apiKey}>
        <Components />
    </SearchContextManager>
)

export const SearchExperienceDarkMode = () => (
    <SearchContextManager apiKey={apiKey} theme={{ darkMode: true }}>
        <Components />
    </SearchContextManager>
)

export const SearchExperienceStickersDefault = () => (
    <SearchContextManager apiKey={apiKey} options={{ type: 'stickers' }}>
        <Components />
    </SearchContextManager>
)

export const SearchExperienceNoDefault = () => (
    <SearchContextManager apiKey={apiKey} shouldDefaultToTrending={false}>
        <Components />
    </SearchContextManager>
)

export const SearchExperienceCondensed = () => (
    <SearchContextManager apiKey={apiKey} theme={{ searchbarHeight: 44 }}>
        <Components />
    </SearchContextManager>
)

export const SearchExperienceHideCancelButton = () => (
    <SearchContextManager apiKey={apiKey} theme={{ hideCancelButton: true }}>
        <Components />
    </SearchContextManager>
)

export const SearchExperienceInitialTerm = () => {
    return (
        <SearchContextManager apiKey={apiKey} initialTerm="skateboard">
            <Components />
        </SearchContextManager>
    )
}

export const SearchExperienceInitialChannelSearch = () => {
    return (
        <SearchContextManager apiKey={apiKey} initialTerm="@nba">
            <Components />
        </SearchContextManager>
    )
}
