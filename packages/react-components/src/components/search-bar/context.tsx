import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api'
import { IChannel } from '@giphy/js-types'
import React, { createContext, ReactNode, useEffect, useState } from 'react'

type SearchTheme = { searchbarHeight: number }
type SearchContextProps = {
    setSearch: (searchTerm: string, channel: string) => void
    term: string
    channelSearch: string
    activeChannel: IChannel | undefined
    setActiveChannel: (channel: IChannel | undefined) => void
    fetchGifs: (offset: number) => Promise<GifsResult>
    fetchChannelSearch: (offset: number) => Promise<IChannel[]>
    trendingSearches: string[]
    theme: SearchTheme
}

export const SearchContext = createContext({} as SearchContextProps)

type Props = { children: ReactNode; options?: SearchOptions; apiKey: string }

const SearchContextManager = ({ children, options = {}, apiKey }: Props) => {
    const gf = new GiphyFetch(apiKey)
    //
    const [[term, channelSearch], setOptions] = useState<[string, string]>(['', ''])
    // active channel we're searching and displaying in the search bar
    const [activeChannel, setActiveChannel] = useState<IChannel | undefined>()
    // fetched list of trending search terms
    const [trendingSearches, setTrendingSearches] = useState<string[]>([])
    // do a search for a term and optionally a channel
    const setSearch = (term: string, channel: string) => setOptions([term, channel])
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
                theme: { searchbarHeight: 42 },
            }}
        >
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContextManager
