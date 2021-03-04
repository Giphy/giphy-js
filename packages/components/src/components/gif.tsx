import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
import { IGif, ImageAllTypes, IUser } from '@giphy/js-types'
import { getAltText, getBestRendition, getGifHeight, injectTrackingPixel, Logger } from '@giphy/js-util'
import { css, cx } from 'emotion'
import { h } from 'preact'
import { useContext, useEffect, useRef, useState } from 'preact/hooks'
import * as pingback from '../util/pingback'
import AttributionOverlay from './attribution/overlay'
import VerifiedBadge from './attribution/verified-badge'
import { PingbackContext } from './pingback-context-manager'

const gifCss = css`
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

const Container = (props: any) => (props.href ? <a href={props.href} {...props} /> : <div {...props} />)

export type EventProps = {
    // fired on desktop when hovered for
    onGifHover?: (gif: IGif, e: Event) => void
    // fired every time the gif is show
    onGifVisible?: (gif: IGif, e: Event) => void
    // fired once after the gif loads and when it's completely in view
    onGifSeen?: (gif: IGif, boundingClientRect: ClientRect | DOMRect) => void
    // fired when the gif is clicked
    onGifClick?: (gif: IGif, e: Event) => void
    // fired when the gif is right clicked
    onGifRightClick?: (gif: IGif, e: Event) => void
}

function useMutableRef<T>(initialValue?: T) {
    const [ref] = useState<{ current: T | undefined }>({ current: initialValue })
    return ref
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
    hideAttribution?: boolean
    noLink?: boolean
    borderRadius?: number
}

export type Props = GifProps & EventProps

const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const noop = () => {}

const Gif = ({
    gif,
    width,
    height: forcedHeight,
    onGifRightClick = noop,
    className,
    onGifClick = noop,
    onGifSeen = noop,
    onGifVisible = noop,
    user = {},
    backgroundColor,
    hideAttribution = false,
    noLink = false,
    borderRadius = 4,
}: Props) => {
    // only fire seen once per gif id
    const [hasFiredSeen, setHasFiredSeen] = useState(false)
    // classname to target animations on image load
    const [loadedClassname, setLoadedClassName] = useState('')
    // hovered is for the gif overlay
    const [isHovered, setHovered] = useState(false)
    // only show the gif if it's on the screen
    const [showGif, setShowGif] = useState(false)
    // the background color shouldn't change unless it comes from a prop or we have a sticker
    const defaultBgColor = useRef(getColor())
    // the a tag the media is rendered into
    const container = useRef<HTMLDivElement | null>(null)
    // intersection observer with no threshold
    const showGifObserver = useMutableRef<IntersectionObserver>()
    // intersection observer with a threshold of 1 (full element is on screen)
    const fullGifObserver = useMutableRef<IntersectionObserver>()
    // fire hover pingback after this timeout
    const hoverTimeout = useMutableRef<number>()
    // fire onseen ref (changes per gif, so need a ref)
    const sendOnSeen = useRef<(_: IntersectionObserverEntry) => void>(noop)
    // custom pingback
    const { attributes, eventType } = useContext(PingbackContext)

    const onMouseOver = (e: Event) => {
        clearTimeout(hoverTimeout.current!)
        setHovered(true)
        hoverTimeout.current = window.setTimeout(() => {
            pingback.onGifHover(gif, user?.id, e.target as HTMLElement, attributes, eventType)
        }, hoverTimeoutDelay)
    }

    const onMouseLeave = () => {
        clearTimeout(hoverTimeout.current!)
        setHovered(false)
    }

    const onClick = (e: Event) => {
        // fire pingback
        pingback.onGifClick(gif, user?.id, e.target as HTMLElement, attributes, eventType)
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
        pingback.onGifSeen(gif, user?.id, entry.boundingClientRect, attributes, eventType)
        // fire custom onGifSeen
        onGifSeen?.(gif, entry.boundingClientRect)
        // disconnect
        if (fullGifObserver.current) {
            fullGifObserver.current.disconnect()
        }
    }

    const onImageLoad = (e: Event) => {
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
        onGifVisible(gif, e) // gif is visible, perhaps just partially
        setLoadedClassName(Gif.imgLoadedClassName)
    }

    useEffect(() => {
        if (fullGifObserver.current) {
            fullGifObserver.current.disconnect()
        }
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

    const borderRadiusCss = borderRadius
        ? css`
              border-radius: ${borderRadius}px;
              overflow: hidden;
          `
        : ''
    return (
        <Container
            href={noLink ? undefined : gif.url}
            style={{
                width,
                height,
            }}
            className={cx(Gif.className, gifCss, borderRadiusCss, className)}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onContextMenu={(e: Event) => onGifRightClick(gif, e)}
        >
            <div style={{ width, height, position: 'relative' }} ref={container}>
                <picture>
                    <source type="image/webp" srcSet={rendition.webp} />
                    <img
                        className={[Gif.imgClassName, loadedClassname].join(' ')}
                        src={showGif ? rendition.url : placeholder}
                        style={{ background }}
                        width={width}
                        height={height}
                        alt={getAltText(gif)}
                        onLoad={showGif ? onImageLoad : () => {}}
                    />
                </picture>
                {showGif ? (
                    <div>{!hideAttribution && <AttributionOverlay gif={gif} isHovered={isHovered} />}</div>
                ) : null}
            </div>
        </Container>
    )
}

Gif.className = 'giphy-gif'
Gif.imgClassName = 'giphy-gif-img'
Gif.imgLoadedClassName = 'giphy-img-loaded'

export default Gif
