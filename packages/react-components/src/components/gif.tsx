import { giphyBlack, giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
import { IGif, IUser } from '@giphy/js-types'
import { checkIfWebP, getAltText, getBestRenditionUrl, getGifHeight, Logger } from '@giphy/js-util'
import { css, cx } from 'emotion'
import React, { PureComponent, ReactType, SyntheticEvent, createContext, GetDerivedStateFromProps } from 'react'
import * as pingback from '../util/pingback'
import AdPill from './ad-pill'

const gifCss = css`
    display: block;
`
const stickerCss = css`
    display: block;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4AQMAAACSSKldAAAABlBMVEUhIiIWFhYoSqvJAAAAGElEQVQY02MAAv7///8PWxqIPwDZw5UGABtgwz2xhFKxAAAAAElFTkSuQmCC')
        0 0;
`

export const GRID_COLORS = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow]
export const getColor = () => GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))]

const hoverTimeoutDelay = 200

export type EventProps = {
    // fired every time the gif is show
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
    constructor(props: Props) {
        super(props)
        this.check()
    }
    static getDerivedStateFromProps: GetDerivedStateFromProps<Props, State> = (
        { gif, backgroundColor }: Readonly<Props>,
        prevState: Readonly<State>,
    ) => {
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
    onMouseOver = (e: SyntheticEvent<HTMLElement, Event>) => {
        const { gif, user = {} } = this.props
        clearTimeout(this.hoverTimeout)
        e.persist()
        this.setState({ isHovered: true })
        this.hoverTimeout = setTimeout(() => {
            pingback.onGifHover(gif, user, e.target as HTMLElement)
        }, hoverTimeoutDelay)
    }
    onMouseOut = () => {
        clearTimeout(this.hoverTimeout)
        this.setState({ isHovered: false })
    }
    onClick = (e: SyntheticEvent<HTMLElement, Event>) => {
        const { gif, onGifClick, user = {} } = this.props
        // fire pingback
        pingback.onGifClick(gif, user, e.target as HTMLElement)
        if (onGifClick) {
            onGifClick(gif, e)
        }
    }
    createFullGifObserver() {
        const fullGifObserver = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]) => {
                if (entry.isIntersecting) {
                    // flag so we don't observe any more
                    this.hasFiredSeen = true
                    const { onGifSeen, gif, user = {} } = this.props
                    Logger.debug(`GIF ${gif.id} seen. ${gif.title}`)
                    // fire pingback
                    pingback.onGifSeen(gif, user, entry.boundingClientRect)
                    // fire custom
                    if (onGifSeen) onGifSeen(gif, entry.boundingClientRect)
                    // disconnect
                    fullGifObserver.disconnect()
                }
            },
            { threshold: [1] },
        )
        this.fullGifObserver = fullGifObserver
    }
    onImageLoad = (e: SyntheticEvent<HTMLElement, Event>) => {
        const { gif, onGifVisible = () => {} } = this.props
        if (!this.fullGifObserver) {
            this.createFullGifObserver()
        }
        // // onSeen is called only once per GIF and indicates that
        // // the image was loaded. onGifVisible will be called every time
        // // the image loads regardless of if its been loaded before
        // // or not.
        if (!this.hasFiredSeen) {
            this.fullGifObserver!.observe(this.container!)
        }
        onGifVisible(gif, e)
    }
    componentDidMount() {
        this.observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            const { isIntersecting } = entry
            // show the gif if the container is on the screen
            this.setState({ showGif: isIntersecting })
            // remove the fullGifObserver if we go off the screen
            // we may have already disconnected if the hasFiredSeen happened
            if (!isIntersecting && this.fullGifObserver) {
                this.fullGifObserver.disconnect()
            }
        })
        this.observer.observe(this.container!)
    }
    componentWillUnmount() {
        if (this.observer) this.observer.disconnect()
        if (this.fullGifObserver) this.fullGifObserver.disconnect()
        if (this.hoverTimeout) clearTimeout(this.hoverTimeout)
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
                style={{
                    backgroundColor,
                    width,
                    height,
                }}
                className={cx(Gif.className, gif.is_sticker ? stickerCss : gifCss, className)}
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
