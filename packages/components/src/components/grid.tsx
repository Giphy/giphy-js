import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import Bricks from 'bricks.js'
import { css, cx } from 'emotion'
import { Component, h, JSX } from 'preact'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import FetchError from './fetch-error'
import Gif, { EventProps } from './gif'
import Loader from './loader'
import PingbackContextManager from './pingback-context-manager'

const loaderHiddenCss = css`
    opacity: 0;
`

type Props = {
    className?: string
    width: number
    user?: Partial<IUser>
    columns: number
    gutter: number
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
    onGifsFetchError?: (e: Error) => void
    noResultsMessage?: string | JSX.Element
    hideAttribution?: boolean
    noLink?: boolean
    tabIndex?: number
    borderRadius?: number
} & EventProps
const defaultProps = Object.freeze({ gutter: 6, user: {} })

type State = {
    gifWidth: number
    isFetching: boolean
    isError: boolean
    isDoneFetching: boolean
    numberOfGifs: number
    gifs: IGif[]
    isLoaderVisible: boolean
}
const initialState = Object.freeze({
    isFetching: false,
    isError: false,
    numberOfGifs: 0,
    gifWidth: 0,
    gifs: [] as IGif[],
    isLoaderVisible: true,
    isDoneFetching: false,
})
class Grid extends Component<Props, State> {
    static className = 'giphy-grid'
    static loaderClassName = 'giphy-loader'
    static readonly defaultProps = defaultProps
    static fetchDebounce = 250
    readonly state = initialState
    bricks?: any
    el: HTMLElement | null = null
    paginator = gifPaginator(this.props.fetchGifs)
    static getDerivedStateFromProps({ columns, gutter, width }: Readonly<Props>, prevState: Readonly<State>) {
        const gutterOffset = gutter * (columns - 1)
        const gifWidth = Math.floor((width - gutterOffset) / columns)
        if (prevState.gifWidth !== gifWidth) {
            return { gifWidth }
        }
        return {}
    }

    setBricks() {
        const { columns, gutter } = this.props
        // bricks
        this.bricks = Bricks({
            container: this.el!,
            packed: `data-packed-${columns}`,
            sizes: [{ columns, gutter }],
        })
    }

    componentDidMount() {
        this.setBricks()
        this.onFetch()
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { gifs } = this.state
        const { gifWidth } = this.state

        const numberOfOldGifs = prevState.gifs.length
        const numberOfNewGifs = gifs.length

        if (prevState.gifWidth !== gifWidth && numberOfOldGifs > 0) {
            const { columns } = this.props
            if (columns !== prevProps.columns) {
                this.setBricks()
            }
            this.bricks.pack()
        }

        if (prevState.gifs !== gifs) {
            if (numberOfNewGifs > numberOfOldGifs && numberOfOldGifs > 0) {
                // we just added new gifs
                this.bricks.update()
            } else {
                // we changed existing gifs or removed a gif
                this.bricks.pack()
            }
        }
    }

    onLoaderVisible = (isVisible: boolean) => {
        this.setState({ isLoaderVisible: isVisible }, this.onFetch)
    }

    onFetch = debounce(Grid.fetchDebounce, async () => {
        const { isFetching, isLoaderVisible, gifs: existingGifs } = this.state
        if (!isFetching && isLoaderVisible) {
            this.setState({ isFetching: true, isError: false })
            let gifs
            try {
                gifs = await this.paginator()
            } catch (error) {
                this.setState({ isFetching: false, isError: true })
                const { onGifsFetchError } = this.props
                if (onGifsFetchError) onGifsFetchError(error as Error)
            }
            if (gifs) {
                if (existingGifs.length === gifs.length) {
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

    render(
        {
            onGifVisible,
            onGifRightClick,
            className = Grid.className,
            onGifClick,
            onGifHover,
            onGifKeyPress,
            onGifSeen,
            user,
            noResultsMessage,
            hideAttribution,
            noLink,
            tabIndex = 0,
            borderRadius,
        }: Props,
        { gifWidth, gifs, isError, isDoneFetching }: State
    ) {
        const showLoader = !isDoneFetching
        const isFirstLoad = gifs.length === 0
        return (
            <PingbackContextManager attributes={{ layout_type: 'GRID' }}>
                <div class={className}>
                    <div ref={(c) => (this.el = c)}>
                        {gifs.map((gif) => (
                            <Gif
                                gif={gif}
                                key={gif.id}
                                tabIndex={tabIndex}
                                width={gifWidth}
                                onGifClick={onGifClick}
                                onGifHover={onGifHover}
                                onGifKeyPress={onGifKeyPress}
                                onGifSeen={onGifSeen}
                                onGifVisible={onGifVisible}
                                onGifRightClick={onGifRightClick}
                                user={user}
                                hideAttribution={hideAttribution}
                                noLink={noLink}
                                borderRadius={borderRadius}
                            />
                        ))}
                        {!showLoader && gifs.length === 0 && noResultsMessage}
                    </div>
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
            </PingbackContextManager>
        )
    }
}

export default Grid
