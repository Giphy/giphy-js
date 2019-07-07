import { giphyBlack, giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
import { IGif, IUser } from '@giphy/js-types'
import { checkIfWebP, getAltText, getBestRenditionUrl, getGifHeight } from '@giphy/js-util'
import { css, cx } from 'emotion'
import React, { PureComponent, ReactType, SyntheticEvent, createContext } from 'react'
import addObserver from '../util/add-observer'
import * as pingback from '../util/pingback'
import AdPill from './ad-pill'

const gifCss = css`
    display: block;
`

export const GRID_COLORS = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow]
export const getColor = () => GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))]

const hoverTimeoutDelay = 200

export type EventProps = {
    // fired on desktop when hovered over
    onGifHover?: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void
    // fired on desktop on mouse out, given an active hover event
    onGifUnhover?: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void
    // fired every time the gif is shown
    onGifVisible?: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void
    // fired once after the gif loads and when it's completely in view
    onGifSeen?: (gif: IGif, boundingClientRect: ClientRect | DOMRect) => void
    // fired when the gif is clicked
    onGifClick?: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void
    // fired when the gif is right clicked
    onGifRightClick?: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void
}

export type GifOverlayProps = {
    gif: IGif
    isHovered: boolean
}

type GifProps = {
    gif: IGif
    width: number
    backgroundColor?: string
    className?: string
    user: Partial<IUser>
    overlay?: ReactType<GifOverlayProps>
}

const defaultProps = Object.freeze({ user: {} })

type Props = GifProps & EventProps

type State = { ready: boolean; backgroundColor: string; showGif: boolean; isHovered: boolean }
const initialState = Object.freeze({
    ready: false,
    backgroundColor: '',
    showGif: false,
    isHovered: false,
})

const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const noop = () => {}

class Gif extends PureComponent<Props, State> {
    static Context = createContext<IGif | null>(null)
    static readonly defaultProps = defaultProps
    readonly state = initialState
    static className = 'giphy-gif'
    observer?: IntersectionObserver
    fullGifObserver?: IntersectionObserver
    container?: HTMLElement | null
    hasFiredSeen = false
    hoverTimeout?: any
    unhoverTimeout?: any
    constructor(props: Props) {
        super(props)
        this.check()
    }
    static getDerivedStateFromProps({ gif, backgroundColor }: Readonly<Props>, prevState: Readonly<State>) {
        const newBackgroundColor =
            // specified background prop
            backgroundColor ||
            // ensure sticker has black, use existing or generate a new color
            (gif.is_sticker ? giphyBlack : prevState.backgroundColor || getColor())
        if (newBackgroundColor !== prevState.backgroundColor) {
            return { backgroundColor: newBackgroundColor }
        }
        return null
    }
    async check() {
        await checkIfWebP
        this.setState({ ready: true })
    }
    async observeSeen() {
        this.fullGifObserver = await addObserver(
            this.container!,
            ([entry]: IntersectionObserverEntry[]) => {
                if (entry.isIntersecting) {
                    this.hasFiredSeen = true
                    // full gif seen
                    const { onGifSeen, gif, user = {} } = this.props
                    // fire pingback
                    pingback.onGifSeen(gif, user, entry.boundingClientRect)
                    // fire custom
                    if (onGifSeen) onGifSeen(gif, entry.boundingClientRect)
                }
            },
            { threshold: [1] },
        )
    }
    onMouseOver = (e: SyntheticEvent<HTMLElement, Event>) => {
        const { gif, onGifHover, user = {} } = this.props
        clearTimeout(this.hoverTimeout)
        clearTimeout(this.unhoverTimeout)
        e.persist()
        this.hoverTimeout = setTimeout(() => {
            pingback.onGifHover(gif, user, e.target as HTMLElement)
            this.setState({ isHovered: true })
            onGifHover && onGifHover(gif, e)
        }, hoverTimeoutDelay)
    }
    onMouseOut = (e: SyntheticEvent<HTMLElement, Event>) => {
        const { gif, onGifUnhover } = this.props
        const { isHovered } = this.state
        clearTimeout(this.hoverTimeout)
        if(isHovered) {
            this.unhoverTimeout = setTimeout(() => {
                this.setState({ isHovered: false })
                onGifUnhover && onGifUnhover(gif, e)
            }, hoverTimeoutDelay)
        }
    }
    onClick = (e: SyntheticEvent<HTMLElement, Event>) => {
        const { gif, onGifClick, user = {} } = this.props
        // fire pingback
        pingback.onGifClick(gif, user, e.target as HTMLElement)
        if (onGifClick) {
            onGifClick(gif, e)
        }
    }
    onImageLoad = (e: SyntheticEvent<HTMLElement, Event>) => {
        const { gif, onGifVisible = () => {} } = this.props
        // // onSeen is called only once per GIF and indicates that
        // // the image was loaded. onGifVisible will be called every time
        // // the image loads regardless of if its been loaded before
        // // or not.
        if (!this.hasFiredSeen) {
            this.observeSeen()
        }
        onGifVisible(gif, e)
    }
    async componentDidMount() {
        this.observer = await addObserver(this.container!, ([entry]: IntersectionObserverEntry[]) => {
            // we won't show the gif until we have our polyfill (if we need it)
            this.setState({ showGif: entry.isIntersecting })
        })
    }
    componentWillUnmount() {
        if (this.observer) this.observer.disconnect()
        if (this.fullGifObserver) this.fullGifObserver.disconnect()
        if (this.hoverTimeout) clearTimeout(this.hoverTimeout)
        if (this.unhoverTimeout) clearTimeout(this.unhoverTimeout)
    }
    render() {
        const {
            gif,
            gif: { bottle_data: bottleData },
            width,
            onGifRightClick = noop,
            className,
            overlay: Overlay,
        } = this.props
        const { ready, backgroundColor, showGif, isHovered } = this.state
        const height = getGifHeight(gif, width)
        const fit = ready ? getBestRenditionUrl(gif, width, height) : placeholder
        return (
            <a
                href={gif.url}
                style={{ backgroundColor, width, height }}
                className={cx(Gif.className, gifCss, className)}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                onClick={this.onClick}
                onContextMenu={(e: SyntheticEvent<HTMLElement, Event>) => onGifRightClick(gif, e)}
                ref={c => (this.container = c)}
            >
                {showGif ? (
                    <img src={fit} width={width} height={height} alt={getAltText(gif)} onLoad={this.onImageLoad} />
                ) : null}
                {showGif ? <AdPill bottleData={bottleData} /> : null}
                {Overlay && <Overlay gif={gif} isHovered={isHovered} />}
            </a>
        )
    }
}

export default Gif
