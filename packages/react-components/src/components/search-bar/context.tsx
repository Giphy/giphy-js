import { ThemeProvider } from '@emotion/react'
import { GifsResult, GiphyFetch, request, Result, SearchOptions } from '@giphy/js-fetch-api'
import { IChannel } from '@giphy/js-types'
import { Logger } from '@giphy/js-util'
import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import PingbackContextManager from '../pingback-context-manager'
import { initTheme, SearchTheme } from './theme'

export type SearchContextProps = {
    setSearch: (searchTerm: string) => void
    term: string
    activeChannel: IChannel | undefined
    setChannels: (channels: IChannel[]) => void
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
    shouldFetchChannels?: boolean
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
    shouldFetchChannels = true,
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

    // active channel we're searching and displaying in the search bar
    const [activeChannel, _setActiveChannel] = useState<IChannel | undefined>(initialChannel)

    const setActiveChannel = useCallback((activeChannel: IChannel | undefined) => {
        _setSearch('')
        _setActiveChannel(activeChannel)
    }, [])

    // fetched list of trending search terms
    const [trendingSearches, setTrendingSearches] = useState<string[]>([])

    const [isFocused, setIsFocused] = useState(false)

    const searchKey = [term, options.type, activeChannel?.user?.username || ''].filter((val) => !!val).join(' / ')

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
            const search = term.indexOf('@') === 0 ? term.split(' ')[0] : term
            const result = await gf.channels(search, { offset })
            return result.data
        },
        [gf, term]
    )
    useEffect(() => {
        const fetchTrendingSearches = async () => {
            let searches: string[] = []
            try {
                const { data = [] } = (await request(`trending/searches?api_key=${apiKey}`)) as Result & {
                    data: string[]
                }
                searches = data
            } catch (error) {
                Logger.warn(`Trending searches request failed: ${error}`)
            }
            setTrendingSearches(searches)
        }
        fetchTrendingSearches()
    }, [apiKey])

    // set active channel based on search
    useEffect(() => {
        const foundChannel = currentChannels.find(({ slug }) => term.indexOf(`@${slug} `) === 0)
        if (foundChannel) {
            _setActiveChannel(foundChannel)
        }
    }, [term, currentChannels, _setActiveChannel])

    // fetch when term changes
    useEffect(() => {
        if (shouldFetchChannels) {
            const fetchChannels = async () => {
                const channels = await fetchChannelSearch(0)
                setChannels(channels || emptyChannels)
            }
            if (!activeChannel && term.replace('@', '')) {
                fetchChannels()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [term, activeChannel])

    return (
        <SearchContext.Provider
            value={{
                activeChannel,
                setChannels,
                currentChannels,
                setActiveChannel,
                fetchChannelSearch,
                term,
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
