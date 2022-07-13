import { css, cx } from '@emotion/css'
import { getGifHeight } from '@giphy/js-util'
import { useCallback, useEffect, useState } from 'preact/hooks'
import VideoWrapper from './'
import { PauseIcon, PlayIcon } from './controls/play-pause'
import { VolumeOffIcon, VolumeOnIcon } from './controls/volume'
import ProgressBar from './progress-bar'
import Video, { MEDIA_STATE } from './video'
import { h, ComponentProps } from 'preact'

const containerCss = css`
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
`

const volumeCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
`

const controlsCss = css`
    position: absolute;
    bottom: 10px;
    right: 10px;
    left: 10px;
    display: flex;
    justify-content: space-between;
    transition: opacity ease-out 250ms;
`

const VideoPlayer = (props: ComponentProps<typeof VideoWrapper>) => {
    const { width, hideMute, hidePlayPause, hideProgressBar, className, persistentControls } = props
    const [isHovered, setIsHovered] = useState(false)
    const [playState, setPlayState] = useState<MEDIA_STATE>('paused')
    const [videoEl, _setVideoEl] = useState<HTMLVideoElement | null>(null)
    const [muted, setMuted] = useState<boolean | undefined>(props.muted)
    const [mutedByBrowser, setMutedByBrowser] = useState(false)
    const { onStateChange, setVideoEl, onMuted, onUserMuted } = props
    const height = props.height || getGifHeight(props.gif, width)

    const combinedSetPlayState = useCallback(
        (args: MEDIA_STATE) => {
            onStateChange?.(args)
            setPlayState(args)
        },
        [onStateChange, setPlayState]
    )
    const combinedOnMuted = useCallback(
        (args: boolean) => {
            onMuted?.(args)
            setMutedByBrowser(args)
        },
        [setMutedByBrowser, onMuted]
    )
    const combinedSetVideoEl = useCallback(
        (args: HTMLVideoElement) => {
            setVideoEl?.(args)
            _setVideoEl(args)
        },
        [setVideoEl, _setVideoEl]
    )
    const toggleMute = () => {
        if (mutedByBrowser) {
            setMutedByBrowser(false)
            setMuted(false)
        } else {
            setMuted(!muted)
        }
    }
    useEffect(() => {
        setMuted(props.muted)
    }, [props.muted])
    return (
        <div
            className={cx(containerCss, className)}
            style={{ width, height }}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Video
                {...props}
                onStateChange={combinedSetPlayState}
                onMuted={combinedOnMuted}
                setVideoEl={combinedSetVideoEl}
                muted={muted}
            />
            <div style={{ opacity: persistentControls || isHovered ? 1 : 0 }} className={controlsCss}>
                {videoEl && !hidePlayPause ? (
                    <div
                        onClick={() => {
                            if (playState === 'playing') videoEl.pause()
                            else videoEl.play()
                        }}
                    >
                        {playState === 'playing' ? <PauseIcon /> : <PlayIcon />}
                    </div>
                ) : (
                    <div />
                )}
                {!hideMute && (
                    <div
                        className={volumeCss}
                        onClick={(e) => {
                            onUserMuted?.(!muted)
                            e.preventDefault()
                            toggleMute()
                        }}
                    >
                        {muted || mutedByBrowser ? <VolumeOffIcon /> : <VolumeOnIcon />}
                    </div>
                )}
            </div>
            {(persistentControls || isHovered) && !hideProgressBar && videoEl ? (
                <ProgressBar videoEl={videoEl} />
            ) : null}
        </div>
    )
}
export default VideoPlayer
