import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/js-brand'
import { IGif, IUser } from '@giphy/js-types'
import { checkIfWebP, getAltText, getBestRenditionUrl, getGifHeight, Logger } from '@giphy/js-util'
import moat from '@giphy/moat-loader'
import { css, cx } from 'emotion'
import React, { ReactType, SyntheticEvent, useEffect, useRef, useState } from 'react'
import constructMoatData from '../util/construct-moat-data'
import * as pingback from '../util/pingback'
import AdPill from './ad-pill'

const moatLoader = moat.loadMoatTag('giphydisplay879451385633')

const gifCss = css`
    display: block;
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
    height?: number
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
    height: forcedHeight,
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
    // are we displaying an ad
    const isAd = Object.keys(bottleData).length > 0

    const onMouseOver = (e: SyntheticEvent<HTMLElement, Event>) => {
        clearTimeout(hoverTimeout.current!)
        e.persist()
        setHovered(true)
        hoverTimeout.current = window.setTimeout(() => {
            pingback.onGifHover(gif, user, e.target as HTMLElement)
        }, hoverTimeoutDelay)
    }

    const onMouseLeave = () => {
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
                moatAdNumber.current = moat.startTracking(container.current, {})
            }
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
                { threshold: [1] }
            )
        }
        if (!hasFiredSeen && container.current && fullGifObserver.current) {
            // observe img for full gif view
            fullGifObserver.current.observe(container.current)
        }
        if (isAd && moatAdNumber.current === undefined) {
            trackWithMoat()
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
        <a
            href={gif.url}
            style={{
                width,
                height,
            }}
            className={cx(Gif.className, gifCss, className)}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onContextMenu={(e: SyntheticEvent<HTMLElement, Event>) => onGifRightClick(gif, e)}
            ref={container}
        >
            <div style={{ width, height, position: 'relative' }}>
                <img
                    src={showGif ? fit : placeholder}
                    style={{ background }}
                    width={width}
                    height={height}
                    alt={getAltText(gif)}
                    onLoad={showGif ? onImageLoad : () => {}}
                />
                {showGif ? <AdPill bottleData={bottleData} /> : null}
                {Overlay && <Overlay gif={gif} isHovered={isHovered} />}
            </div>
        </a>
    )
}

Gif.className = 'giphy-gif'

export default Gif
