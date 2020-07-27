import isPercy from '@percy-io/in-percy'
import { withKnobs } from '@storybook/addon-knobs'
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import { css } from 'emotion'
import fetchMock from 'fetch-mock'
import React, { useContext } from 'react'
import { jsxDecorator } from 'storybook-addon-jsx'
import Grid from '../src/components/grid'
import SearchBarComponent from '../src/components/search-bar'
import SearchContextManager, { SearchContext } from '../src/components/search-bar/context'
import SuggestionBar from '../src/components/search-bar/suggestion-bar'
import mockChannelSearchResults from './mock-data/channels-search.json'
import mockGifs from './mock-data/gifs.json'
import mockTrendingSearches from './mock-data/trending-searches.json'
import useWindowSize from './use-window-size'
const apiKey = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh'

if (isPercy()) {
    fetchMock.mock(`begin:https://api.giphy.com/v1/channels/search?q=`, {
        body: mockChannelSearchResults,
    })
    fetchMock.mock(`begin:https://api.giphy.com/v1/trending/searches`, {
        body: mockTrendingSearches,
    })
    fetchMock.mock(`begin:https://api.giphy.com/v1/gifs/search`, {
        body: mockGifs,
    })
}

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
    const { fetchGifs, term, channelSearch, activeChannel } = useContext(SearchContext)
    const { innerWidth } = useWindowSize()
    return (
        <>
            <SearchBarComponent
                className={css`
                    margin-bottom: 10px;
                `}
            />
            <SuggestionBar />
            <Grid
                key={`${channelSearch} ${term} ${activeChannel?.user.username}`}
                className={css`
                    margin-top: 20px;
                `}
                columns={innerWidth < 400 ? 2 : 4}
                width={innerWidth - 16 * 2}
                fetchGifs={fetchGifs}
            />
        </>
    )
}

export const SearchExperience = () => {
    return (
        <SearchContextManager apiKey={apiKey}>
            <Components />
        </SearchContextManager>
    )
}
