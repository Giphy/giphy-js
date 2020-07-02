import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifHeight } from '@giphy/js-util'
import { css, cx } from 'emotion'
import React, { GetDerivedStateFromProps, PureComponent, ReactType } from 'react'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import FetchError from './fetch-error'
import Gif, { EventProps, GifOverlayProps } from './gif'
import Loader from './loader'
import MasonryGrid from './masonry-grid'

type Props = {
    className?: string
    width: number
    user: Partial<IUser>
    columns: number
    gutter: number
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
    onGifsFetchError?: (e: Error) => void
    overlay?: ReactType<GifOverlayProps>
    hideAttribution?: boolean
    noResultsMessage?: string | JSX.Element
    initialGifs?: IGif[]
} & EventProps

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
        const { isFetching, isLoaderVisible, gifs } = this.state
        const prefetchCount = gifs.length
        if (!isFetching && isLoaderVisible) {
            this.setState({ isFetching: true, isError: false })
            let gifs
            try {
                gifs = await this.paginator()
            } catch (error) {
                this.setState({ isFetching: false, isError: true })
                const { onGifsFetchError } = this.props
                if (onGifsFetchError) onGifsFetchError(error)
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
            fetchGifs,
            onGifVisible,
            onGifRightClick,
            className = Grid.className,
            onGifSeen,
            onGifClick,
            user,
            overlay,
            hideAttribution,
            noResultsMessage,
            columns,
            width,
            gutter,
        } = this.props
        const { gifWidth, gifs, isError, isDoneFetching } = this.state
        const showLoader = fetchGifs && !isDoneFetching
        const isFirstLoad = gifs.length === 0
        // get the height of each grid item
        const itemHeights = gifs.map(gif => getGifHeight(gif, gifWidth))
        return (
            <div className={className} style={{ width }}>
                <MasonryGrid itemHeights={itemHeights} itemWidth={gifWidth} columns={columns} gutter={gutter}>
                    {gifs.map(gif => (
                        <Gif
                            gif={gif}
                            key={gif.id}
                            width={gifWidth}
                            onGifClick={onGifClick}
                            onGifSeen={onGifSeen}
                            onGifVisible={onGifVisible}
                            onGifRightClick={onGifRightClick}
                            user={user}
                            overlay={overlay}
                            hideAttribution={hideAttribution}
                        />
                    ))}
                </MasonryGrid>
                {!showLoader && gifs.length === 0 && noResultsMessage}
                {isError ? (
                    <FetchError onClick={this.onFetch} />
                ) : (
                    showLoader && (
                        <Observer onVisibleChange={this.onLoaderVisible}>
                            <Loader className={cx(Grid.loaderClassName, isFirstLoad ? loaderHiddenCss : '')} />
                        </Observer>
                    )
                )}
            </div>
        )
    }
}

const loaderHiddenCss = css`
    opacity: 0;
`

export default Grid
