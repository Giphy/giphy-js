import { h, Component } from 'preact'
import { IGif } from '@giphy-js/types'
import { getGifHeight, getBestRendition, getAltText, checkIfWebP } from '@giphy-js/util'
import { giphyBlack, giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy-js/brand'
import addObserver from '../util/add-observer'
import AdPill from './ad-pill'

export const GRID_COLORS = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow]
export const getColor = () => GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))]

type Props = {
    gif: IGif
    width: number
    backgroundColor?: string
    onGifVisible?: (gif: IGif, e: HTMLElement) => void
    onGifSeen?: (gif: IGif) => void
    onGifClick?: (e: Event, gif: IGif) => void
    onGifRightClick?: (e: Event, gif: IGif) => void
}

type State = { ready: boolean; backgroundColor: string; showGif: boolean; gifSeen: boolean }

const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const noop = () => {}

class Gif extends Component<Props, State> {
    observer: IntersectionObserver
    fullGifObserver: IntersectionObserver
    container: HTMLElement
    hasFiredSeen = false
    constructor(props: Props) {
        super(props)
        this.check()
    }
    static getDerivedStateFromProps({ gif, backgroundColor }: Props, prevState: State) {
        const newBackgroundColor = backgroundColor || (gif.is_sticker ? giphyBlack : getColor())
        if (newBackgroundColor !== prevState.backgroundColor) {
            return { backgroundColor: newBackgroundColor }
        }
        return null
    }
    async check() {
        await checkIfWebP()
        this.setState({ ready: true })
    }
    async observeSeen() {
        this.fullGifObserver = await addObserver(
            this.container,
            ([entry]: IntersectionObserverEntry[]) => {
                if (entry.isIntersecting) {
                    this.hasFiredSeen = true
                    // full gif seen
                    const { onGifSeen } = this.props
                    if (onGifSeen) onGifSeen(this.props.gif)
                }
            },
            { threshold: [1] },
        )
    }
    onImageLoad = e => {
        const { gif, onGifVisible = () => {} } = this.props
        // // onSeen is called only once per GIF and indicates that
        // // the image was loaded. onGifVisible will be called every time
        // // the image loads regardless of if its been loaded before
        // // or not.
        if (!this.hasFiredSeen) {
            this.observeSeen()
        }
        onGifVisible(gif, e.target)
    }
    async componentDidMount() {
        this.observer = await addObserver(this.container, ([entry]: IntersectionObserverEntry[]) => {
            // we won't show the gif until we have our polyfill (if we need it)
            this.setState({ showGif: entry.isIntersecting })
        })
    }
    componentWillUnmount() {
        if (this.observer) this.observer.disconnect()
        if (this.fullGifObserver) this.fullGifObserver.disconnect()
    }
    render(
        { gif, gif: { bottle_data }, width, onGifClick = noop, onGifRightClick = noop }: Props,
        { ready, backgroundColor, showGif }: State,
    ) {
        const height = getGifHeight(gif, width)
        const fit = ready ? getBestRendition(gif, width, height) : placeholder
        return (
            <div
                style={{ backgroundColor, width, height }}
                onClick={(e: Event) => onGifClick(e, gif)}
                onContextMenu={(e: Event) => onGifRightClick(e, gif)}
                ref={c => (this.container = c)}
            >
                {showGif ? (
                    <img src={fit} width={width} height={height} alt={getAltText(gif)} onLoad={this.onImageLoad} />
                ) : null}
                {showGif ? <AdPill bottle_data={bottle_data} /> : null}
            </div>
        )
    }
}

export default Gif
