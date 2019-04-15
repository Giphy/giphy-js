import { h, Component } from 'preact'
import { debounce } from 'throttle-debounce'
import Gif, { EventProps } from './gif'
import Bricks from 'bricks.js'
import Observer from '../util/observer'
import { IGif, IUser } from '@giphy/js-types'
import * as pingback from '../util/pingback'
import { GifsResult, gifPaginator } from '@giphy/js-fetch-api'
import Loader from './loader'

export const className = 'giphy-grid' // used in preact render

type Props = {
    width: number
    user: Partial<IUser>
    columns: number
    gutter: number
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
} & EventProps

type State = {
    gifWidth: number
    isFetching: boolean
    numberOfGifs: number
    gifs: IGif[]
    isLoaderVisible: boolean
}
class Grid extends Component<Props, State> {
    state = {
        isFetching: false,
        numberOfGifs: 0,
        gifWidth: 0,
        gifs: [],
        isLoaderVisible: true,
    }
    bricks?: any
    el?: HTMLElement
    paginator: () => Promise<IGif[]>
    static getDerivedStateFromProps({ columns, gutter, width }: Props, prevState: State) {
        const gutterOffset = gutter * (columns - 1)
        const gifWidth = Math.floor((width - gutterOffset) / columns)
        if (prevState.gifWidth !== gifWidth) {
            return { gifWidth }
        }
        return null
    }
    constructor(props: Props) {
        super(props)
        this.paginator = gifPaginator(props.fetchGifs)
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
    onGifSeen = (gif: IGif, boundingClientRect: ClientRect | DOMRect) => {
        const { onGifSeen, user } = this.props
        if (onGifSeen) {
            onGifSeen(gif, boundingClientRect)
        }
        // fire pingback
        pingback.onGifSeen(gif, user, boundingClientRect)
    }
    onGifClick = (gif: IGif, e: Event) => {
        const { onGifClick, user } = this.props
        if (onGifClick) {
            onGifClick(gif, e)
        }
        pingback.onGifClick(gif, user, e)
    }
    onGifHover = (gif: IGif, e: Event) => {
        const { onGifHover, user } = this.props
        if (onGifHover) {
            onGifHover(gif, e)
        }
        pingback.onGifHover(gif, user, e)
    }
    onLoaderVisible = (isVisible: boolean) => {
        this.setState({ isLoaderVisible: isVisible }, this.onFetch)
    }
    onFetch = debounce(100, async () => {
        const { isFetching, isLoaderVisible } = this.state
        if (!isFetching && isLoaderVisible) {
            this.setState({ isFetching: true })
            const gifs = await this.paginator()
            this.setState({ gifs, isFetching: false })
            const { onGifsFetched } = this.props
            if (onGifsFetched) onGifsFetched(gifs)
            this.onFetch()
        }
    })

    render({ fetchGifs, onGifVisible, onGifRightClick }: Props, { gifWidth, gifs }: State) {
        const showLoader = fetchGifs && gifs.length > 0
        return (
            <div class={className}>
                <div ref={c => (this.el = c)}>
                    {gifs.map(gif => (
                        <Gif
                            gif={gif}
                            key={gif.id}
                            width={gifWidth}
                            onGifClick={this.onGifClick}
                            onGifHover={this.onGifHover}
                            onGifSeen={this.onGifSeen}
                            onGifVisible={onGifVisible}
                            onGifRightClick={onGifRightClick}
                        />
                    ))}
                </div>
                {showLoader && (
                    <Observer onVisibleChange={this.onLoaderVisible}>
                        <Loader />
                    </Observer>
                )}
            </div>
        )
    }
}

export default Grid
