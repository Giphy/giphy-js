'use client'
import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifHeight } from '@giphy/js-util'
import React, { ElementType, GetDerivedStateFromProps, PureComponent } from 'react'
import styled from 'styled-components'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import FetchError from './fetch-error'
import Gif, { EventProps } from './gif'
import DotsLoader from './loader'
import PingbackContextManager from './pingback-context-manager'
import type { GifOverlayProps } from './types'

type Props = {
    className?: string
    percentWidth?: string
    width: number
    user: Partial<IUser>
    columns: number
    gutter: number
    layoutType?: 'GRID' | 'MIXED'
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
    onGifsFetchError?: (e: Error) => void
    overlay?: ElementType<GifOverlayProps>
    hideAttribution?: boolean
    noLink?: boolean
    noResultsMessage?: string | JSX.Element
    initialGifs?: IGif[]
    externalGifs?: IGif[]
    columnOffsets?: number[]
    backgroundColor?: string
    borderRadius?: number
    tabIndex?: number
    loaderConfig?: IntersectionObserverInit
    loader?: ElementType
    eagerIds?: IGif['id'][]
} & EventProps

const Loader = styled.div<{ $isFirstLoad: boolean }>`
    opacity: ${(props) => (props.$isFirstLoad ? 0 : 1)};
`

function fillArray<T>(length: number, defaultValue: T, initArray: T[] = []) {
    return Array.apply(null, Array(length)).map((_, index: number) => initArray[index] || defaultValue)
}

function getColumns(columns: number, columnOffsets: number[] | undefined, gifs: IGif[], gifWidth: number) {
    const sorter: IGif[][] = fillArray(columns, [])
    const columnHeights: number[] = fillArray(columns, 0, columnOffsets)
    gifs.forEach((gif) => {
        // get the shortest column
        const columnTarget = columnHeights.indexOf(Math.min(...columnHeights))
        // add gif to column
        sorter[columnTarget] = [...sorter[columnTarget], gif]
        // add gif height to column height total
        columnHeights[columnTarget] += getGifHeight(gif, gifWidth)
    })
    return sorter
}

const defaultProps = Object.freeze({ gutter: 6, user: {}, initialGifs: [] })

type State = {
    isFetching: boolean
    isError: boolean
    gifs: IGif[]
    isLoaderVisible: boolean
    isDoneFetching: boolean
}

const initialState = Object.freeze({
    isFetching: false,
    isError: false,
    gifs: [] as IGif[],
    isLoaderVisible: false,
    isDoneFetching: false,
})

class Grid extends PureComponent<Props, State> {
    static className = 'giphy-grid'
    static loaderClassName = 'loader'
    static fetchDebounce = 250
    static readonly defaultProps = defaultProps
    readonly state = { ...initialState, gifs: this.props.initialGifs || [] }
    bricks?: any
    el?: HTMLDivElement | null
    unmounted: boolean = false
    paginator = gifPaginator(this.props.fetchGifs, this.state.gifs)
    static getDerivedStateFromProps: GetDerivedStateFromProps<Props, State> = (
        { externalGifs }: Props,
        prevState: State
    ) => {
        if (externalGifs && externalGifs !== prevState.gifs) {
            return { gifs: externalGifs }
        }
        return null
    }

    componentDidMount() {
        this.unmounted = false
        this.onFetch()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    onLoaderVisible = (isVisible: boolean) => {
        if (this.unmounted) return
        this.setState({ isLoaderVisible: isVisible }, this.onFetch)
    }

    onFetch = debounce(Grid.fetchDebounce, async () => {
        if (this.unmounted) return
        const { isFetching, isLoaderVisible } = this.state
        const { externalGifs, fetchGifs } = this.props
        const prefetchCount = (externalGifs || this.state.gifs).length
        if (externalGifs) {
            // reinitialize the paginator every fetch with the new external gifs
            this.paginator = gifPaginator(fetchGifs, externalGifs)
        }
        if (!isFetching && isLoaderVisible) {
            this.setState({ isFetching: true, isError: false })
            let gifs
            try {
                gifs = await this.paginator()
                if (this.unmounted) return
            } catch (error) {
                if (this.unmounted) return
                this.setState({ isFetching: false, isError: true })
                const { onGifsFetchError } = this.props
                if (onGifsFetchError) onGifsFetchError(error as Error)
            }
            if (gifs) {
                // if we've just fetched and we don't have
                // any more gifs, we're done fetching
                if (prefetchCount === gifs.length) {
                    this.setState({ isDoneFetching: true })
                } else {
                    this.setState({ gifs, isFetching: false })
                    const { onGifsFetched } = this.props
                    if (onGifsFetched) onGifsFetched(gifs)
                    this.onFetch()
                }
            }
        }
    })

    render() {
        const {
            onGifVisible,
            onGifRightClick,
            className = Grid.className,
            onGifSeen,
            onGifClick,
            onGifKeyPress,
            user,
            overlay,
            hideAttribution,
            noLink,
            borderRadius,
            noResultsMessage,
            columns,
            width,
            gutter,
            percentWidth,
            columnOffsets,
            backgroundColor,
            loaderConfig,
            tabIndex = 0,
            layoutType = 'GRID',
            loader: LoaderVisual = DotsLoader,
            eagerIds,
        } = this.props
        const { gifs, isError, isDoneFetching } = this.state

        const showLoader = !isDoneFetching
        const isFirstLoad = gifs.length === 0

        const totalGutterPx = gutter * (columns - 1)

        // gif width to determine rendition and display size (when not percentage)
        const gifWidth = (width - totalGutterPx) / columns

        // put gifs into their columns
        const sortedIntoColumns = getColumns(columns, columnOffsets, gifs, gifWidth)
        return (
            <PingbackContextManager attributes={{ layout_type: layoutType }}>
                <div className={className}>
                    <div
                        style={{
                            width: percentWidth || width,
                            display: 'flex',
                            gap: gutter,
                        }}
                    >
                        {sortedIntoColumns.map((columnGifs = [], columnIndex) => (
                            <div
                                key={columnIndex}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: gutter,
                                    width: percentWidth ? `100%` : gifWidth,
                                    marginTop: columnOffsets?.[columnIndex],
                                }}
                            >
                                {columnGifs.map((gif) => (
                                    <Gif
                                        style={{
                                            aspectRatio: gif.images.original.width / gif.images.original.height,
                                        }}
                                        gif={gif}
                                        tabIndex={tabIndex}
                                        key={gif.id}
                                        width={gifWidth}
                                        percentWidth={percentWidth ? '100%' : undefined}
                                        onGifClick={onGifClick}
                                        onGifKeyPress={onGifKeyPress}
                                        onGifSeen={onGifSeen}
                                        onGifVisible={onGifVisible}
                                        onGifRightClick={onGifRightClick}
                                        user={user}
                                        overlay={overlay}
                                        backgroundColor={backgroundColor}
                                        hideAttribution={hideAttribution}
                                        noLink={noLink}
                                        borderRadius={borderRadius}
                                        lazyLoad={!eagerIds?.includes(gif.id)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    {!showLoader && gifs.length === 0 && noResultsMessage}
                    {isError ? (
                        <FetchError onClick={this.onFetch} />
                    ) : (
                        showLoader && (
                            <Observer onVisibleChange={this.onLoaderVisible} config={loaderConfig}>
                                <Loader $isFirstLoad={isFirstLoad}>
                                    <LoaderVisual className={Grid.loaderClassName} />
                                </Loader>
                            </Observer>
                        )
                    )}
                </div>
            </PingbackContextManager>
        )
    }
}

export default Grid
