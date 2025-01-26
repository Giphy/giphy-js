'use client'
import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifHeight } from '@giphy/js-util'
import React, { ComponentProps, CSSProperties, ElementType, GetDerivedStateFromProps, PureComponent } from 'react'
import styled from 'styled-components'
import { debounce } from 'throttle-debounce'
import { fillArray } from '../util/array'
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
    useTransform?: boolean
    columnOffsets?: number[]
    backgroundColor?: string
    borderRadius?: number
    tabIndex?: number
    loaderConfig?: IntersectionObserverInit
    loader?: ElementType
    fetchPriority?: ComponentProps<typeof Gif>[`fetchPriority`]
} & EventProps

const Loader = styled.div<{ $isFirstLoad: boolean }>`
    opacity: ${(props) => (props.$isFirstLoad ? 0 : 1)};
`

const defaultProps = Object.freeze({ gutter: 6, user: {}, initialGifs: [] })

type State = {
    gifWidth: number
    isFetching: boolean
    isError: boolean
    gifs: IGif[]
    isLoaderVisible: boolean
    isDoneFetching: boolean
}

const initialState = Object.freeze({
    isFetching: false,
    isError: false,
    gifWidth: 0,
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
        { columns, gutter, width, externalGifs }: Props,
        prevState: State
    ) => {
        const gutterOffset = gutter * (columns - 1)
        const gifWidth = Math.floor((width - gutterOffset) / columns)
        if (prevState.gifWidth !== gifWidth) {
            return { gifWidth }
        }
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
            fetchPriority,
        } = this.props
        const { gifWidth, gifs, isError, isDoneFetching } = this.state
        const showLoader = !isDoneFetching
        const isFirstLoad = gifs.length === 0
        const gutterOffset = (gutter * (columns - 1)) / columns
        const gifPercentWidth = percentWidth ? `calc(${(gifWidth / width) * 100}% + ${gutterOffset}px)` : undefined

        // put gifs into their columns
        const sorter: [IGif[]][] = []
        const columnHeights: number[] = fillArray(columns, columnOffsets)
        gifs.forEach((gif) => {
            const columnTarget = columnHeights.indexOf(Math.min(...columnHeights))
            const height = getGifHeight(gif, gifWidth)
            const [existingGifs = []] = sorter[columnTarget] || []
            sorter[columnTarget] = [[...existingGifs, gif]]
            if (height) {
                columnHeights[columnTarget] += height
            }
        })
        // calculate the unscaled height to set the aspect ratio
        const containerStyle: CSSProperties = {
            width: percentWidth,
            display: 'flex',
            gap: gutter,
        }
        return (
            <PingbackContextManager attributes={{ layout_type: layoutType }}>
                <div className={className} style={{ width: percentWidth || width }}>
                    <div style={containerStyle}>
                        {(sorter || []).map(([_gifs], gifIndex) => {
                            return (
                                <div
                                    key={gifIndex}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: gutter,
                                        width: gifPercentWidth,
                                    }}
                                >
                                    {(_gifs || []).map((gif) => {
                                        const aspectRatio = gif.images.original.width / gif.images.original.height
                                        return (
                                            <Gif
                                                style={{
                                                    aspectRatio,
                                                }}
                                                gif={gif}
                                                tabIndex={tabIndex}
                                                key={gif.id}
                                                width={gifWidth}
                                                percentWidth={'100%'}
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
                                                fetchPriority={fetchPriority}
                                            />
                                        )
                                    })}
                                </div>
                            )
                        })}
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
