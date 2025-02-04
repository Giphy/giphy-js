'use client'
import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/colors'
import { IGif, IUser, ImageAllTypes } from '@giphy/js-types'
import { Logger, getAltText, getBestRendition, getGifHeight } from '@giphy/js-util'
import 'intersection-observer'
import React, { ElementType, ReactNode, SyntheticEvent, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as pingback from '../util/pingback'
import AttributionOverlay from './attribution/overlay'
import VerifiedBadge from './attribution/verified-badge'
import BottleData from './bottle-data'
import { PingbackContext } from './pingback-context-manager'
import { GifOverlayProps } from './types'

const Container = styled.div`
    position: relative;
    display: block;
    picture {
        display: block;
        width: 100%;
        height: 100%;
    }
    img {
        display: block;
    }
    .${VerifiedBadge.className} {
        g {
            fill: white;
        }
    }
    .${VerifiedBadge.checkMarkClassName} {
        opacity: 0;
    }
`

export const GRID_COLORS = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow]
export const getColor = () => GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))]

const hoverTimeoutDelay = 200

export type EventProps = {
    // fired every time the gif is show
    onGifVisible?: (gif: IGif, e?: SyntheticEvent<HTMLElement, Event>) => void
    // fired once after the gif loads and when it's completely in view
    onGifSeen?: (gif: IGif, boundingClientRect: ClientRect | DOMRect) => void
    // fired when the gif is clicked
    onGifClick?: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void
    // fired when the gif is right clicked
    onGifRightClick?: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void
    // fired when the gif is selected and a key is pressed
    onGifKeyPress?: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void
}

type GifProps = {
    gif: IGif
    /**
     * The width of the grid in pixels. This size will also determine the renditions of the grid items.
     */
    width: number
    /**
     * A percentage value for the container to scale into. If the container scales up to a large size
     * and there is a small `width` property, the resolution of the grid items may be poor
     */
    percentWidth?: string
    /**
     * Usually you don't need to define a height, as it can be calculated from the width provided in the gif data.
     * Two use cases would be using your own aspect ratio, and when you need to animate the height.
     */
    height?: number
    percentHeight?: string
    backgroundColor?: string
    className?: string
    user?: Partial<IUser>
    overlay?: ElementType<GifOverlayProps>
    hideAttribution?: boolean
    noLink?: boolean
    borderRadius?: number
    tabIndex?: number
    style?: any
    lazyLoad?: boolean
}

type Props = GifProps & EventProps

const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// used to detect if we're on the server or client
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement)

const noop = () => {}

const RenderOnClient = ({ children }: { children: ReactNode }) => {
    const [render, setRender] = useState(false)
    useEffect(() => {
        setRender(true)
    }, [])
    return render ? <>{children}</> : null
}

const Gif = ({
    gif,
    gif: { bottle_data: bottleData = {} },
    width,
    percentWidth,
    percentHeight,
    height: forcedHeight,
    onGifRightClick = noop,
    className = '',
    onGifClick = noop,
    onGifKeyPress = noop,
    onGifSeen = noop,
    onGifVisible = noop,
    user = {},
    backgroundColor,
    overlay,
    hideAttribution = false,
    noLink = false,
    borderRadius = 4,
    style,
    tabIndex,
    lazyLoad = true,
}: Props) => {
    // only fire seen once per gif id
    const [hasFiredSeen, setHasFiredSeen] = useState(false)
    // hovered is for the gif overlay
    const [isHovered, setHovered] = useState(false)
    // only show the gif if it's on the screen
    // if we can't use the dom (SSR), then we show the gif by default
    const [shouldShowMedia, setShouldShowMedia] = useState(!canUseDOM || !lazyLoad)
    // classname to target animations on image load
    const [loadedClassname, setLoadedClassName] = useState('')
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
    // are we displaying an ad
    const isAd = Object.keys(bottleData).length > 0
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
            pingback.onGifHover(gif, user?.id, e.target as HTMLElement, attributes)
        }, hoverTimeoutDelay)
    }

    const onMouseLeave = () => {
        clearTimeout(hoverTimeout.current!)
        setHovered(false)
    }

    const onClick = (e: SyntheticEvent<HTMLElement, Event>) => {
        // fire pingback
        pingback.onGifClick(gif, user?.id, e.target as HTMLElement, attributes)
        onGifClick(gif, e)
    }

    const onKeyPress = (e: SyntheticEvent<HTMLElement, Event>) => {
        onGifKeyPress(gif, e)
    }

    // using a ref in case `gif` changes
    sendOnSeen.current = (entry: IntersectionObserverEntry) => {
        // flag so we don't observe any more
        setHasFiredSeen(true)
        Logger.debug(`GIF ${gif.id} seen. ${gif.title}`)
        // fire pingback
        pingback.onGifSeen(gif, user?.id, entry.boundingClientRect, attributes)
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
        setLoadedClassName(Gif.imgLoadedClassName)
    }
    useEffect(() => {
        // the id has changed, maybe the image has loaded
        if (image.current?.complete) {
            watchGif()
            onGifVisible(gif) // gif is visible, perhaps just partially
        }
        fullGifObserver.current?.disconnect()
        setHasFiredSeen(false)
        // We only want to fire this when gif id changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gif.id])

    useEffect(() => {
        showGifObserver.current = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            const { isIntersecting } = entry
            // show the gif if the container is on the screen
            setShouldShowMedia(isIntersecting)
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

    const heightBasedOnWidth = getGifHeight(gif, width)

    let height = forcedHeight
    // if we have aspect ratio set, then don't use heightBasedOnWidth
    if (!style?.aspectRatio && !forcedHeight) {
        height = heightBasedOnWidth
    }

    const bestRendition = getBestRendition(gif.images, width, forcedHeight || heightBasedOnWidth)
    if (!bestRendition) {
        if (gif.images) {
            console.error(`no rendition for ${gif.id}, rendition names: ${Object.keys(gif.images).join(', ')}`)
        } else {
            console.error(`no rendition for ${gif.id} - no images`)
        }
        return null
    }
    const rendition = gif.images[bestRendition.renditionName] as ImageAllTypes
    const removeBackground = loadedClassname === Gif.imgLoadedClassName && !gif.is_sticker
    const background = removeBackground
        ? 'unset' // the background will peek through if there's subpixel rendering, remove it after the gif loads
        : backgroundColor || // <- specified background prop
          // sticker has black if no backgroundColor is specified
          (gif.is_sticker
              ? `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4AQMAAACSSKldAAAABlBMVEUhIiIWFhYoSqvJAAAAGElEQVQY02MAAv7///8PWxqIPwDZw5UGABtgwz2xhFKxAAAAAElFTkSuQmCC') 0 0`
              : defaultBgColor.current)

    const overflow = borderRadius ? 'hidden' : 'unset'
    return (
        <Container
            as={noLink ? 'div' : 'a'}
            href={noLink ? undefined : gif.url}
            data-giphy-id={gif.id}
            data-giphy-is-sticker={gif.is_sticker}
            style={{
                width: percentWidth || width,
                height: percentHeight || height,
                overflow,
                borderRadius,
                ...style,
            }}
            className={[Gif.className, className].join(' ')}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onContextMenu={(e: SyntheticEvent<HTMLElement, Event>) => onGifRightClick(gif, e)}
            onKeyPress={onKeyPress}
            tabIndex={tabIndex}
            ref={container}
        >
            <picture>
                <source
                    type="image/webp"
                    srcSet={shouldShowMedia ? rendition.webp : placeholder}
                    suppressHydrationWarning
                />
                <img
                    ref={image}
                    suppressHydrationWarning
                    className={[Gif.imgClassName, loadedClassname].join(' ')}
                    src={shouldShowMedia ? rendition.url : placeholder}
                    style={{ background }}
                    width="100%"
                    height="100%"
                    alt={getAltText(gif)}
                    onLoad={shouldShowMedia ? onImageLoad : () => {}}
                />
            </picture>
            {isAd && bottleData?.tags?.map((tag: string, index: number) => <BottleData src={tag} key={index} />)}
            {Overlay && (
                // only render the overlay on the client since it depends on shouldShowMedia
                <RenderOnClient>
                    {shouldShowMedia && <Overlay gif={gif} isHovered={isHovered} width={width} height={height} />}
                </RenderOnClient>
            )}
        </Container>
    )
}

Gif.className = 'giphy-gif'
Gif.imgClassName = 'giphy-gif-img'
Gif.imgLoadedClassName = 'giphy-img-loaded'

export default Gif
