import { IGif } from '@giphy/js-types'
import { getGifHeight } from '@giphy/js-util'
import React, { useCallback, useEffect, useRef } from 'react'
import getBestMedia from './rendition-selection'
import { getErrorMessage, shouldFireQuartile } from './util'

export type QuartileEvent = 0.25 | 0.5 | 0.75
const quartileEvents: QuartileEvent[] = [0.25, 0.5, 0.75]
export type MEDIA_STATE = 'playing' | 'paused'
const Network = {
    // The element has not yet been initialized. All attributes are in their initial states.
    EMPTY: 0,
    // The element's resource selection algorithm is active and has selected a resource, but it is not actually using the network at this time.
    IDLE: 1,
    // The user agent is actively trying to download data.
    LOADING: 2,
    // The element's resource selection algorithm is active, but it has not yet found a resource to use.
    NO_SOURCE: 3,
}

type Props = {
    onStateChange?: (state: MEDIA_STATE) => void
    onTimeUpdate?: (playhead: number) => void
    onError?: (error: number) => void
    onCanPlay?: () => void
    onFirstPlay?: (msTillPlay: number) => void
    onEnded?: () => void
    onWaiting?: (count: number) => void
    onLoop?: () => void
    onEndFullscreen?: () => void
    setVideoEl?: (el: HTMLVideoElement) => void
    onQuartile?: (quartile: QuartileEvent) => void
    muted?: boolean
    loop?: boolean
    gif: IGif
    width: number
    height?: number
    volume?: number
    className?: string
}
const Video = ({
    muted = false,
    loop = true,
    onStateChange,
    onTimeUpdate,
    onCanPlay,
    onFirstPlay,
    onWaiting,
    onError,
    onEnded,
    onLoop,
    onQuartile,
    onEndFullscreen,
    setVideoEl,
    gif,
    width,
    height: height_,
    volume = 0.7,
    className,
}: Props) => {
    const height = height_ || getGifHeight(gif, width)

    // state
    const media = useRef(getBestMedia(gif.video, width, height))
    const mountTime = useRef(Date.now())
    const hasPlayingFired = useRef(false)
    const loopNumber = useRef<number>(0)
    const waitingCount = useRef<number>(0)
    const previousPlayhead = useRef<number>(0)
    const quartilesFired = useRef<Set<number>>(new Set())

    // reset the above when the gif.id changes
    useEffect(() => {
        mountTime.current = Date.now()
        hasPlayingFired.current = false
        loopNumber.current = 0
        waitingCount.current = 0
        previousPlayhead.current = 0
        quartilesFired.current = new Set()
    }, [gif.id])

    useEffect(() => {
        media.current = getBestMedia(gif.video, width, height)
    }, [width, height_])

    const videoEl = useRef<HTMLVideoElement | null>(null)

    const _onError = () => {
        const el = videoEl.current
        const code = el?.error?.code
        if (code && el?.src) {
            const message = getErrorMessage(code, el?.src)
            console.error(message)
            onError?.(code)
        }
    }
    const _onPlaying = useCallback(() => {
        onStateChange?.('playing')
        if (!hasPlayingFired.current) {
            hasPlayingFired.current = true
            onFirstPlay?.(Date.now() - mountTime.current)
        }
    }, [])
    const _onPaused = useCallback(() => onStateChange?.('paused'), [])
    const _onTimeUpdate = useCallback(() => onTimeUpdate?.(videoEl.current?.currentTime || 0), [videoEl])
    const _onCanPlay = useCallback(() => onCanPlay?.(), [])
    const _onWaiting = useCallback(() => {
        const el = videoEl.current
        // we get a waiting event after a loop, so ignore the first one while the play head is 0
        if (el?.currentTime !== 0 && el?.networkState !== Network.IDLE) {
            onWaiting?.(++waitingCount.current)
        }
    }, [])
    const _onEnded = useCallback(() => onEnded?.(), [])
    const _onEndFullscreen = useCallback(() => onEndFullscreen?.(), [])

    useEffect(() => {
        if (videoEl.current) {
            const el = videoEl.current
            setVideoEl?.(el)
            if (!isNaN(volume)) {
                el.volume = volume
            }
            el.addEventListener('play', _onPlaying)
            el.addEventListener('pause', _onPaused)
            el.addEventListener('error', _onError)
            el.addEventListener('timeupdate', _onTimeUpdate)
            el.addEventListener('canplay', _onCanPlay)
            el.addEventListener('ended', _onEnded)
            el.addEventListener('waiting', _onWaiting)
            el.addEventListener('webkitendfullscreen', _onEndFullscreen) // this is needed for iOS
        }
        return () => {
            const el = videoEl.current
            if (el) {
                el.removeEventListener('play', _onPlaying)
                el.removeEventListener('pause', _onPaused)
                el.removeEventListener('error', _onError)
                el.removeEventListener('timeupdate', _onTimeUpdate)
                el.removeEventListener('canplay', _onCanPlay)
                el.removeEventListener('ended', _onEnded)
                el.removeEventListener('waiting', _onWaiting)
                el.removeEventListener('webkitendfullscreen', _onEndFullscreen)
            }
        }
    }, [])
    useEffect(() => {
        const el = videoEl.current
        if (el) {
            const playhead = el.currentTime
            quartileEvents.some((q: QuartileEvent) => {
                if (shouldFireQuartile(q, playhead, el.duration, quartilesFired.current, loopNumber.current)) {
                    onQuartile?.(q)
                    return true
                }
                return false
            })
            if (Math.floor(playhead) === 0 && Math.floor(previousPlayhead.current) > 0) {
                if (loop && loopNumber.current === 0) {
                    // we're looping so we need to fire our ended event here. Should only fire ONCE at end of first loop.
                    onEnded?.()
                }
                onLoop?.()
                loopNumber.current = loopNumber.current++
            }
            previousPlayhead.current = playhead
        }
    }, [videoEl.current?.currentTime])
    return media.current?.url ? (
        <video
            className={className}
            autoPlay
            width={width}
            height={height}
            loop={loop}
            muted={muted}
            playsInline
            ref={videoEl}
            src={media.current.url}
        />
    ) : null
}

export default Video
