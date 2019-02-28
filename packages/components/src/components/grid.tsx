import { h, Component } from 'preact'
import Gif, { EventProps } from './gif'
import Bricks from 'bricks.js'
import Observer from '../util/observer'
import Loader from './loader'
import { IGif } from '@giphy/js-types'
import * as pingback from '../util/pingback'

export const className = 'giphy-grid' // used in preact render
type GridProps = {
    width: number
    gifs: IGif[]
    columns: number
    gutter: number
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
    componentDidMount() {
        const { columns, gutter, gifs } = this.props
        // bricks
        this.bricks = Bricks({
            container: this.el!,
            packed: 'data-packed',
            sizes: [{ columns, gutter }],
        })
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
    onGifClick = (gif: IGif, e: Event) => {
        const { onGifClick } = this.props
        if (onGifClick) {
            onGifClick(gif, e)
        }
        pingback.onGifClick(gif, e)
    }
    onGifHover = (gif: IGif, e: Event) => {
        const { onGifHover } = this.props
        if (onGifHover) {
            onGifHover(gif, e)
        }
        pingback.onGifHover(gif, e)
    }
    fetchGifs = () => {
        const { fetchGifs } = this.props
        const { isFetching } = this.state
        if (!isFetching && fetchGifs) {
            this.setState({ isFetching: true })
            fetchGifs()
        }
    }

    render({ gifs, fetchGifs, width }: Props, { gifWidth }: State) {
        const showLoader = fetchGifs && gifs.length > 0
        return (
            <div style={{ width }} class={className}>
                <div ref={c => (this.el = c)}>
                    {gifs.map(gif => (
                        <Gif
                            gif={gif}
                            key={gif.id}
                            width={gifWidth}
                            onGifClick={this.onGifClick}
                            onGifHover={this.onGifHover}
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
