import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api'
import { IChannel } from '@giphy/js-types'
import { ThemeProvider } from 'emotion-theming'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { initTheme, SearchTheme } from './theme'

export type SearchContextProps = {
    setSearch: (searchTerm: string) => void
    term: string
    channelSearch: string
    activeChannel: IChannel | undefined
    setActiveChannel: (channel: IChannel | undefined) => void
    fetchGifs: (offset: number) => Promise<GifsResult>
    fetchChannelSearch: (offset: number) => Promise<IChannel[]>
    isFetching: boolean
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
    initialChannel?: IChannel
}

const SearchContextManager = ({ children, options = {}, apiKey, theme, initialTerm = '', initialChannel }: Props) => {
    const gf = new GiphyFetch(apiKey)

    // the search term
    const [term, setTerm] = useState<string>(initialTerm)

    const [isFetching, setIsFetching] = useState(false)

    // a user name search
    let channelSearch = ''

    if (term && term.indexOf('@') === 0) {
        channelSearch = term.slice(1).split(' ')[0]
    }

    // active channel we're searching and displaying in the search bar
    const [activeChannel, _setActiveChannel] = useState<IChannel | undefined>(initialChannel)

    const setActiveChannel = (activeChannel: IChannel | undefined) => {
        _setActiveChannel(activeChannel)
        setTerm('') // clear this here
    }

    // fetched list of trending search terms
    const [trendingSearches, setTrendingSearches] = useState<string[]>([])
    // do a search for a term and optionally a channel
    const setSearch = (term: string) => setTerm(term)

    const searchKey = [term, options.type, channelSearch, activeChannel?.user.username || '']
        .filter((val) => !!val)
        .join(' / ')

    // search fetch
    const fetchGifs = async (offset: number) => {
        setIsFetching(true)
        const result = await gf.search(term, { ...options, offset, channel: activeChannel?.user.username })
        setIsFetching(false)
        return result
    }
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
                isFetching,
            }}
        >
            <ThemeProvider theme={initTheme(theme)}>{children}</ThemeProvider>
        </SearchContext.Provider>
    )
}

export default SearchContextManager
