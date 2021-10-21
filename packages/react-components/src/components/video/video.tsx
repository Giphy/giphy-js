import { pingback } from '@giphy/js-analytics'
import { IGif, IImage } from '@giphy/js-types'
import { getBestVideo, getGifHeight } from '@giphy/js-util'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage, QuartileEvent, shouldFireQuartile } from './util'

const quartileEvents: QuartileEvent[] = [0.25, 0.5, 0.75]
export type MEDIA_STATE = 'playing' | 'paused'
const videoClassName = 'giphy-video'
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

type IVideo = NonNullable<IGif['video']>

type Props = {
    onStateChange?: (state: MEDIA_STATE) => void
    onTimeUpdate?: (playhead: number) => void
    onError?: (error: number) => void
    onCanPlay?: () => void
    onFirstPlay?: (msTillPlay: number) => void
    onEnded?: () => void
    onWaiting?: (count: number) => void
    onLoop?: (count: number) => void
    onEndFullscreen?: () => void
    setVideoEl?: (el: HTMLVideoElement) => void
    onQuartile?: (quartile: QuartileEvent) => void
    onMuted?: (isMuted: boolean) => void
    muted?: boolean
    ccEnabled?: boolean
    ccLanguage?: keyof NonNullable<IVideo['captions']>
    loop?: boolean
    gif: IGif
    width: number
    height?: number
    volume?: number
    className?: string
}
const Video = ({
    muted,
    ccEnabled = false,
    ccLanguage = 'en',
    loop = true,
    onStateChange,
    onTimeUpdate,
    onCanPlay,
    onFirstPlay,
    onWaiting,
    onMuted,
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
    className = videoClassName,
}: Props) => {
    const height = height_ || getGifHeight(gif, width)

    // state
    const [media, setMedia] = useState(getBestVideo(gif.video, width, height))
    const seek = useRef(0)

    if (!media) {
        // Not all gif requests have video content
        // use { type: 'videos' } for search or trending endpoints
        console.warn(`GiphyJS No video content for id: ${gif.id}`)
    }

    const mountTime = useRef(Date.now())
    const hasPlayingFired = useRef(false)
    const loopNumber = useRef<number>(0)
    const waitingCount = useRef<number>(0)
    const quartilesFired = useRef<Set<number>>(new Set())

    // reset the above when the gif.id changes
    useEffect(() => {
        mountTime.current = Date.now()
        hasPlayingFired.current = false
        loopNumber.current = 1
        waitingCount.current = 0
        quartilesFired.current = new Set()
    }, [gif.id])

    const videoEl = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        // when the width and height change, check if there's a new url
        const newMedia = getBestVideo(gif.video, width, height) as IImage
        if (videoEl.current && media?.url && newMedia.url !== media.url) {
            // we may have changed gifs, we don't want to seek then
            if (media.url.indexOf(String(gif.id)) !== -1) {
                // when the media changes set the current seek time
                seek.current = videoEl.current.currentTime
            }
            // triggers re-render with above seek time
            setMedia(newMedia)
        }
    }, [width, height_, gif.video, height, media?.url, gif.id])

    useEffect(() => {
        if (videoEl.current && media?.url && seek.current) {
            videoEl.current.currentTime = seek.current
            seek.current = 0
        }
    }, [media?.url, seek])

    const _onError = useCallback(() => {
        const el = videoEl.current
        const code = el?.error?.code
        if (code && el?.src) {
            const message = getErrorMessage(code, el?.src)
            console.error(message)
            onError?.(code)
        }
    }, [onError])
    const _onPlaying = useCallback(() => {
        onStateChange?.('playing')
        if (!hasPlayingFired.current) {
            hasPlayingFired.current = true
            if (gif.analytics_response_payload) {
                pingback({ actionType: 'START', analyticsResponsePayload: gif.analytics_response_payload })
            }
            onFirstPlay?.(Date.now() - mountTime.current)
        }
    }, [onFirstPlay, onStateChange, gif])
    const _onPaused = useCallback(() => onStateChange?.('paused'), [onStateChange])
    const _onTimeUpdate = useCallback(() => {
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
            onTimeUpdate?.(playhead || 0)
        }
    }, [onQuartile, onTimeUpdate])
    const _onCanPlay = useCallback(() => onCanPlay?.(), [onCanPlay])
    const _onWaiting = useCallback(() => {
        const el = videoEl.current
        // we get a waiting event after a loop, so ignore the first one while the play head is 0
        if (el?.currentTime !== 0 && el?.networkState !== Network.IDLE) {
            onWaiting?.(++waitingCount.current)
        }
    }, [onWaiting])
    const _onEnded = useCallback(() => {
        // helps prevent two ended events when changing media
        if (!hasPlayingFired.current) {
            return
        }
        if (loop && videoEl.current) {
            videoEl.current.play()
        }
        onLoop?.(loopNumber.current)
        loopNumber.current = loopNumber.current + 1
        onEnded?.()
    }, [onEnded, loop, onLoop])
    const _onEndFullscreen = useCallback(() => onEndFullscreen?.(), [onEndFullscreen])
    const tryAutoPlayWithSound = useCallback(
        async (videoEl: HTMLVideoElement) => {
            if (videoEl) {
                const promisePlay = videoEl.play()
                if (promisePlay !== undefined) {
                    try {
                        await promisePlay
                        onMuted?.(false)
                    } catch (error) {
                        // Autoplay not allowed!
                        // Mute video and try to play again
                        videoEl.muted = true
                        // Allow the UI to show that the video is muted
                        onMuted?.(true)
                        videoEl.play()
                    }
                }
            }
        },
        [onMuted]
    )

    useEffect(() => {
        const el = videoEl.current
        if (el) {
            tryAutoPlayWithSound(el)
            setVideoEl?.(el)
            if (!isNaN(volume)) {
                el.volume = volume
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const el = videoEl.current
        if (el) {
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
    }, [_onPlaying, _onPaused, _onError, _onTimeUpdate, _onCanPlay, _onEnded, _onWaiting, _onEndFullscreen])
    const captionSrc = gif.video?.captions?.[ccLanguage]?.vtt
    return media?.url ? (
        <video
            crossOrigin="anonymous"
            draggable={true}
            className={className}
            width={width}
            height={height}
            muted={muted}
            autoPlay
            playsInline
            ref={videoEl}
            src={media?.url}
        >
            {ccEnabled && captionSrc && (
                <track label="English" kind="subtitles" srcLang={ccLanguage} src={captionSrc} default />
            )}
        </video>
    ) : null
}

Video.className = videoClassName

export default Video
