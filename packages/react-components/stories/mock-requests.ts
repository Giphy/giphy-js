import fetchMock from 'fetch-mock'
import mockChannelSearchResults from './mock-data/channels-search.json'
import mockGifs from './mock-data/gifs.json'
import mockTrendingSearches from './mock-data/trending-searches.json'

export const mockSearchBar = () => {
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
