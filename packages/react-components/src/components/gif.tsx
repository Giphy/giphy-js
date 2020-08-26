import styled from '@emotion/styled'
import { PingbackAttribute } from '@giphy/js-analytics'
import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
import { IGif, ImageAllTypes, IUser } from '@giphy/js-types'
import { getAltText, getBestRendition, getGifHeight, injectTrackingPixel, Logger } from '@giphy/js-util'
import React, {
    createContext,
    HTMLProps,
    ReactType,
    SyntheticEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import * as pingback from '../util/pingback'
import AttributionOverlay from './attribution/overlay'
import VerifiedBadge from './attribution/verified-badge'

type PingbackContextProps = { attributes: PingbackAttribute[] }
export const PingbackContext = createContext({} as PingbackContextProps)

const GifContainer = styled.div`
    display: block;
    img {
        display: block;
    }
    .${VerifiedBadge.className} {
        g {
            fill: white;
        }
    }
`

export const GRID_COLORS = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow]
export const getColor = () => GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))]

const hoverTimeoutDelay = 200

type ContainerProps = HTMLProps<HTMLElement> & { href?: string }
const Container = (props: ContainerProps) => (
    <GifContainer as={props.href ? 'a' : 'div'} {...(props as HTMLProps<HTMLDivElement>)} />
)

export type EventProps = {
    // fired every time the gif is show
    onGifVisible?: (gif: IGif, e?: SyntheticEvent<HTMLElement, Event>) => void
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
    height?: number
    backgroundColor?: string
    className?: string
    user?: Partial<IUser>
    overlay?: ReactType<GifOverlayProps>
    hideAttribution?: boolean
    noLink?: boolean
    style?: any
}

type Props = GifProps & EventProps

const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// used to detect if we're on the server or client
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement)

const noop = () => {}

const Gif = ({
    gif,
    width,
    height: forcedHeight,
    onGifRightClick = noop,
    className = '',
    onGifClick = noop,
    onGifSeen = noop,
    onGifVisible = noop,
    user = {},
    backgroundColor,
    overlay,
    hideAttribution = false,
    noLink = false,
    style,
}: Props) => {
    // only fire seen once per gif id
    const [hasFiredSeen, setHasFiredSeen] = useState(false)
    // hovered is for the gif overlay
    const [isHovered, setHovered] = useState(false)
    // only show the gif if it's on the screen
    // if we can't use the dom (SSR), then we show the gif by default
    const [showGif, setShowGif] = useState(!canUseDOM)
    // the background color shouldn't change unless it comes from a prop or we have a sticker
    const defaultBgColor = useRef(getColor())
    // the a tag the media is rendered into
    const container = useRef<HTMLDivElement | null>(null)
    // to play it safe when using SSR, we check image.complete after mount
    const image = useRef<HTMLImageElement | null>(null)
    // intersection observer with no threshold
    const showGifObserver = useRef<IntersectionObserver>()
    // intersection observer with a threshold of 1 (full element is on screen)
    const fullGifObserver = useRef<IntersectionObserver>()
    // fire hover pingback after this timeout
    const hoverTimeout = useRef<number>()
    // fire onseen ref (changes per gif, so need a ref)
    const sendOnSeen = useRef<(_: IntersectionObserverEntry) => void>(noop)
    // custom pingback
    const { attributes } = useContext(PingbackContext)
    // user's overlay
    let Overlay = overlay
    if (!Overlay && !hideAttribution) {
        // no user overlay, and no force hide of the attribution
        Overlay = AttributionOverlay
    }

    const onMouseOver = (e: SyntheticEvent<HTMLElement, Event>) => {
        clearTimeout(hoverTimeout.current!)
        e.persist()
        setHovered(true)
        hoverTimeout.current = window.setTimeout(() => {
            pingback.onGifHover(gif, user, e.target as HTMLElement, attributes)
        }, hoverTimeoutDelay)
    }

    const onMouseLeave = () => {
        clearTimeout(hoverTimeout.current!)
        setHovered(false)
    }

    const onClick = (e: SyntheticEvent<HTMLElement, Event>) => {
        // fire pingback
        pingback.onGifClick(gif, user, e.target as HTMLElement, attributes)
        onGifClick(gif, e)
    }

    // using a ref in case `gif` changes
    sendOnSeen.current = (entry: IntersectionObserverEntry) => {
        // flag so we don't observe any more
        setHasFiredSeen(true)
        Logger.debug(`GIF ${gif.id} seen. ${gif.title}`)
        // third party here
        if (gif.bottle_data && gif.bottle_data.tags) {
            injectTrackingPixel(gif.bottle_data.tags)
        }
        // fire pingback
        pingback.onGifSeen(gif, user, entry.boundingClientRect, attributes)
        // fire custom onGifSeen
        onGifSeen?.(gif, entry.boundingClientRect)
        // disconnect
        if (fullGifObserver.current) {
            fullGifObserver.current.disconnect()
        }
    }
    const watchGif = () => {
        if (!fullGifObserver.current) {
            fullGifObserver.current = new IntersectionObserver(
                ([entry]: IntersectionObserverEntry[]) => {
                    if (entry.isIntersecting) {
                        sendOnSeen.current(entry)
                    }
                },
                { threshold: [0.99] }
            )
        }
        if (!hasFiredSeen && container.current && fullGifObserver.current) {
            // observe img for full gif view
            fullGifObserver.current.observe(container.current)
        }
    }

    const onImageLoad = (e: SyntheticEvent<HTMLElement, Event>) => {
        watchGif()
        onGifVisible(gif, e) // gif is visible, perhaps just partially
    }

    useEffect(() => {
        if (image.current?.complete) {
            watchGif()
            onGifVisible(gif) // gif is visible, perhaps just partially
        }
        fullGifObserver.current?.disconnect()
        setHasFiredSeen(false)
    }, [gif.id])

    useEffect(() => {
        showGifObserver.current = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            const { isIntersecting } = entry
            // show the gif if the container is on the screen
            setShowGif(isIntersecting)
            // remove the fullGifObserver if we go off the screen
            // we may have already disconnected if the hasFiredSeen happened
            if (!isIntersecting && fullGifObserver.current) {
                fullGifObserver.current.disconnect()
            }
        })
        showGifObserver.current.observe(container.current!)
        return () => {
            if (showGifObserver.current) showGifObserver.current.disconnect()
            if (fullGifObserver.current) fullGifObserver.current.disconnect()
            if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
        }
    }, [])
    const height = forcedHeight || getGifHeight(gif, width)
    const bestRendition = getBestRendition(gif.images, width, height)
    const rendition = gif.images[bestRendition.renditionName] as ImageAllTypes
    const background =
        backgroundColor || // <- specified background prop
        // sticker has black if no backgroundColor is specified
        (gif.is_sticker
            ? `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4AQMAAACSSKldAAAABlBMVEUhIiIWFhYoSqvJAAAAGElEQVQY02MAAv7///8PWxqIPwDZw5UGABtgwz2xhFKxAAAAAElFTkSuQmCC') 0 0`
            : defaultBgColor.current)
    return (
        <Container
            href={noLink ? undefined : gif.url}
            style={{
                width,
                height,
                ...style,
            }}
            className={[Gif.className, className].join(' ')}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onContextMenu={(e: SyntheticEvent<HTMLElement, Event>) => onGifRightClick(gif, e)}
        >
            <div style={{ width, height, position: 'relative' }} ref={container}>
                <picture>
                    <source type="image/webp" srcSet={rendition.webp} />
                    <img
                        ref={image}
                        suppressHydrationWarning
                        className={Gif.imgClassName}
                        src={showGif ? rendition.url : placeholder}
                        style={{ background }}
                        width={width}
                        height={height}
                        alt={getAltText(gif)}
                        onLoad={showGif ? onImageLoad : () => {}}
                    />
                </picture>
                {showGif ? Overlay && <Overlay gif={gif} isHovered={isHovered} /> : null}
            </div>
        </Container>
    )
}

Gif.className = 'giphy-gif'
Gif.imgClassName = 'giphy-gif-img'

export default Gif
