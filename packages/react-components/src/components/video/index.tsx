import { IGif } from '@giphy/js-types'
import { getGifHeight } from '@giphy/js-util'
import React, { useCallback, useEffect, useRef } from 'react'
import getBestMedia from './rendition-selection'
import { getErrorMessage } from './util'

export type MEDIA_STATE = 'playing' | 'paused'

type Props = {
    onStateChange?: (state: MEDIA_STATE) => void
    onTimeUpdate?: (playhead: number) => void
    onError?: (error: number) => void
    onCanPlay?: () => void
    onEnded?: () => void
    onLoop?: () => void
    setFullscreen?: (isFullscreen: boolean) => void
    setVideoEl?: (el: HTMLVideoElement) => void
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
    onError,
    onEnded,
    onLoop,
    setFullscreen,
    setVideoEl,
    gif,
    width,
    height,
    volume = 0.7,
    className,
}: Props) => {
    const _height = height || getGifHeight(gif, width)
    const media = useRef(getBestMedia(gif.video, width, _height))
    const loopNumber = useRef<number>(0)
    const previousPlayhead = useRef<number>(0)

    useEffect(() => {
        media.current = getBestMedia(gif.video, width, _height)
    }, [width, height])

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
    const _onPlaying = useCallback(() => onStateChange?.('playing'), [])
    const _onPaused = useCallback(() => onStateChange?.('paused'), [])
    const _onTimeUpdate = useCallback(() => onTimeUpdate?.(videoEl.current?.currentTime || 0), [videoEl])
    const _onCanPlay = useCallback(() => onCanPlay?.(), [])
    const _onEnded = useCallback(() => onEnded?.(), [])
    const _onEndFullscreen = useCallback(() => setFullscreen?.(false), [])

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
                el.removeEventListener('webkitendfullscreen', _onEndFullscreen)
            }
        }
    }, [])
    useEffect(() => {
        const el = videoEl.current
        if (el) {
            const playhead = el.currentTime
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
            height={_height}
            loop={loop}
            muted={muted}
            playsInline
            ref={videoEl}
            src={media.current.url}
        />
    ) : null
}

export default Video
