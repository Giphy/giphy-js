import styled from '@emotion/styled'
import { withKnobs } from '@storybook/addon-knobs'
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import fetchMock from 'fetch-mock'
import React, { useContext, useLayoutEffect } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import Grid_ from '../src/components/grid'
import SearchBarComponent_ from '../src/components/search-bar'
import SearchContextManager, { SearchContext } from '../src/components/search-bar/context'
import SuggestionBar from '../src/components/search-bar/suggestion-bar'
import inPercy from './in-percy'
import mockChannelSearchResults from './mock-data/channels-search.json'
import mockGifs from './mock-data/gifs.json'
import mockTrendingSearches from './mock-data/trending-searches.json'
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
    decorators: [withKnobs, jsxDecorator],
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
        if (inPercy()) {
            fetchMock.mock(`begin:https://api.giphy.com/v1/channels/search`, {
                body: mockChannelSearchResults,
            })
            fetchMock.mock(`begin:https://api.giphy.com/v1/trending/searches`, {
                body: mockTrendingSearches,
            })
            fetchMock.mock(`begin:https://api.giphy.com/v1/gifs/search`, {
                body: mockGifs,
            })
            fetchMock.mock(`begin:https://api.giphy.com/v1/stickers/search`, {
                body: mockGifs,
            })
            fetchMock.mock(`begin:https://api.giphy.com/v1/gifs/trending`, {
                body: mockGifs,
            })
            fetchMock.mock(`begin:https://api.giphy.com/v1/stickers/trending`, {
                body: mockGifs,
            })
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
                columns={inPercy() ? 2 : columns}
                width={inPercy() ? 500 : width}
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

export const SearchExperienceNoCancel = () => (
    <SearchContextManager apiKey={apiKey} theme={{ hideCancelButton: true }}>
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
    <SearchContextManager apiKey={apiKey} theme={{ condensedMode: true }}>
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
