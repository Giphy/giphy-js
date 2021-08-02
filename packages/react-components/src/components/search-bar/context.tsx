import { GifsResult, GiphyFetch, SearchOptions, serverUrl } from '@giphy/js-fetch-api'
import { IChannel } from '@giphy/js-types'
import { ThemeProvider } from 'emotion-theming'
import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import PingbackContextManager from '../pingback-context-manager'
import { initTheme, SearchTheme } from './theme'

export type SearchContextProps = {
    setSearch: (searchTerm: string) => void
    term: string
    channelSearch: string
    activeChannel: IChannel | undefined
    setActiveChannel: (channel: IChannel | undefined) => void
    fetchGifs: (offset: number) => Promise<GifsResult>
    fetchAnimatedText: (offset: number) => Promise<GifsResult>
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
    shouldDefaultToTrending?: boolean
}

const emptyGifsResult = {
    data: [],
    pagination: { total_count: 0, count: 0, offset: 0 },
    meta: { status: 200, msg: 'OK', response_id: '' },
}
const SearchContextManager = ({
    children,
    options = {},
    apiKey,
    theme,
    initialTerm = '',
    initialChannel,
    shouldDefaultToTrending = true,
}: Props) => {
    const gf = useMemo(() => new GiphyFetch(apiKey), [apiKey])

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

    const setActiveChannel = useCallback((activeChannel: IChannel | undefined) => {
        _setActiveChannel(activeChannel)
        setTerm('') // TODO: clear this here?
    }, [])

    // fetched list of trending search terms
    const [trendingSearches, setTrendingSearches] = useState<string[]>([])
    // do a search for a term and optionally a channel
    const setSearch = useCallback((term: string) => setTerm(term), [])

    const searchKey = [term, options.type, channelSearch, activeChannel?.user?.username || '']
        .filter((val) => !!val)
        .join(' / ')

    // search fetch
    const fetchGifs = useCallback(
        async (offset: number) => {
            setIsFetching(true)
            let result: GifsResult = emptyGifsResult
            if (term) {
                result = await gf.search(term, {
                    ...options,
                    offset,
                    channel: activeChannel?.user?.username,
                })
            } else if (shouldDefaultToTrending) {
                result = await gf.trending({ ...options, offset })
            }
            setIsFetching(false)
            return result
        },
        [activeChannel?.user?.username, gf, options, term, shouldDefaultToTrending]
    )

    const fetchAnimatedText = useCallback(
        async (offset: number) => {
            const limit = options.limit || 50
            const result = await gf.animate(term, { offset, limit })
            if (!result.pagination) {
                result.pagination = { count: limit, total_count: limit, offset }
            }
            return result
        },
        [gf, options.limit, term]
    )

    const fetchChannelSearch = useCallback(
        async (offset: number) => {
            const result = await fetch(
                `${serverUrl}channels/search?q=${encodeURIComponent(channelSearch)}&offset=${offset}&api_key=${apiKey}`
            )
            const { data } = await result.json()
            return data as IChannel[]
        },
        [apiKey, channelSearch]
    )
    useEffect(() => {
        const fetchTrendingSearches = async () => {
            const result = await fetch(`${serverUrl}trending/searches?api_key=${apiKey}`)
            const { data } = await result.json()
            setTrendingSearches(data || [])
        }
        fetchTrendingSearches()
    }, [apiKey])
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
                fetchAnimatedText,
                searchKey,
                isFetching,
            }}
        >
            <ThemeProvider theme={initTheme(theme)}>
                <PingbackContextManager attributes={{ layout_type: 'SEARCH' }}>{children}</PingbackContextManager>
            </ThemeProvider>
        </SearchContext.Provider>
    )
}

export default SearchContextManager
