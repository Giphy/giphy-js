'use client'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { GifOverlayProps } from '../types'
import Video from './'
import { VolumeOffIcon, VolumeOnIcon } from './controls/volume'

const VideoContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 100%;
`

const VideoStyled = styled(Video)`
    height: 100%;
    display: inline-block;
    object-fit: fill;
    pointer-events: none;
    background: rgb(0, 0, 0, 0);
`
const Button = styled.div<{ $isHovered: boolean }>`
    position: absolute;
    top: 6px;
    right: 6px;
    cursor: pointer;
    opacity: ${(props) => (props.$isHovered ? 1 : 0.8)};
    transition: opacity ease-out 800ms;
`

const speakerClassName = 'giphy-video-overlay-button'

type VolumeButtonProps = {
    toggleMute: () => void
    muted: boolean | undefined
    mutedByBrowser: boolean
}
const VolumeButton = ({ muted, toggleMute, mutedByBrowser, isHovered }: VolumeButtonProps & { isHovered: boolean }) => (
    <Button
        className={speakerClassName}
        onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleMute()
        }}
        $isHovered={isHovered}
    >
        {muted || mutedByBrowser || !isHovered ? <VolumeOffIcon /> : <VolumeOnIcon />}
    </Button>
)

const VideoOverlay = ({
    gif,
    isHovered,
    hideMuteButton,
    width,
    height,
    className,
    muted: userPrefMuted = false,
    onUserMuted,
}: GifOverlayProps & {
    width: number
    height?: number
    className?: string
    muted?: boolean // force this to be muted
    hideMuteButton?: boolean
    onUserMuted?: (muted: boolean) => void // for saving the state of the user muted
}) => {
    const [muted, setMuted] = useState<boolean | undefined>(userPrefMuted)
    const [mutedByBrowser, setMutedByBrowser] = useState(false)
    const lastMutedState = useRef(muted)

    const toggleMute = () => {
        if (mutedByBrowser) {
            setMutedByBrowser(false)
            setMuted(false)
        } else {
            onUserMuted?.(!muted)
            setMuted(!muted)
        }
    }
    useEffect(() => {
        setMuted(userPrefMuted)
    }, [userPrefMuted, setMuted])

    useEffect(() => {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                lastMutedState.current = muted
                setMuted(true)
            } else {
                setMuted(lastMutedState.current)
            }
        })
    }, [muted, setMuted])

    const props = { toggleMute, muted, mutedByBrowser }
    return (
        <VideoContainer className={className}>
            {isHovered && (
                <VideoStyled
                    gif={gif}
                    key={gif.id}
                    loop
                    controls
                    hideAttribution
                    hideMute
                    persistentControls
                    muted={muted}
                    width={width}
                    height={height}
                    onMuted={setMutedByBrowser}
                />
            )}
            {!hideMuteButton && <VolumeButton {...props} isHovered={isHovered} />}
        </VideoContainer>
    )
}

VideoOverlay.imgClassName = speakerClassName
export default VideoOverlay
