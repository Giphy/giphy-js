import React, { useEffect, useCallback, useRef, useMemo, useReducer } from 'react'
import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifHeight } from '@giphy/js-util'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import FetchError from './fetch-error'
import Gif, { EventProps } from './gif'
import DotsLoader from './loader'
import MasonryGrid from './masonry-grid'
import PingbackContextManager from './pingback-context-manager'
import type { GifOverlayProps } from './types'

export const DEFAULT_GRID_CLASS_NAME = 'giphy-grid'

type Props = {
    className?: string
    width: number
    user?: Partial<IUser>
    columns: number
    gutter?: number
    layoutType?: 'GRID' | 'MIXED'
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
    onGifsFetchError?: (e: Error) => void
    overlay?: React.ElementType<GifOverlayProps>
    hideAttribution?: boolean
    noLink?: boolean
    noResultsMessage?: string | JSX.Element
    initialGifs?: IGif[]
    useTransform?: boolean
    columnOffsets?: number[]
    backgroundColor?: string
    borderRadius?: number
    tabIndex?: number
    loaderConfig?: IntersectionObserverInit
    loader?: React.ElementType
} & EventProps

const FETCH_DEBOUNCE = 250

type State = {
    gifWidth: number
    isFetching: boolean
    isError: boolean
    gifs: IGif[]
    isLoaderVisible: boolean
    isDoneFetching: boolean
}

type Action =
    | { type: 'START_FETCH' }
    | { type: 'FETCH_SUCCESS'; gifs: IGif[] }
    | { type: 'FETCH_FAILURE'; error: Error }
    | { type: 'LOADER_VISIBLE'; isVisible: boolean }
    | { type: 'DONE_FETCHING' }

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'START_FETCH':
            return { ...state, isFetching: true, isError: false }
        case 'FETCH_SUCCESS':
            return { ...state, gifs: action.gifs, isFetching: false }
        case 'FETCH_FAILURE':
            return { ...state, isFetching: false, isError: true }
        case 'LOADER_VISIBLE':
            return { ...state, isLoaderVisible: action.isVisible }
        case 'DONE_FETCHING':
            return { ...state, isDoneFetching: true }
        default:
            return state
    }
}

const initialState: State = {
    gifWidth: 0,
    isFetching: false,
    isError: false,
    gifs: [],
    isLoaderVisible: false,
    isDoneFetching: false,
}

const Grid = ({
    className = DEFAULT_GRID_CLASS_NAME,
    width,
    user = {},
    columns,
    gutter = 6,
    layoutType = 'GRID',
    fetchGifs,
    onGifsFetched,
    onGifsFetchError,
    overlay,
    hideAttribution,
    noLink,
    noResultsMessage,
    initialGifs = [],
    useTransform,
    columnOffsets,
    backgroundColor,
    borderRadius,
    tabIndex = 0,
    loaderConfig,
    loader: LoaderVisual = DotsLoader,
    ...gifEvents
}: Props) => {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        gifs: initialGifs,
    })
    const gifWidth = useMemo(() => {
        const gutterOffset = gutter * (columns - 1)
        return Math.floor((width - gutterOffset) / columns)
    }, [width, gutter, columns])
    const paginator = useRef(gifPaginator(fetchGifs, initialGifs))
    const unmounted = useRef(false)

    const handleFetchGifs = useCallback(
        (prefetchCount: number) => {
            const debounceFetchGifs = debounce(FETCH_DEBOUNCE, async (prefetchCount: number) => {
                let gifs
                try {
                    gifs = await paginator.current()
                    if (unmounted.current) return
                } catch (e) {
                    const error = e as Error
                    if (unmounted.current) return
                    dispatch({ type: 'FETCH_FAILURE', error })
                    if (onGifsFetchError) onGifsFetchError(error)
                    return
                }

                if (gifs) {
                    if (prefetchCount === gifs.length) {
                        dispatch({ type: 'DONE_FETCHING' })
                    } else {
                        dispatch({ type: 'FETCH_SUCCESS', gifs })
                        if (onGifsFetched) onGifsFetched(gifs)
                    }
                }
            })

            if (unmounted.current) return

            debounceFetchGifs(prefetchCount)
        },
        [onGifsFetched, onGifsFetchError]
    )

    const onLoaderVisible = useCallback(
        (isVisible: boolean) => {
            if (unmounted.current) return
            dispatch({ type: 'LOADER_VISIBLE', isVisible })
            if (!state.isFetching && isVisible) {
                dispatch({ type: 'START_FETCH' })
                handleFetchGifs(state.gifs.length)
            }
        },
        [state.gifs.length, state.isFetching, handleFetchGifs]
    )

    useEffect(() => {
        unmounted.current = false
        if (unmounted.current === false) {
            handleFetchGifs(initialGifs.length)
        }

        return () => {
            unmounted.current = true
        }
    }, [handleFetchGifs])

    const { gifs, isDoneFetching, isError } = state
    const itemHeights = useMemo(() => gifs.map((gif) => getGifHeight(gif, gifWidth)), [gifs, gifWidth])
    const isFirstLoad = gifs.length === 0
    const showLoader = !isDoneFetching

    return (
        <PingbackContextManager attributes={{ layout_type: layoutType }}>
            <div className={className} style={{ width }}>
                <MasonryGrid
                    itemHeights={itemHeights}
                    useTransform={useTransform}
                    itemWidth={gifWidth}
                    columns={columns}
                    gutter={gutter}
                    columnOffsets={columnOffsets}
                >
                    {gifs.map((gif) => (
                        <Gif
                            gif={gif}
                            tabIndex={tabIndex}
                            key={gif.id}
                            width={gifWidth}
                            user={user}
                            overlay={overlay}
                            backgroundColor={backgroundColor}
                            hideAttribution={hideAttribution}
                            noLink={noLink}
                            borderRadius={borderRadius}
                            {...gifEvents}
                        />
                    ))}
                </MasonryGrid>
                {!showLoader && gifs.length === 0 && noResultsMessage}
                {isError ? (
                    <FetchError onClick={() => handleFetchGifs(state.gifs.length)} />
                ) : (
                    showLoader &&
                    !isFirstLoad && (
                        <Observer onVisibleChange={onLoaderVisible} config={loaderConfig}>
                            <LoaderVisual />
                        </Observer>
                    )
                )}
            </div>
        </PingbackContextManager>
    )
}

export default Grid
