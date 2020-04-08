import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
import { IGif, IUser } from '@giphy/js-types'
import {
    checkIfWebP,
    constructMoatData,
    getAltText,
    getBestRenditionUrl,
    getGifHeight,
    injectTrackingPixel,
    Logger,
} from '@giphy/js-util'
import moat from '@giphy/moat-loader'
import { css, cx } from 'emotion'
import { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import * as pingback from '../util/pingback'
import AdPill from './ad-pill'
import AttributionOverlay from './attribution/overlay'

const moatLoader = moat.loadMoatTag('giphydisplay879451385633', 'https://giphyscripts.s3.amazonaws.com/moat/moatad.js')
const gifCss = css`
    display: block;
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
}

export type Props = GifProps & EventProps

const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const noop = () => {}

const Gif = ({
    gif,
    gif: { bottle_data: bottleData = {} },
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
}: Props) => {
    // only fire seen once per gif id
    const [hasFiredSeen, setHasFiredSeen] = useState(false)
    // hovered is for the gif overlay
    const [isHovered, setHovered] = useState(false)
    // only show the gif if it's on the screen
    const [showGif, setShowGif] = useState(false)
    // only render the img after we check for webp
    const [ready, setReady] = useState(false)
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
    // moat ad number
    const moatAdNumber = useMutableRef<number>()
    // are we displaying an ad
    const isAd = Object.keys(bottleData).length > 0

    const onMouseOver = (e: Event) => {
        clearTimeout(hoverTimeout.current!)
        setHovered(true)
        hoverTimeout.current = window.setTimeout(() => {
            pingback.onGifHover(gif, user, e.target as HTMLElement)
        }, hoverTimeoutDelay)
    }

    const onMouseLeave = () => {
        clearTimeout(hoverTimeout.current!)
        setHovered(false)
    }

    const onClick = (e: Event) => {
        // fire pingback
        pingback.onGifClick(gif, user, e.target as HTMLElement)
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
        pingback.onGifSeen(gif, user, entry.boundingClientRect)
        // fire custom onGifSeen
        onGifSeen?.(gif, entry.boundingClientRect)
        // disconnect
        if (fullGifObserver.current) {
            fullGifObserver.current.disconnect()
        }
    }

    const trackWithMoat = async () => {
        if (showGif && container.current) {
            await moatLoader
            const { bottle_data: bottleData } = gif
            const moatCompatibleData = constructMoatData(bottleData as any)
            if (moatCompatibleData) {
                moatAdNumber.current = moat.startTracking(container.current, moatCompatibleData)
            }
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
                { threshold: [1] }
            )
        }
        if (!hasFiredSeen && container.current && fullGifObserver.current) {
            // observe img for full gif view
            fullGifObserver.current.observe(container.current)
        }
        if (isAd) {
            if (moatAdNumber.current === undefined) {
                trackWithMoat()
            }
            injectTrackingPixel(bottleData.tags)
        }
        onGifVisible(gif, e) // gif is visible, perhaps just partially
    }

    const checkForWebP = async () => {
        await checkIfWebP
        setReady(true)
    }

    useEffect(() => {
        if (fullGifObserver.current) {
            fullGifObserver.current.disconnect()
        }
        setHasFiredSeen(false)
    }, [gif.id])

    const stopTracking = () => {
        // if we have a moat ad number
        if (moatAdNumber.current !== undefined) {
            // stop tracking
            moat.stopTracking(moatAdNumber.current)
            // remove the moat ad number
            moatAdNumber.current = undefined
        }
    }

    // if this component goes from showing an ad to not an ad
    useEffect(() => {
        if (!showGif) {
            stopTracking()
        }
    }, [showGif])

    useEffect(() => {
        checkForWebP()

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
            stopTracking()
        }
    }, [])
    const height = forcedHeight || getGifHeight(gif, width)
    const fit = ready ? getBestRenditionUrl(gif, width, height) : placeholder
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
            }}
            className={cx(Gif.className, gifCss, className)}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onContextMenu={(e: Event) => onGifRightClick(gif, e)}
        >
            <div style={{ width, height, position: 'relative' }} ref={container}>
                <img
                    className={Gif.imgClassName}
                    src={showGif ? fit : placeholder}
                    style={{ background }}
                    width={width}
                    height={height}
                    alt={getAltText(gif)}
                    onLoad={showGif ? onImageLoad : () => {}}
                />
                {showGif ? (
                    <div>
                        <AdPill bottleData={bottleData} isHovered={isHovered} />
                        {!hideAttribution && <AttributionOverlay gif={gif} isHovered={isHovered} />}
                    </div>
                ) : null}
            </div>
        </Container>
    )
}

Gif.className = 'giphy-gif'
Gif.imgClassName = 'giphy-gif-img'

export default Gif
