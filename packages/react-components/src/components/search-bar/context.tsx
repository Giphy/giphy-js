import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api'
import { IChannel } from '@giphy/js-types'
import { ThemeProvider } from 'emotion-theming'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { initTheme, SearchTheme } from './theme'

type SearchContextProps = {
    setSearch: (searchTerm: string, channel: string) => void
    term: string
    channelSearch: string
    activeChannel: IChannel | undefined
    setActiveChannel: (channel: IChannel | undefined) => void
    fetchGifs: (offset: number) => Promise<GifsResult>
    fetchChannelSearch: (offset: number) => Promise<IChannel[]>
    trendingSearches: string[]
    searchKey: string
}

export const SearchContext = createContext({} as SearchContextProps)

type Props = {
    children: ReactNode
    options?: SearchOptions
    apiKey: string
    theme?: Partial<SearchTheme>
    initialTerm?: string
}

const SearchContextManager = ({ children, options = {}, apiKey, theme, initialTerm = '' }: Props) => {
    const gf = new GiphyFetch(apiKey)
    //
    const [[term, channelSearch], setOptions] = useState<[string, string]>([initialTerm, ''])
    // active channel we're searching and displaying in the search bar
    const [activeChannel, _setActiveChannel] = useState<IChannel | undefined>()

    const setActiveChannel = (activeChannel: IChannel | undefined) => {
        _setActiveChannel(activeChannel)
        setOptions(['', '']) // clear this here
    }

    // fetched list of trending search terms
    const [trendingSearches, setTrendingSearches] = useState<string[]>([])
    // do a search for a term and optionally a channel
    const setSearch = (term: string, channel: string) => setOptions([term, channel])

    const searchKey = `${term} - ${options.type} ${activeChannel?.user.username || ''}: ${channelSearch}`

    // search fetch
    const fetchGifs = (offset: number) => gf.search(term, { ...options, offset, channel: activeChannel?.user.username })
    const fetchChannelSearch = async (offset: number) => {
        const result = await fetch(
            `https://api.giphy.com/v1/channels/search?q=${channelSearch}&offset=${offset}&api_key=${apiKey}`
        )
        const { data } = await result.json()
        return data as IChannel[]
    }
    useEffect(() => {
        const fetchTrendingSearches = async () => {
            const result = await fetch(`https://api.giphy.com/v1/trending/searches?api_key=${apiKey}`)
            const { data } = await result.json()
            setTrendingSearches(data || [])
        }
        fetchTrendingSearches()
    }, [])
    return (
        <SearchContext.Provider
            value={{
                activeChannel,
                setActiveChannel,
                fetchChannelSearch,
                term,
                channelSearch,
                trendingSearches,
                setSearch,
                fetchGifs,
                searchKey,
            }}
        >
            <ThemeProvider theme={initTheme(theme)}>{children}</ThemeProvider>
        </SearchContext.Provider>
    )
}

export default SearchContextManager
