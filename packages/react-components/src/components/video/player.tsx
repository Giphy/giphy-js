import styled from '@emotion/styled'
import React, { ComponentProps, useCallback, useState } from 'react'
import VideoWrapper from './'
import { PauseIcon, PlayIcon } from './controls/play-pause'
import { VolumeOffIcon, VolumeOnIcon } from './controls/volume'
import Video, { MEDIA_STATE } from './video'

const Container = styled.div`
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .${Video.className} {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
`

const PlayPause = styled.div``

const Volume = styled.div``

const Controls = styled.div<{ isHovered: boolean }>`
    position: absolute;
    bottom: 5px;
    right: 5px;
    left: 5px;
    display: flex;
    justify-content: space-between;
    opacity: ${(props) => (props.isHovered ? 1 : 0)};
    transition: opacity ease-out 250ms;
`

const VideoPlayer = (props: ComponentProps<typeof VideoWrapper>) => {
    const [isHovered, setIsHovered] = useState(false)
    const [playState, setPlayState] = useState<MEDIA_STATE>('paused')
    const [videoEl, _setVideoEl] = useState<HTMLVideoElement | null>(null)
    const [muted, setMuted] = useState<boolean | undefined>(props.muted)
    const [mutedByBrowser, setMutedByBrowser] = useState(false)
    const { onStateChange, setVideoEl, onMuted, onUserMuted } = props
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
    return (
        <Container
            style={{ width: props.width }}
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
            <Controls isHovered={isHovered}>
                {videoEl && (
                    <PlayPause
                        onClick={() => {
                            if (playState === 'playing') videoEl.pause()
                            else videoEl.play()
                        }}
                    >
                        {playState === 'playing' ? <PauseIcon /> : <PlayIcon />}
                    </PlayPause>
                )}
                <Volume
                    onClick={(e) => {
                        onUserMuted?.(!muted)
                        e.preventDefault()
                        toggleMute()
                    }}
                >
                    {muted || mutedByBrowser ? <VolumeOffIcon /> : <VolumeOnIcon />}
                </Volume>
            </Controls>
        </Container>
    )
}
export default VideoPlayer
