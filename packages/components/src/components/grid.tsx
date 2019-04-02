import { h, Component } from 'preact'
import Gif, { EventProps } from './gif'
import Bricks from 'bricks.js'
import Observer from '../util/observer'
import Loader from './loader'
import { IGif, IUser } from '@giphy/js-types'
import * as pingback from '../util/pingback'
import { PingbackEventType } from '@giphy/js-analytics'

export const className = 'giphy-grid' // used in preact render
type GridProps = {
    width: number
    gifs: IGif[]
    user: Partial<IUser>
    columns: number
    gutter: number
    pingbackEventType: PingbackEventType
    fetchGifs?: () => void
}

export type Props = GridProps & EventProps

type State = { gifWidth: number; isFetching: boolean; numberOfGifs: number }
class Grid extends Component<Props, State> {
    state = {
        isFetching: false,
        numberOfGifs: 0,
        gifWidth: 0,
    }
    bricks?: any
    el?: HTMLElement
    static getDerivedStateFromProps({ columns, gutter, width, gifs }: Props, prevState: State) {
        const gutterOffset = gutter * (columns - 1)
        const gifWidth = Math.floor((width - gutterOffset) / columns)
        const result: any = {}
        if (prevState.gifWidth !== gifWidth) {
            result.gifWidth = gifWidth
        }
        if (gifs.length > prevState.numberOfGifs) {
            result.isFetching = false
            result.numberOfGifs = gifs.length
        }
        return Object.keys(result).length ? result : null
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
        const { gifs } = this.props
        // bricks
        this.setBricks()
        if (gifs.length) {
            this.bricks.pack()
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { gifs } = this.props
        const { gifWidth } = this.state

        const numberOfOldGifs = prevProps.gifs.length
        const numberOfNewGifs = gifs.length

        if (prevState.gifWidth !== gifWidth && numberOfOldGifs > 0) {
            const { columns } = this.props
            if (columns !== prevProps.columns) {
                this.setBricks()
            }
            this.bricks.pack()
        }

        if (prevProps.gifs !== gifs) {
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
        const { onGifSeen, pingbackEventType, user } = this.props
        if (onGifSeen) {
            onGifSeen(gif, boundingClientRect)
        }
        // fire pingback
        // also perhaps third party here
        pingback.onGifSeen(gif, user, pingbackEventType, boundingClientRect)
    }
    onGifClick = (gif: IGif, e: Event) => {
        const { onGifClick, pingbackEventType, user } = this.props
        if (onGifClick) {
            onGifClick(gif, e)
        }
        pingback.onGifClick(gif, user, pingbackEventType, e)
    }
    onGifHover = (gif: IGif, e: Event) => {
        const { onGifHover, pingbackEventType, user } = this.props
        if (onGifHover) {
            onGifHover(gif, e)
        }
        pingback.onGifHover(gif, user, pingbackEventType, e)
    }
    fetchGifs = () => {
        const { fetchGifs } = this.props
        const { isFetching } = this.state
        if (!isFetching && fetchGifs) {
            this.setState({ isFetching: true })
            fetchGifs()
        }
    }

    render({ gifs, fetchGifs, onGifVisible, onGifRightClick }: Props, { gifWidth }: State) {
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
                    <Observer>
                        <Loader fetchGifs={this.fetchGifs} />
                    </Observer>
                )}
            </div>
        )
    }
}

export default Grid
