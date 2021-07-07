import styled from '@emotion/styled'
import { getGifHeight } from '@giphy/js-util'
import React, { ComponentProps, useCallback, useEffect, useState } from 'react'
import VideoWrapper from './'
import { PauseIcon, PlayIcon } from './controls/play-pause'
import { VolumeOffIcon, VolumeOnIcon } from './controls/volume'
import ProgressBar from './progress-bar'
import Video, { MEDIA_STATE } from './video'

const Container = styled.div`
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
`

const PlayPause = styled.div``

const Volume = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Controls = styled.div<{ isHovered: boolean }>`
    position: absolute;
    bottom: 10px;
    right: 10px;
    left: 10px;
    display: flex;
    justify-content: space-between;
    opacity: ${(props) => (props.isHovered ? 1 : 0)};
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
        (args) => {
            onStateChange?.(args)
            setPlayState(args)
        },
        [onStateChange, setPlayState]
    )
    const combinedOnMuted = useCallback(
        (args) => {
            onMuted?.(args)
            setMutedByBrowser(args)
        },
        [setMutedByBrowser, onMuted]
    )
    const combinedSetVideoEl = useCallback(
        (args) => {
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
        <Container
            className={className}
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
            <Controls isHovered={persistentControls || isHovered}>
                {videoEl && !hidePlayPause ? (
                    <PlayPause
                        onClick={() => {
                            if (playState === 'playing') videoEl.pause()
                            else videoEl.play()
                        }}
                    >
                        {playState === 'playing' ? <PauseIcon /> : <PlayIcon />}
                    </PlayPause>
                ) : (
                    <div />
                )}
                {!hideMute && (
                    <Volume
                        onClick={(e) => {
                            onUserMuted?.(!muted)
                            e.preventDefault()
                            toggleMute()
                        }}
                    >
                        {muted || mutedByBrowser ? <VolumeOffIcon /> : <VolumeOnIcon />}
                    </Volume>
                )}
            </Controls>
            {(persistentControls || isHovered) && !hideProgressBar && videoEl ? (
                <ProgressBar videoEl={videoEl} />
            ) : null}
        </Container>
    )
}
export default VideoPlayer
