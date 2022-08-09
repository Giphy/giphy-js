import styled from '@emotion/styled'
import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifHeight } from '@giphy/js-util'
import React, { ElementType, GetDerivedStateFromProps, PureComponent } from 'react'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import FetchError from './fetch-error'
import Gif, { EventProps } from './gif'
import DotsLoader from './loader'
import MasonryGrid from './masonry-grid'
import PingbackContextManager from './pingback-context-manager'
import type { GifOverlayProps } from './types'

type Props = {
    className?: string
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
    useTransform?: boolean
    columnOffsets?: number[]
    backgroundColor?: string
    borderRadius?: number
    tabIndex?: number
    loaderConfig?: IntersectionObserverInit
    loader?: ElementType
} & EventProps

const Loader = styled.div<{ isFirstLoad: boolean }>`
    opacity: ${(props) => (props.isFirstLoad ? 0 : 1)};
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
        { columns, gutter, width }: Props,
        prevState: State
    ) => {
        const gutterOffset = gutter * (columns - 1)
        const gifWidth = Math.floor((width - gutterOffset) / columns)
        if (prevState.gifWidth !== gifWidth) {
            return { gifWidth }
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

    fetchGifs = debounce(Grid.fetchDebounce, async (prefetchCount) => {
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
    })

    onFetch = async () => {
        if (this.unmounted) return
        const { isFetching, isLoaderVisible, gifs } = this.state
        if (!isFetching && isLoaderVisible) {
            this.setState({ isFetching: true, isError: false })
            this.fetchGifs(gifs.length)
        }
    }

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
            useTransform,
            columnOffsets,
            backgroundColor,
            loaderConfig,
            tabIndex = 0,
            layoutType = 'GRID',
            loader: LoaderVisual = DotsLoader,
        } = this.props
        const { gifWidth, gifs, isError, isDoneFetching } = this.state
        const showLoader = !isDoneFetching
        const isFirstLoad = gifs.length === 0
        // get the height of each grid item
        const itemHeights = gifs.map((gif) => getGifHeight(gif, gifWidth))
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
                            />
                        ))}
                    </MasonryGrid>
                    {!showLoader && gifs.length === 0 && noResultsMessage}
                    {isError ? (
                        <FetchError onClick={this.onFetch} />
                    ) : (
                        showLoader && (
                            <Observer onVisibleChange={this.onLoaderVisible} config={loaderConfig}>
                                <Loader isFirstLoad={isFirstLoad}>
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
