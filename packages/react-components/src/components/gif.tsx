import { giphyBlack, giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
import { IGif, IUser } from '@giphy/js-types'
import { checkIfWebP, getAltText, getBestRenditionUrl, getGifHeight, Logger } from '@giphy/js-util'
import { css, cx } from 'emotion'
import React, { ReactType, SyntheticEvent, useEffect, useRef, useState } from 'react'
import * as pingback from '../util/pingback'
import AdPill from './ad-pill'
import moat from './moat-display-loader'

const moadLoader = moat.loadMoatTag('giphydisplay879451385633')

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
    user?: Partial<IUser>
    overlay?: ReactType<GifOverlayProps>
}

type Props = GifProps & EventProps

const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const noop = () => {}

const Gif = ({
    gif,
    gif: { bottle_data: bottleData },
    width,
    onGifRightClick = noop,
    className,
    onGifClick = noop,
    onGifSeen = noop,
    onGifVisible = noop,
    user = {},
    backgroundColor,
    overlay: Overlay,
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
    const container = useRef<HTMLAnchorElement | null>(null)
    // intersection observer with no threshold
    const showGifObserver = useRef<IntersectionObserver>()
    // intersection observer with a threshold of 1 (full element is on screen)
    const fullGifObserver = useRef<IntersectionObserver>()
    // fire hover pingback after this timeout
    const hoverTimeout = useRef<number>()
    // fire onseen ref (changes per gif, so need a ref)
    const sendOnSeen = useRef<(_: IntersectionObserverEntry) => void>(noop)
    // moat ad number
    const moatAdNumber = useRef<number>()

    //
    const trackWithMoat = async () => {
        await moadLoader
        moatAdNumber.current = moat.startTracking(container.current!, {})
    }

    const onMouseOver = (e: SyntheticEvent<HTMLElement, Event>) => {
        clearTimeout(hoverTimeout.current!)
        e.persist()
        setHovered(true)
        hoverTimeout.current = window.setTimeout(() => {
            pingback.onGifHover(gif, user, e.target as HTMLElement)
        }, hoverTimeoutDelay)
    }

    const onMouseOut = () => {
        clearTimeout(hoverTimeout.current!)
        setHovered(false)
    }

    const onClick = (e: SyntheticEvent<HTMLElement, Event>) => {
        // fire pingback
        pingback.onGifClick(gif, user, e.target as HTMLElement)
        onGifClick(gif, e)
    }

    // using a ref in case `gif` changes
    sendOnSeen.current = (entry: IntersectionObserverEntry) => {
        // flag so we don't observe any more
        setHasFiredSeen(true)
        Logger.debug(`GIF ${gif.id} seen. ${gif.title}`)
        // fire pingback
        pingback.onGifSeen(gif, user, entry.boundingClientRect)
        // fire custom onGifSeen
        onGifSeen(gif, entry.boundingClientRect)
        // disconnect
        if (fullGifObserver.current) {
            fullGifObserver.current.disconnect()
        }
    }

    const onImageLoad = (e: SyntheticEvent<HTMLElement, Event>) => {
        if (!fullGifObserver.current) {
            fullGifObserver.current = new IntersectionObserver(
                ([entry]: IntersectionObserverEntry[]) => {
                    if (entry.isIntersecting) {
                        sendOnSeen.current(entry)
                    }
                },
                { threshold: [1] },
            )
        }
        if (!hasFiredSeen && container.current && fullGifObserver.current) {
            // observe img for full gif view
            fullGifObserver.current.observe(container.current)
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

    const isAd = Object.keys(bottleData).length > 0
    useEffect(() => {
        if (isAd) {
            trackWithMoat()
        } else if (moatAdNumber.current) {
            moat.stopTracking(moatAdNumber.current)
        }
    }, [isAd])
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
            if (moatAdNumber.current) moat.stopTracking(moatAdNumber.current)
        }
    }, [])
    const height = getGifHeight(gif, width)
    const fit = ready ? getBestRenditionUrl(gif, width, height) : placeholder
    const bgColor =
        backgroundColor || // <- specified background prop
        // ensure sticker has black
        (gif.is_sticker ? giphyBlack : defaultBgColor.current)

    return (
        <a
            href={gif.url}
            style={{
                backgroundColor: bgColor,
                width,
                height,
            }}
            className={cx(Gif.className, gif.is_sticker ? stickerCss : gifCss, className)}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            onContextMenu={(e: SyntheticEvent<HTMLElement, Event>) => onGifRightClick(gif, e)}
            ref={container}
        >
            {showGif ? (
                <img src={fit} width={width} height={height} alt={getAltText(gif)} onLoad={onImageLoad} />
            ) : null}
            {showGif ? <AdPill bottleData={bottleData} /> : null}
            {Overlay && <Overlay gif={gif} isHovered={isHovered} />}
        </a>
    )
}

Gif.className = 'giphy-gif'

export default Gif
