import { ThemeProvider } from '@emotion/react'
import { GifsResult, GiphyFetch, SearchOptions, serverUrl } from '@giphy/js-fetch-api'
import { IChannel } from '@giphy/js-types'
import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PingbackContextManager from '../pingback-context-manager'
import { initTheme, SearchTheme } from './theme'

function usePrevious<T>(value: T) {
    const ref = useRef<T>(value)
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

export type SearchContextProps = {
    setSearch: (searchTerm: string) => void
    term: string
    channelSearch: string
    activeChannel: IChannel | undefined
    currentChannels: IChannel[]
    setActiveChannel: (channel: IChannel | undefined) => void
    fetchGifs: (offset: number) => Promise<GifsResult>
    fetchAnimatedText: (offset: number) => Promise<GifsResult>
    fetchChannelSearch: (offset: number) => Promise<IChannel[]>
    isFetching: boolean
    trendingSearches: string[]
    searchKey: string
    isFocused: boolean
}
export type _SearchContextProps = {
    setIsFocused: (focused: boolean) => void
    _setSearch: (searchTerm: string) => void
    _inputValOverride: string
}

export const SearchContext = createContext({} as SearchContextProps)
// for internal components
export const _SearchContext = createContext({} as _SearchContextProps)

type Props = {
    children: ReactNode
    options?: SearchOptions
    apiKey: string
    theme?: Partial<SearchTheme>
    initialTerm?: string
    initialChannel?: IChannel
    shouldDefaultToTrending?: boolean
}

const emptyChannels: IChannel[] = []
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

    const [currentChannels, setChannels] = useState<IChannel[]>([])

    // the input value
    const [term, _setSearch] = useState<string>(initialTerm)
    // will replace the current input value with this value
    // until the user types again.
    // there needs to be a second state otherwise
    // with the input value being debounced, there seems to be a race condition that
    // manifests in Cypress tests
    const [_inputValOverride, setSearch] = useState<string>(initialTerm)
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
        _setSearch('')
    }, [])

    // fetched list of trending search terms
    const [trendingSearches, setTrendingSearches] = useState<string[]>([])

    const [isFocused, setIsFocused] = useState(false)

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
    const lastChannelSearch = usePrevious(term)
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

    useEffect(() => {
        const fetchChannels = async () => {
            const channels = await fetchChannelSearch(0)
            setChannels(channels || emptyChannels)
            const foundChannel = currentChannels.find(({ slug }) => channelSearch === slug)
            if (foundChannel) {
                setActiveChannel(foundChannel)
            }
        }
        if (!activeChannel && channelSearch !== lastChannelSearch && term.indexOf(`@${channelSearch} `) === 0) {
            fetchChannels()
        }
        if (!channelSearch && !activeChannel) {
            // revert to trending...
            setChannels(emptyChannels)
        }
    }, [channelSearch, activeChannel, fetchChannelSearch, currentChannels, setActiveChannel, term, lastChannelSearch])

    return (
        <SearchContext.Provider
            value={{
                activeChannel,
                currentChannels,
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
                isFocused,
            }}
        >
            <_SearchContext.Provider value={{ setIsFocused, _setSearch, _inputValOverride }}>
                <ThemeProvider theme={initTheme(theme)}>
                    <PingbackContextManager attributes={{ layout_type: 'SEARCH' }}>{children}</PingbackContextManager>
                </ThemeProvider>
            </_SearchContext.Provider>
        </SearchContext.Provider>
    )
}

export default SearchContextManager
